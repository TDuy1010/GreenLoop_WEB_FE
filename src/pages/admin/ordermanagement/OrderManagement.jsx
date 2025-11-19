import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, Input, Select, Button, message, Space, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import OrderAdd from './components/OrderAdd';
import OrderEdit from './components/OrderEdit';
import { getAdminOrders, getAdminOrderDetail } from '../../../service/api/orderApi';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ORDER_STATUS_MAP = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const PAYMENT_STATUS_MAP = {
  PAID: 'paid',
  UNPAID: 'pending',
  FAILED: 'failed',
  REFUNDED: 'paid'
};

const PAYMENT_METHOD_MAP = {
  PAYOS: 'payos',
  COD: 'cod',
};

const buildAddressString = (address = {}) => {
  const parts = [
    address.receiverAddress,
    address.receiverWardName,
    address.receiverDistrictName,
    address.receiverCityName
  ].filter(Boolean);
  return parts.join(', ');
};

const mapOrderItemsFromApi = (items = []) =>
  items.map(item => ({
    orderItemId: item.orderItemId,
    productId: item.productId,
    productName: item.productName || `Sản phẩm #${item.productId}`,
    quantity: item.quantity || 0,
    price: item.price || 0,
    total: (item.price || 0) * (item.quantity || 0),
    image:
      item.image ||
      item.imageUrl ||
      'https://via.placeholder.com/80x80.png?text=GreenLoop'
  }));

const mapAdminOrderToComponent = (order) => {
  const shipping = order?.shippingAddress || {};
  const subtotal = Math.max(0, (order?.totalPrice ?? 0) - (order?.shippingFee ?? 0));
  const carrierName = order?.carrier;

  return {
    id: order?.orderId,
    orderNumber: order?.orderCode,
    customerName: shipping.receiverName || `Khách #${order?.customerId ?? ''}`,
    customerEmail: order?.customerEmail || shipping.receiverEmail || '—',
    customerPhone: shipping.receiverPhone || '—',
    customerAddress: buildAddressString(shipping) || shipping.receiverAddress || '—',
    items: mapOrderItemsFromApi(order?.orderItems),
    subtotal,
    shippingFee: order?.shippingFee ?? 0,
    discount: 0,
    totalAmount: order?.totalPrice ?? 0,
    paymentMethod:
      PAYMENT_METHOD_MAP[order?.paymentMethod] || order?.paymentMethod?.toLowerCase() || 'cod',
    paymentStatus: PAYMENT_STATUS_MAP[order?.paymentStatus] || 'pending',
    orderStatus: ORDER_STATUS_MAP[order?.orderStatus] || 'pending',
    shippingMethod: order?.shippingStatus?.toLowerCase?.() || carrierName || 'standard',
    carrierName,
    trackingNumber:
      order?.goshipTrackingCode || (order?.paymentOrderCode ? String(order.paymentOrderCode) : null),
    orderDate: order?.createdAt,
    paymentDate: order?.paymentStatus === 'PAID' ? order?.updatedAt : null,
    shippingDate: order?.expectedDeliveryTime,
    deliveredDate: null,
    note: shipping?.note || '',
  };
};

