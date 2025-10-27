import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select,
  InputNumber,
  Button,
  message,
  Divider,
  Card,
  DatePicker,
  Row,
  Col,
  Alert,
  Statistic
} from 'antd'
import { 
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ShoppingOutlined,
  DollarOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const OrderEdit = ({ visible, onClose, onUpdate, order }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Watch form values for dynamic calculations
  const items = Form.useWatch('items', form) || []
  const shippingFee = Form.useWatch('shippingFee', form) || 0
  const discount = Form.useWatch('discount', form) || 0

  useEffect(() => {
    if (order && visible) {
      form.setFieldsValue({
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        items: order.items,
        shippingFee: order.shippingFee,
        discount: order.discount,
        couponCode: order.couponCode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        orderDate: order.orderDate ? dayjs(order.orderDate) : null,
        paymentDate: order.paymentDate ? dayjs(order.paymentDate) : null,
        shippingDate: order.shippingDate ? dayjs(order.shippingDate) : null,
        trackingNumber: order.trackingNumber,
        note: order.note
      })
    }
  }, [order, visible, form])

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      if (item && item.price && item.quantity) {
        return sum + (item.price * item.quantity)
      }
      return sum
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return subtotal + shippingFee - discount
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      const itemsWithTotal = values.items.map(item => ({
        ...item,
        total: item.price * item.quantity
      }))

      const subtotal = calculateSubtotal()
      const totalAmount = calculateTotal()

      const formattedValues = {
        ...order,
        ...values,
        items: itemsWithTotal,
        subtotal: subtotal,
        totalAmount: totalAmount,
        orderDate: values.orderDate ? values.orderDate.format('YYYY-MM-DD HH:mm:ss') : order.orderDate,
        paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD HH:mm:ss') : null,
        shippingDate: values.shippingDate ? values.shippingDate.format('YYYY-MM-DD HH:mm:ss') : null
      }

      await onUpdate(formattedValues)
      message.success('Cập nhật đơn hàng thành công!')
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  if (!order) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-600" />
          <span>Chỉnh sửa đơn hàng</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Cập nhật
        </Button>
      ]}
      width={900}
      className="order-edit-modal"
    >
      <Alert
        message={
          <div className="flex items-center justify-between">
            <div>
              <strong>Mã đơn hàng:</strong> {order.orderNumber} (ID: {order.id})
            </div>
            <div>
              <strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        }
        type="info"
        showIcon
        icon={<ShoppingOutlined />}
        className="mb-4"
      />

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Statistic 
            title="Tổng giá trị" 
            value={order.totalAmount}
            suffix="₫"
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={12}>
          <Statistic 
            title="Số sản phẩm" 
            value={order.items?.length || 0}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
      </Row>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        {/* Customer Information */}
        <Card 
          title={<span className="text-sm font-semibold">Thông tin khách hàng</span>}
          size="small"
          className="mb-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="customerName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="customerPhone"
                rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="customerEmail"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Địa chỉ giao hàng"
                name="customerAddress"
                rules={[{ required: true }]}
              >
                <TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Order Items */}
        <Divider orientation="left">Danh sách sản phẩm</Divider>
        
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card 
                  key={key}
                  size="small"
                  className="mb-3 bg-gray-50"
                  extra={
                    fields.length > 1 ? (
                      <Button
                        type="link"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      >
                        Xóa
                      </Button>
                    ) : null
                  }
                >
                  <div className="grid grid-cols-4 gap-3">
                    <Form.Item
                      {...restField}
                      label="Mã SP"
                      name={[name, 'productId']}
                      rules={[{ required: true }]}
                      className="mb-2"
                    >
                      <Input placeholder="P001" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Tên sản phẩm"
                      name={[name, 'productName']}
                      rules={[{ required: true }]}
                      className="col-span-2 mb-2"
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="URL hình"
                      name={[name, 'image']}
                      className="mb-2"
                    >
                      <Input placeholder="/images/..." />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Đơn giá"
                      name={[name, 'price']}
                      rules={[{ required: true, type: 'number', min: 0 }]}
                      className="mb-0 col-span-2"
                    >
                      <InputNumber 
                        min={0}
                        className="w-full"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="SL"
                      name={[name, 'quantity']}
                      rules={[{ required: true, type: 'number', min: 1 }]}
                      className="mb-0"
                    >
                      <InputNumber min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item label="Thành tiền" className="mb-0">
                      <Input 
                        value={
                          items[name]?.price && items[name]?.quantity 
                            ? (items[name].price * items[name].quantity).toLocaleString('vi-VN') + ' ₫'
                            : '0 ₫'
                        }
                        disabled
                      />
                    </Form.Item>
                  </div>
                </Card>
              ))}
              
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  className="mb-3"
                >
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Pricing */}
        <Card size="small" className="mb-4 bg-blue-50">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Phí vận chuyển" name="shippingFee">
                <InputNumber 
                  min={0}
                  className="w-full"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giảm giá" name="discount">
                <InputNumber 
                  min={0}
                  className="w-full"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mã giảm giá" name="couponCode">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider className="my-3" />
          
          <div className="space-y-2 text-right">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-medium">{calculateSubtotal().toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-medium">{shippingFee.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-medium text-red-600">-{discount.toLocaleString('vi-VN')} ₫</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between text-lg">
              <span className="font-bold">Tổng cộng:</span>
              <span className="font-bold text-blue-600">{calculateTotal().toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </Card>

        {/* Order Details */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Trạng thái đơn hàng" name="orderStatus" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
                <Option value="cancelled">Đã hủy</Option>
                <Option value="returned">Đã trả hàng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái thanh toán" name="paymentStatus" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="pending">Chờ thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
                <Option value="failed">Thất bại</Option>
                <Option value="refunded">Đã hoàn tiền</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="PT thanh toán" name="paymentMethod" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="cod">COD</Option>
                <Option value="bank_transfer">Chuyển khoản</Option>
                <Option value="momo">MoMo</Option>
                <Option value="vnpay">VNPay</Option>
                <Option value="zalopay">ZaloPay</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="PT vận chuyển" name="shippingMethod" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="standard">Tiêu chuẩn</Option>
                <Option value="express">Nhanh</Option>
                <Option value="same_day">Trong ngày</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày đặt hàng" name="orderDate">
              <DatePicker showTime className="w-full" size="large" format="DD/MM/YYYY HH:mm" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày thanh toán" name="paymentDate">
              <DatePicker showTime className="w-full" size="large" format="DD/MM/YYYY HH:mm" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày giao hàng" name="shippingDate">
              <DatePicker showTime className="w-full" size="large" format="DD/MM/YYYY HH:mm" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mã vận đơn" name="trackingNumber">
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default OrderEdit

