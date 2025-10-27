import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Input, Select, Button, message, Space, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import OrderAdd from './components/OrderAdd';
import OrderEdit from './components/OrderEdit';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderManagement = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Mock data cho orders
  const mockOrders = [
    {
      id: 'ORD001',
      orderNumber: 'GL2024001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0123456789',
      customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
      items: [
        { 
          productId: 'P001', 
          productName: 'Túi tote canvas tái chế', 
          price: 150000, 
          quantity: 2, 
          total: 300000,
          image: '/images/tote-bag.jpg'
        },
        { 
          productId: 'P002', 
          productName: 'Ly giữ nhiệt inox', 
          price: 250000, 
          quantity: 1, 
          total: 250000,
          image: '/images/tumbler.jpg'
        }
      ],
      subtotal: 550000,
      shippingFee: 30000,
      discount: 50000,
      totalAmount: 530000,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      shippingMethod: 'standard',
      trackingNumber: 'VN123456789',
      orderDate: '2024-01-15 10:30:00',
      paymentDate: '2024-01-15 11:00:00',
      shippingDate: '2024-01-16 09:00:00',
      deliveredDate: '2024-01-18 14:30:00',
      note: 'Giao hàng giờ hành chính',
      couponCode: 'WELCOME10'
    },
    {
      id: 'ORD002',
      orderNumber: 'GL2024002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerPhone: '0987654321',
      customerAddress: '456 Đường XYZ, Quận 3, TP.HCM',
      items: [
        { 
          productId: 'P003', 
          productName: 'Bộ đũa tre tự nhiên', 
          price: 80000, 
          quantity: 3, 
          total: 240000,
          image: '/images/bamboo-chopsticks.jpg'
        }
      ],
      subtotal: 240000,
      shippingFee: 25000,
      discount: 0,
      totalAmount: 265000,
      paymentMethod: 'momo',
      paymentStatus: 'paid',
      orderStatus: 'shipping',
      shippingMethod: 'express',
      trackingNumber: 'VN987654321',
      orderDate: '2024-01-16 14:20:00',
      paymentDate: '2024-01-16 14:25:00',
      shippingDate: '2024-01-17 08:30:00',
      deliveredDate: null,
      note: 'Khách yêu cầu gọi trước khi giao',
      couponCode: null
    },
    {
      id: 'ORD003',
      orderNumber: 'GL2024003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerPhone: '0369852147',
      customerAddress: '789 Đường DEF, Quận 7, TP.HCM',
      items: [
        { 
          productId: 'P004', 
          productName: 'Hộp cơm inox 3 ngăn', 
          price: 320000, 
          quantity: 1, 
          total: 320000,
          image: '/images/lunch-box.jpg'
        },
        { 
          productId: 'P005', 
          productName: 'Ống hút inox kèm cọ rửa', 
          price: 45000, 
          quantity: 4, 
          total: 180000,
          image: '/images/metal-straw.jpg'
        }
      ],
      subtotal: 500000,
      shippingFee: 35000,
      discount: 75000,
      totalAmount: 460000,
      paymentMethod: 'vnpay',
      paymentStatus: 'paid',
      orderStatus: 'processing',
      shippingMethod: 'standard',
      trackingNumber: null,
      orderDate: '2024-01-17 09:15:00',
      paymentDate: '2024-01-17 09:20:00',
      shippingDate: null,
      deliveredDate: null,
      note: 'Đơn hàng ưu tiên',
      couponCode: 'SAVE15'
    },
    {
      id: 'ORD004',
      orderNumber: 'GL2024004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerPhone: '0258741963',
      customerAddress: '321 Đường GHI, Quận 5, TP.HCM',
      items: [
        { 
          productId: 'P006', 
          productName: 'Túi đựng rau củ lưới cotton', 
          price: 65000, 
          quantity: 5, 
          total: 325000,
          image: '/images/mesh-bag.jpg'
        }
      ],
      subtotal: 325000,
      shippingFee: 30000,
      discount: 32500,
      totalAmount: 322500,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      shippingMethod: 'standard',
      trackingNumber: null,
      orderDate: '2024-01-18 16:45:00',
      paymentDate: null,
      shippingDate: null,
      deliveredDate: null,
      note: 'Thanh toán khi nhận hàng',
      couponCode: 'FIRST10'
    },
    {
      id: 'ORD005',
      orderNumber: 'GL2024005',
      customerName: 'Hoàng Văn E',
      customerEmail: 'hoangvane@email.com',
      customerPhone: '0147258369',
      customerAddress: '654 Đường JKL, Quận 2, TP.HCM',
      items: [
        { 
          productId: 'P007', 
          productName: 'Bình nước thủy tinh 500ml', 
          price: 180000, 
          quantity: 2, 
          total: 360000,
          image: '/images/glass-bottle.jpg'
        },
        { 
          productId: 'P001', 
          productName: 'Túi tote canvas tái chế', 
          price: 150000, 
          quantity: 1, 
          total: 150000,
          image: '/images/tote-bag.jpg'
        }
      ],
      subtotal: 510000,
      shippingFee: 30000,
      discount: 0,
      totalAmount: 540000,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'failed',
      orderStatus: 'cancelled',
      shippingMethod: 'standard',
      trackingNumber: null,
      orderDate: '2024-01-19 11:30:00',
      paymentDate: null,
      shippingDate: null,
      deliveredDate: null,
      note: 'Khách hàng hủy do thanh toán thất bại',
      couponCode: null
    },
    {
      id: 'ORD006',
      orderNumber: 'GL2024006',
      customerName: 'Võ Thị F',
      customerEmail: 'vothif@email.com',
      customerPhone: '0321654987',
      customerAddress: '987 Đường MNO, Quận 10, TP.HCM',
      items: [
        { 
          productId: 'P008', 
          productName: 'Set 3 hộp bảo quản thực phẩm', 
          price: 280000, 
          quantity: 1, 
          total: 280000,
          image: '/images/food-container.jpg'
        }
      ],
      subtotal: 280000,
      shippingFee: 25000,
      discount: 28000,
      totalAmount: 277000,
      paymentMethod: 'momo',
      paymentStatus: 'paid',
      orderStatus: 'pending',
      shippingMethod: 'express',
      trackingNumber: null,
      orderDate: '2024-01-20 13:20:00',
      paymentDate: '2024-01-20 13:25:00',
      shippingDate: null,
      deliveredDate: null,
      note: 'Đơn hàng mới',
      couponCode: 'GREEN10'
    }
  ];

  const [orderData, setOrderData] = useState(mockOrders);

  // Filtered data
  const filteredData = useMemo(() => {
    return orderData.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerPhone.includes(searchText) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchText.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      
      let matchesDate = true;
      if (dateRange && dateRange.length === 2) {
        const orderDate = dayjs(order.orderDate);
        matchesDate = orderDate.isAfter(dateRange[0].startOf('day')) && 
                     orderDate.isBefore(dateRange[1].endOf('day'));
      }
      
      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [searchText, statusFilter, paymentFilter, dateRange, orderData]);

  // Statistics
  const stats = useMemo(() => {
    const total = orderData.length;
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
  }, [orderData]);

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddOrder = (newOrder) => {
    const updatedData = [...orderData, newOrder];
    setOrderData(updatedData);
    message.success('Thêm đơn hàng thành công!');
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
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

  const handleDelete = (id) => {
    const newData = orderData.filter(order => order.id !== id);
    setOrderData(newData);
    message.success('Xóa đơn hàng thành công!');
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

  const handleCloseAdd = () => {
    setAddModalVisible(false);
  };

  const handleCloseEdit = () => {
    setEditModalVisible(false);
    setSelectedOrder(null);
  };

  const handleRefresh = () => {
    message.info('Đã làm mới dữ liệu đơn hàng');
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Trạng thái đơn"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
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
              onChange={setPaymentFilter}
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
              onChange={setDateRange}
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
          loading={false}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </Card>

      {/* Order Detail Modal */}
      <OrderDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        order={selectedOrder}
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