const OrderManagement = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const { current, pageSize } = tableParams;

  const [orderData, setOrderData] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const statusParam = statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined;
      const paymentParam =
        paymentFilter !== 'all'
          ? paymentFilter === 'pending'
            ? 'UNPAID'
            : paymentFilter.toUpperCase()
          : undefined;

      const response = await getAdminOrders({
        page: current - 1,
        size: pageSize,
        status: statusParam,
        paymentStatus: paymentParam,
        searchKeyword: searchText || undefined,
        fromDate: dateRange?.[0]?.format?.('YYYY-MM-DD'),
        toDate: dateRange?.[1]?.format?.('YYYY-MM-DD')
      });

      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể tải danh sách đơn hàng');
      }

      const payload = response?.data || response;
      const content = Array.isArray(payload?.content)
        ? payload.content
        : Array.isArray(payload)
          ? payload
          : [];
      const mappedOrders = content.map(mapAdminOrderToComponent);

      setOrderData(mappedOrders);
      setTableParams(prev => ({
        ...prev,
        total: payload?.totalElements ?? mappedOrders.length,
        pageSize: payload?.pageSize ?? prev.pageSize,
        current: (payload?.pageNumber ?? prev.current - 1) + 1
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, statusFilter, paymentFilter, searchText, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredData = orderData;

  // Statistics
  const stats = useMemo(() => {
    const total = tableParams.total || orderData.length;
    const pending = orderData.filter(o => o.orderStatus === 'pending').length;
    const processing = orderData.filter(o => o.orderStatus === 'processing').length;
    const shipping = orderData.filter(o => o.orderStatus === 'shipping').length;
    const delivered = orderData.filter(o => o.orderStatus === 'delivered').length;
    const cancelled = orderData.filter(o => o.orderStatus === 'cancelled').length;
    
    const totalRevenue = orderData
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    const avgOrderValue = totalRevenue / orderData.filter(o => o.paymentStatus === 'paid').length || 0;

    return { 
      total, 
      pending, 
      processing, 
      shipping, 
      delivered, 
      cancelled, 
      totalRevenue, 
      avgOrderValue 
    };
  }, [orderData, tableParams.total]);

  const handleTableChange = (pagination) => {
    setTableParams(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setTableParams(prev => ({ ...prev, current: 1 }));
  };

  const handlePaymentFilterChange = (value) => {
    setPaymentFilter(value);
    setTableParams(prev => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setTableParams(prev => ({ ...prev, current: 1 }));
  };

  const handleSearchSubmit = (value) => {
    const trimmed = value.trim();
    setSearchInput(trimmed);
    setSearchText(trimmed);
    setTableParams(prev => ({ ...prev, current: 1 }));
  };

  const tablePaginationConfig = {
    current,
    pageSize,
    total: tableParams.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
    pageSizeOptions: ['10', '20', '50', '100'],
  };

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddOrder = (newOrder) => {
    const updatedData = [...orderData, newOrder];
    setOrderData(updatedData);
    message.success('Thêm đơn hàng thành công!');
  };

  const handleView = async (order) => {
    const orderId = order?.id || order?.orderId;
    if (!orderId) return;
    setSelectedOrder(order);
    setDetailModalVisible(true);
    setDetailLoading(true);
    try {
      const response = await getAdminOrderDetail(orderId);
      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể tải chi tiết đơn hàng');
      }
      const payload = response?.data || response;
      const mappedOrder = mapAdminOrderToComponent(payload);
      setSelectedOrder(mappedOrder);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditModalVisible(true);
  };

  const handleUpdateOrder = (updatedOrder) => {
    const updatedData = orderData.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setOrderData(updatedData);
    message.success('Cập nhật đơn hàng thành công!');
  };

  const handleDelete = (orderOrId) => {
    const id = typeof orderOrId === 'string' ? orderOrId : orderOrId?.id;
    if (!id) return;
    const newData = orderData.filter(order => order.id !== id);
    setOrderData(newData);
    message.success('Đã xóa đơn hàng khỏi danh sách hiện tại!');
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
    setDetailLoading(false);
  };

  const handleCloseAdd = () => {
    setAddModalVisible(false);
  };

  const handleCloseEdit = () => {
    setEditModalVisible(false);
    setSelectedOrder(null);
  };

  const handleRefresh = () => {
    setSearchInput('');
    setSearchText('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateRange(null);
    setTableParams(prev => ({ ...prev, current: 1 }));
    message.success('Đã làm mới bộ lọc đơn hàng');
  };

  const handleExport = () => {
    message.info('Đang xuất báo cáo đơn hàng...');
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng từ khách hàng</p>
        </div>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Button 
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            Xuất báo cáo
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Tạo đơn hàng
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              suffix="đơn"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.pending + stats.processing}
              suffix="đơn"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã giao hàng"
              value={stats.delivered}
              suffix="đơn"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue}
              suffix="VNĐ"
              valueStyle={{ color: '#722ed1' }}
              formatter={(value) => `${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang giao hàng"
              value={stats.shipping}
              suffix="đơn"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              suffix="đơn"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị TB/đơn"
              value={stats.avgOrderValue}
              suffix="VNĐ"
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `${value?.toLocaleString()}`}
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={(stats.delivered / stats.total * 100) || 0}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo mã đơn, khách hàng, sản phẩm..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (!e.target.value) {
                  setSearchText('');
                  setTableParams(prev => ({ ...prev, current: 1 }));
                }
              }}
              onSearch={handleSearchSubmit}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Trạng thái đơn"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="pending">Chờ xử lý</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="shipping">Đang giao</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Thanh toán"
              style={{ width: '100%' }}
              value={paymentFilter}
              onChange={handlePaymentFilterChange}
            >
              <Option value="all">Tất cả</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="failed">Thất bại</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={2}>
            <div className="text-right">
              <span className="text-gray-600 text-sm">
                {filteredData.length}/{stats.total}
              </span>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <OrderTable 
          data={filteredData}
          loading={loading}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          pagination={tablePaginationConfig}
          onChange={handleTableChange}
        />
      </Card>

      {/* Order Detail Modal */}
      <OrderDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        order={selectedOrder}
        loading={detailLoading}
      />

      {/* Order Add Modal */}
      <OrderAdd
        visible={addModalVisible}
        onClose={handleCloseAdd}
        onAdd={handleAddOrder}
      />

      {/* Order Edit Modal */}
      <OrderEdit
        visible={editModalVisible}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateOrder}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;
