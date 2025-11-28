import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, Input, Select, Button, message, Space, DatePicker, Modal, Form, InputNumber, Divider } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import OrderEdit from './components/OrderEdit';
import { getAdminOrders, getAdminOrderDetail, confirmOrderByStaff, processOrderByStaff, createShipmentForOrder, cancelOrderByStaff } from '../../../service/api/orderApi';
import { isStaffOnly } from '../../../utils/authHelper';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ORDER_STATUS_MAP = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  READY_TO_SHIP: 'ready_to_ship',
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

const buildShipmentDefaults = (payload) => {
  const shipping = payload?.shippingAddress || {}
  return {
    weight: 500,
    length: 30,
    width: 20,
    height: 15,
    metadata: `Đơn hàng ${payload?.orderCode || payload?.orderId || ''}`,
    reason: '',
    codAmount: payload?.paymentMethod === 'COD' ? payload?.totalPrice || 0 : 0,
    totalAmount: payload?.totalPrice || 0,
    payer: 0,
    warehouseAddress: {
      name: '',
      phone: '',
      street: '',
      wardCode: '',
      districtId: '',
      cityId: ''
    },
    customerAddress: {
      name: shipping?.receiverName || '',
      phone: shipping?.receiverPhone || '',
      street: shipping?.receiverAddress || '',
      wardCode: shipping?.receiverWardCode || '',
      districtId: shipping?.receiverDistrictId || '',
      cityId: shipping?.receiverCityId || ''
    }
  }
}

