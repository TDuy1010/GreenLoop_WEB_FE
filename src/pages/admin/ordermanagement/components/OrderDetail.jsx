import React from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Table,
  Steps,
  Timeline,
  Image
} from 'antd'
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  GiftOutlined
} from '@ant-design/icons'

const OrderDetail = ({ visible, onClose, order }) => {
  if (!order) return null

  const orderStatusConfig = {
    pending: { color: 'orange', text: 'Chờ xác nhận', step: 0 },
    confirmed: { color: 'blue', text: 'Đã xác nhận', step: 1 },
    processing: { color: 'cyan', text: 'Đang xử lý', step: 1 },
    shipping: { color: 'geekblue', text: 'Đang giao hàng', step: 2 },
    delivered: { color: 'green', text: 'Đã giao hàng', step: 3 },
    cancelled: { color: 'red', text: 'Đã hủy', step: -1 },
    returned: { color: 'volcano', text: 'Đã trả hàng', step: -1 }
  }

  const paymentStatusConfig = {
    pending: { color: 'orange', text: 'Chờ thanh toán', icon: <ClockCircleOutlined /> },
    paid: { color: 'green', text: 'Đã thanh toán', icon: <CheckCircleOutlined /> },
    failed: { color: 'red', text: 'Thanh toán thất bại', icon: <CloseCircleOutlined /> },
    refunded: { color: 'purple', text: 'Đã hoàn tiền', icon: <CheckCircleOutlined /> }
  }

  const paymentMethodConfig = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    bank_transfer: 'Chuyển khoản ngân hàng',
    momo: 'Ví MoMo',
    vnpay: 'VNPay',
    zalopay: 'ZaloPay'
  }

  const shippingMethodConfig = {
    standard: 'Giao hàng tiêu chuẩn',
    express: 'Giao hàng nhanh',
    same_day: 'Giao trong ngày'
  }

  const itemColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Image
            width={50}
            height={50}
            src={record.image}
            alt={text}
            className="rounded object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik"
          />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-xs text-gray-500">ID: {record.productId}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => <span className="text-gray-700">{price.toLocaleString('vi-VN')} ₫</span>
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (qty) => <Tag color="blue">{qty}</Tag>
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (total) => <span className="font-semibold text-blue-600">{total.toLocaleString('vi-VN')} ₫</span>
    }
  ]

  const getOrderTimeline = () => {
    const items = []
    
    if (order.orderDate) {
      items.push({
        color: 'blue',
        children: (
          <div>
            <div className="font-medium">Đặt hàng</div>
            <div className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleString('vi-VN')}</div>
          </div>
        )
      })
    }
    
    if (order.paymentDate) {
      items.push({
        color: 'green',
        children: (
          <div>
            <div className="font-medium">Thanh toán</div>
            <div className="text-xs text-gray-500">{new Date(order.paymentDate).toLocaleString('vi-VN')}</div>
          </div>
        )
      })
    }
    
    if (order.shippingDate) {
      items.push({
        color: 'cyan',
        children: (
          <div>
            <div className="font-medium">Giao hàng</div>
            <div className="text-xs text-gray-500">{new Date(order.shippingDate).toLocaleString('vi-VN')}</div>
          </div>
        )
      })
    }
    
    if (order.deliveredDate) {
      items.push({
        color: 'green',
        children: (
          <div>
            <div className="font-medium">Đã nhận hàng</div>
            <div className="text-xs text-gray-500">{new Date(order.deliveredDate).toLocaleString('vi-VN')}</div>
          </div>
        )
      })
    }
    
    return items
  }

  const currentStep = orderStatusConfig[order.orderStatus]?.step || 0

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="order-detail-modal"
    >
      {/* Header Section */}
      <div className="py-6 bg-gradient-to-r from-blue-50 to-purple-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.orderNumber}</h2>
              <p className="text-gray-600 mt-1">ID: {order.id}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Tag 
                color={orderStatusConfig[order.orderStatus]?.color || 'default'}
                className="text-base px-4 py-1"
              >
                {orderStatusConfig[order.orderStatus]?.text || order.orderStatus}
              </Tag>
              <Tag 
                color={paymentStatusConfig[order.paymentStatus]?.color || 'default'}
                icon={paymentStatusConfig[order.paymentStatus]?.icon}
                className="text-sm px-3 py-1"
              >
                {paymentStatusConfig[order.paymentStatus]?.text || order.paymentStatus}
              </Tag>
            </div>
          </div>

          {/* Order Progress */}
          {order.orderStatus !== 'cancelled' && order.orderStatus !== 'returned' && (
            <Steps
              current={currentStep}
              size="small"
              items={[
                { title: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
                { title: 'Đang xử lý', icon: <ShoppingOutlined /> },
                { title: 'Đang giao', icon: <CarOutlined /> },
                { title: 'Hoàn thành', icon: <CheckCircleOutlined /> }
              ]}
            />
          )}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col span={16}>
          {/* Customer Information */}
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <UserOutlined className="mr-2" />
                Thông tin khách hàng
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <UserOutlined className="text-blue-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Họ và tên</div>
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-green-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Số điện thoại</div>
                    <div className="text-sm font-medium text-gray-900">{order.customerPhone}</div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-purple-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium text-gray-900">{order.customerEmail}</div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-red-500 text-lg mt-1" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Địa chỉ giao hàng</div>
                    <div className="text-sm font-medium text-gray-900">{order.customerAddress}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Order Items */}
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <ShoppingOutlined className="mr-2" />
                Sản phẩm ({order.items?.length || 0})
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <Table
              columns={itemColumns}
              dataSource={order.items}
              pagination={false}
              rowKey="productId"
              size="small"
            />
            
            <Divider className="my-3" />
            
            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-900">{order.subtotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-gray-900">{order.shippingFee.toLocaleString('vi-VN')} ₫</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-red-600">-{order.discount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <Divider className="my-2" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-gray-900">Tổng cộng:</span>
                <span className="font-bold text-blue-600 text-lg">{order.totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col span={8}>
          {/* Payment & Shipping Info */}
          <Card 
            title={
              <span className="text-sm font-semibold text-gray-700">
                <CreditCardOutlined className="mr-2" />
                Thanh toán & Vận chuyển
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Phương thức thanh toán</div>
                <Tag color="blue">{paymentMethodConfig[order.paymentMethod]}</Tag>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Phương thức vận chuyển</div>
                <Tag color="green">{shippingMethodConfig[order.shippingMethod]}</Tag>
              </div>
              {order.trackingNumber && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Mã vận đơn</div>
                  <div className="text-sm font-medium text-blue-600">{order.trackingNumber}</div>
                </div>
              )}
              {order.couponCode && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Mã giảm giá</div>
                  <Tag icon={<GiftOutlined />} color="magenta">{order.couponCode}</Tag>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card 
            title={
              <span className="text-sm font-semibold text-gray-700">
                <ClockCircleOutlined className="mr-2" />
                Lịch sử đơn hàng
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <Timeline items={getOrderTimeline()} />
          </Card>

          {/* Note */}
          {order.note && (
            <Card 
              title={
                <span className="text-sm font-semibold text-gray-700">
                  <FileTextOutlined className="mr-2" />
                  Ghi chú
                </span>
              }
              className="shadow-sm"
              size="small"
            >
              <p className="text-sm text-gray-700">{order.note}</p>
            </Card>
          )}
        </Col>
      </Row>
    </Modal>
  )
}

export default OrderDetail

