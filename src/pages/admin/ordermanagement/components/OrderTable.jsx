import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Typography, Image } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  TruckOutlined,
  PhoneOutlined,
  SyncOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

const OrderTable = ({
  data,
  loading,
  handleView,
  handleEdit,
  pagination,
  onChange,
  onConfirmOrder,
  confirmingOrderId,
  onProcessOrder,
  processingOrderId,
  onShipOrder,
  shippingOrderId,
  onCancelOrder,
  cancellingOrderId
}) => {
  const handleCall = (record) => {
    if (typeof window === 'undefined' || !record?.customerPhone) return;
    window.open(`tel:${record.customerPhone}`);
  };

  const handlePrint = (record) => {
    console.info('Printing order', record?.orderNumber);
  };

  const handleCancel = (record) => {
    console.info('Cancel order', record?.orderNumber);
  };
  
  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      processing: 'processing',
      shipping: 'cyan',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'success',
      pending: 'warning',
      failed: 'error'
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      paid: 'Đã thanh toán',
      pending: 'Chờ thanh toán',
      failed: 'Thất bại'
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      bank_transfer: 'Chuyển khoản',
      momo: 'MoMo',
      vnpay: 'VNPay',
      cod: 'COD'
    };
    return methods[method] || method;
  };

  const getShippingMethodText = (method) => {
    const methods = {
      standard: 'Tiêu chuẩn',
      express: 'Nhanh',
      same_day: 'Trong ngày'
    };
    return methods[method] || method;
  };

  const formatOrderItems = (items) => {
    if (!items || items.length === 0) return '-';
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-900">
          {totalItems} sản phẩm
        </div>
        {items.slice(0, 2).map((item, index) => (
          <div key={index} className="text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.productName}</span>
            </div>
            <div className="text-gray-500">
              SL: {item.quantity} × {item.price.toLocaleString()}đ
            </div>
          </div>
        ))}
        {items.length > 2 && (
          <div className="text-xs text-blue-600">
            +{items.length - 2} sản phẩm khác
          </div>
        )}
      </div>
    );
  };


  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 120,
      fixed: 'left',
      render: (orderNumber, record) => (
        <div>
          <Text strong className="text-blue-600 cursor-pointer hover:underline">
            {orderNumber}
          </Text>
          <div className="text-xs text-gray-500">
            {dayjs(record.orderDate).format('DD/MM/YY HH:mm')}
          </div>
        </div>
      ),
      sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.customerName}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <PhoneOutlined className="text-xs" />
            {record.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'items',
      width: 250,
      render: (items) => formatOrderItems(items),
    },
    {
      title: 'Tổng tiền',
      key: 'amount',
      width: 130,
      render: (_, record) => (
        <div>
          <Text strong className="text-green-600 text-base">
            {record.totalAmount.toLocaleString()}đ
          </Text>
          <div className="text-xs text-gray-500">
            <div>Hàng: {record.subtotal.toLocaleString()}đ</div>
            <div>Ship: {record.shippingFee.toLocaleString()}đ</div>
            {record.discount > 0 && (
              <div className="text-red-500">-{record.discount.toLocaleString()}đ</div>
            )}
          </div>
        </div>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 140,
      render: (_, record) => (
        <div className="space-y-1">
          <Tag color={getPaymentStatusColor(record.paymentStatus)}>
            {getPaymentStatusText(record.paymentStatus)}
          </Tag>
          <div className="text-xs text-gray-600">
            {getPaymentMethodText(record.paymentMethod)}
          </div>
          {record.paymentDate && (
            <div className="text-xs text-gray-500">
              {dayjs(record.paymentDate).format('DD/MM HH:mm')}
            </div>
          )}
        </div>
      ),
      filters: [
        { text: 'Đã thanh toán', value: 'paid' },
        { text: 'Chờ thanh toán', value: 'pending' },
        { text: 'Thất bại', value: 'failed' },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 130,
      render: (status, record) => (
        <div className="space-y-1">
          <Tag color={getOrderStatusColor(status)}>
            {getOrderStatusText(status)}
          </Tag>
          {record.trackingNumber && (
            <div className="text-xs text-blue-600">
              <TruckOutlined className="mr-1" />
              {record.trackingNumber}
            </div>
          )}
          <div className="text-xs text-gray-600">
            {getShippingMethodText(record.shippingMethod)}
          </div>
        </div>
      ),
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đã xác nhận', value: 'confirmed' },
        { text: 'Đang xử lý', value: 'processing' },
        { text: 'Đang giao', value: 'shipping' },
        { text: 'Đã giao', value: 'delivered' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.orderStatus === value,
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'customerAddress',
      key: 'customerAddress',
      width: 200,
      render: (address) => (
        <Tooltip title={address}>
          <Text className="text-gray-600">
            {address.length > 40 ? `${address.substring(0, 40)}...` : address}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày giao',
      key: 'deliveryDates',
      width: 120,
      render: (_, record) => (
        <div className="text-xs">
          {record.shippingDate && (
            <div className="text-blue-600">
              Gửi: {dayjs(record.shippingDate).format('DD/MM')}
            </div>
          )}
          {record.deliveredDate && (
            <div className="text-green-600">
              Nhận: {dayjs(record.deliveredDate).format('DD/MM')}
            </div>
          )}
          {!record.shippingDate && !record.deliveredDate && (
            <Text type="secondary">Chưa giao</Text>
          )}
        </div>
      ),
      sorter: (a, b) => {
        const dateA = a.deliveredDate || a.shippingDate || a.orderDate;
        const dateB = b.deliveredDate || b.shippingDate || b.orderDate;
        return dayjs(dateA).unix() - dayjs(dateB).unix();
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      render: (note) => (
        note ? (
          <Tooltip title={note}>
            <Text className="text-gray-600">
              {note.length > 30 ? `${note.substring(0, 30)}...` : note}
            </Text>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          
          {record.orderStatus === 'pending' && (
            <Tooltip title="Xác nhận đơn">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />} 
                size="small"
                className="text-green-600 hover:text-green-700"
                onClick={() => onConfirmOrder?.(record)}
                loading={confirmingOrderId === record.id}
                disabled={confirmingOrderId && confirmingOrderId !== record.id}
              />
            </Tooltip>
          )}

          {record.orderStatus === 'confirmed' && (
            <Tooltip title="Chuyển sang xử lý">
              <Button
                type="text"
                icon={<SyncOutlined />}
                size="small"
                className="text-purple-600 hover:text-purple-700"
                onClick={() => onProcessOrder?.(record)}
                loading={processingOrderId === record.id}
                disabled={processingOrderId && processingOrderId !== record.id}
              />
            </Tooltip>
          )}
          
          {record.orderStatus === 'processing' && (
            <Tooltip title="Giao hàng">
              <Button 
                type="text" 
                icon={<TruckOutlined />} 
                size="small"
                className="text-cyan-600 hover:text-cyan-700"
                onClick={() => onShipOrder?.(record)}
                loading={shippingOrderId === record.id}
                disabled={shippingOrderId && shippingOrderId !== record.id}
              />
            </Tooltip>
          )}

          {record.orderStatus === 'ready_to_ship' && (
            <Tooltip title="Đã sẵn sàng giao, xem vận đơn">
              <Button 
                type="text" 
                icon={<SolutionOutlined />} 
                size="small"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => handleView(record)}
              />
            </Tooltip>
          )}
          
          {['pending', 'confirmed'].includes(record.orderStatus) && (
            <Tooltip title="Hủy đơn">
              <Button 
                type="text" 
                icon={<CloseCircleOutlined />} 
                size="small"
                danger
                className="hover:text-rose-600"
                onClick={() => onCancelOrder?.(record)}
                loading={cancellingOrderId === record.id}
                disabled={cancellingOrderId && cancellingOrderId !== record.id}
              />
            </Tooltip>
          )}
          
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record?.id || record?.orderNumber}
      loading={loading}
      scroll={{ x: 2000, y: 600 }}
      pagination={
        pagination || {
          total: data?.length || 0,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }
      }
      onChange={onChange}
      size="small"
      className="order-table"
      rowClassName={(record) => {
        if (record.orderStatus === 'cancelled') return 'bg-red-50';
        if (record.orderStatus === 'delivered') return 'bg-green-50';
        if (record.paymentStatus === 'failed') return 'bg-orange-50';
        return '';
      }}
    />
  );
};

export default OrderTable;