const OrderManagement = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [shippingOrderId, setShippingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [shipModalVisible, setShipModalVisible] = useState(false);
  const [shipModalLoading, setShipModalLoading] = useState(false);
  const [shipTargetOrder, setShipTargetOrder] = useState(null);
  const [shipForm] = Form.useForm();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelTargetOrder, setCancelTargetOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

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

  const handleConfirmOrder = useCallback(async (record) => {
    if (!record?.id || confirmingOrderId) return;
    try {
      setConfirmingOrderId(record.id);
      await confirmOrderByStaff(record.id);
      message.success(`Đã xác nhận đơn #${record.orderNumber}`);
      await fetchOrders();
      if (selectedOrder?.id === record.id) {
        const response = await getAdminOrderDetail(record.id);
        const payload = response?.data || response;
        setSelectedOrder(mapAdminOrderToComponent(payload));
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Không thể xác nhận đơn';
      message.error(errMsg);
    } finally {
      setConfirmingOrderId(null);
    }
  }, [confirmingOrderId, fetchOrders, selectedOrder]);

  const handleProcessOrder = useCallback(async (record) => {
    if (!record?.id || processingOrderId) return;
    try {
      setProcessingOrderId(record.id);
      await processOrderByStaff(record.id);
      message.success(`Đơn #${record.orderNumber} đã chuyển sang xử lý`);
      await fetchOrders();
      if (selectedOrder?.id === record.id) {
        const response = await getAdminOrderDetail(record.id);
        const payload = response?.data || response;
        setSelectedOrder(mapAdminOrderToComponent(payload));
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Không thể chuyển đơn sang xử lý';
      message.error(errMsg);
    } finally {
      setProcessingOrderId(null);
    }
  }, [processingOrderId, fetchOrders, selectedOrder]);

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
    setDetailLoading(false);
  };

  const handleOpenShipModal = useCallback(async (record) => {
    if (!record?.id) return;
    setShipModalVisible(true);
    setShippingOrderId(record.id);
    setShipModalLoading(true);
    try {
      const response = await getAdminOrderDetail(record.id);
      if (response?.success === false) {
        throw new Error(response?.message || 'Không lấy được chi tiết đơn hàng');
      }
      const payload = response?.data || response;
      setShipTargetOrder({
        id: record.id,
        orderNumber: record.orderNumber || payload.orderCode || payload.orderId
      });
      shipForm.setFieldsValue(buildShipmentDefaults(payload));
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Không thể mở form tạo vận đơn';
      message.error(errMsg);
      setShipModalVisible(false);
      setShippingOrderId(null);
    } finally {
      setShipModalLoading(false);
    }
  }, [shipForm]);

  const handleCloseShipModal = () => {
    setShipModalVisible(false);
    setShipTargetOrder(null);
    setShippingOrderId(null);
    shipForm.resetFields();
  };

  const handleCreateShipment = async () => {
    if (!shipTargetOrder?.id) return;
    try {
      const values = await shipForm.validateFields();
      setShipModalLoading(true);
      await createShipmentForOrder(shipTargetOrder.id, values);
      message.success('Đã tạo vận đơn cho đơn hàng');
      handleCloseShipModal();
      await fetchOrders();
      if (selectedOrder?.id === shipTargetOrder.id) {
        const response = await getAdminOrderDetail(shipTargetOrder.id);
        const payload = response?.data || response;
        setSelectedOrder(mapAdminOrderToComponent(payload));
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Không thể tạo vận đơn';
      message.error(errMsg);
    } finally {
      setShipModalLoading(false);
    }
  };

  const openCancelModal = useCallback((record) => {
    if (!record?.id || cancellingOrderId) return;
    setCancelModalVisible(true);
    setCancelTargetOrder(record);
    setCancelReason('');
    setCancelError('');
  }, [cancellingOrderId]);

  const handleCancelOrder = useCallback(async () => {
    if (!cancelTargetOrder?.id || cancellingOrderId) return;
    try {
      setCancellingOrderId(cancelTargetOrder.id);
      setCancelError('');
      await cancelOrderByStaff(cancelTargetOrder.id, cancelReason);
      message.success(`Đã hủy đơn #${cancelTargetOrder.orderNumber}`);
      setCancelModalVisible(false);
      await fetchOrders();
      if (selectedOrder?.id === cancelTargetOrder.id) {
        const response = await getAdminOrderDetail(cancelTargetOrder.id);
        const payload = response?.data || response;
        setSelectedOrder(mapAdminOrderToComponent(payload));
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Không thể hủy đơn';
      setCancelError(errMsg);
      message.error(errMsg);
    } finally {
      setCancellingOrderId(null);
    }
  }, [cancelTargetOrder, cancelReason, cancellingOrderId, fetchOrders, selectedOrder]);

  const closeCancelModal = () => {
    setCancelModalVisible(false);
    setCancelTargetOrder(null);
    setCancelReason('');
    setCancelError('');
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
        onConfirmOrder={handleConfirmOrder}
        confirmingOrderId={confirmingOrderId}
        onProcessOrder={handleProcessOrder}
        isStaffOnly={isStaffOnly()}
        processingOrderId={processingOrderId}
        onShipOrder={handleOpenShipModal}
        shippingOrderId={shippingOrderId}
        onCancelOrder={openCancelModal}
        cancellingOrderId={cancellingOrderId}
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

      <Modal
        title={`Tạo vận đơn cho ${shipTargetOrder?.orderNumber || ''}`}
        open={shipModalVisible}
        onCancel={handleCloseShipModal}
        onOk={handleCreateShipment}
        confirmLoading={shipModalLoading}
        okText="Tạo vận đơn"
        cancelText="Đóng"
        width={720}
      >
        <Form layout="vertical" form={shipForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Khối lượng (gram)" name="weight" rules={[{ required: true, message: 'Nhập khối lượng' }]}>
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="COD (₫)" name="codAmount" rules={[{ required: true, message: 'Nhập số tiền COD (0 nếu không)' }]}>
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tổng giá trị đơn (₫)"
              name="totalAmount"
              rules={[{ required: true, message: 'Nhập tổng giá trị đơn' }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Người trả phí ship"
              name="payer"
              rules={[{ required: true, message: 'Chọn người trả phí ship' }]}
            >
              <Select
                options={[
                  { label: 'Khách hàng trả (RECEIVER)', value: 0 },
                  { label: 'Shop trả (SENDER)', value: 1 }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Dài (cm)" name="length" rules={[{ required: true }]}><InputNumber min={1} className="w-full" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Rộng (cm)" name="width" rules={[{ required: true }]}><InputNumber min={1} className="w-full" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Cao (cm)" name="height" rules={[{ required: true }]}><InputNumber min={1} className="w-full" /></Form.Item>
            </Col>
          </Row>
          <Form.Item label="Ghi chú riêng" name="metadata">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Divider orientation="left">Kho gửi hàng</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên kho" name={['warehouseAddress', 'name']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="SĐT kho" name={['warehouseAddress', 'phone']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Địa chỉ" name={['warehouseAddress', 'street']} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Ward code" name={['warehouseAddress', 'wardCode']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="District ID" name={['warehouseAddress', 'districtId']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="City ID" name={['warehouseAddress', 'cityId']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Địa chỉ khách hàng</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên người nhận" name={['customerAddress', 'name']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="SĐT người nhận" name={['customerAddress', 'phone']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Địa chỉ" name={['customerAddress', 'street']} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Ward code" name={['customerAddress', 'wardCode']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="District ID" name={['customerAddress', 'districtId']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="City ID" name={['customerAddress', 'cityId']} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        open={cancelModalVisible}
        title="Hủy đơn hàng"
        onCancel={closeCancelModal}
        footer={null}
        maskClosable={! (cancellingOrderId === cancelTargetOrder?.id)}
        destroyOnClose
        centered
      >
        <div className="text-sm text-gray-600 mb-3">
          Bạn có chắc muốn hủy đơn#{' '}
          <span className="font-semibold text-gray-900">{cancelTargetOrder?.orderNumber}</span>? Lý do hủy
          (không bắt buộc).
        </div>
        <Form layout="vertical">
          <Form.Item label="Lý do hủy">
            <Input.TextArea
              rows={4}
              maxLength={255}
              placeholder="Nhập lý do..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Item>
        </Form>
        {cancelError && <p className="text-rose-600 text-sm -mt-2 mb-4">{cancelError}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={closeCancelModal} disabled={cancellingOrderId === cancelTargetOrder?.id}>
            Không
          </Button>
          <Button
            type="primary"
            danger
            onClick={handleCancelOrder}
            loading={cancellingOrderId === cancelTargetOrder?.id}
          >
            Hủy đơn
          </Button>
        </div>
      </Modal>

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
