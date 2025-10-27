import React, { useState } from 'react'
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
  Col
} from 'antd'
import { 
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const OrderAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Watch form values for dynamic calculations
  const items = Form.useWatch('items', form) || []
  const shippingFee = Form.useWatch('shippingFee', form) || 0
  const discount = Form.useWatch('discount', form) || 0

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
      
      // Calculate item totals
      const itemsWithTotal = values.items.map(item => ({
        ...item,
        total: item.price * item.quantity
      }))

      const subtotal = calculateSubtotal()
      const totalAmount = calculateTotal()

      const formattedValues = {
        ...values,
        items: itemsWithTotal,
        subtotal: subtotal,
        totalAmount: totalAmount,
        orderDate: values.orderDate ? values.orderDate.format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        paymentDate: values.paymentStatus === 'paid' && values.paymentDate ? values.paymentDate.format('YYYY-MM-DD HH:mm:ss') : null,
        shippingDate: values.shippingDate ? values.shippingDate.format('YYYY-MM-DD HH:mm:ss') : null,
        deliveredDate: null,
        id: 'ORD' + Date.now().toString().slice(-3),
        orderNumber: 'GL' + new Date().getFullYear() + Date.now().toString().slice(-6)
      }

      await onAdd(formattedValues)
      message.success('Thêm đơn hàng thành công!')
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <PlusOutlined className="text-green-600" />
          <span>Tạo đơn hàng mới</span>
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
          className="bg-green-600 hover:bg-green-700"
        >
          Tạo đơn hàng
        </Button>
      ]}
      width={900}
      className="order-add-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          items: [{ productId: '', productName: '', price: 0, quantity: 1, image: '' }],
          shippingFee: 30000,
          discount: 0,
          orderStatus: 'pending',
          paymentStatus: 'pending',
          shippingMethod: 'standard',
          paymentMethod: 'cod'
        }}
      >
        {/* Customer Information */}
        <Card 
          title={
            <span className="text-sm font-semibold">
              <UserOutlined className="mr-2" />
              Thông tin khách hàng
            </span>
          }
          size="small"
          className="mb-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="customerName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ tên!' },
                  { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input placeholder="Nhập họ và tên khách hàng" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="customerPhone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input placeholder="0123456789" size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="customerEmail"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="email@example.com" size="large" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Địa chỉ giao hàng"
                name="customerAddress"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ!' }
                ]}
              >
                <TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
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
                      label="Mã sản phẩm"
                      name={[name, 'productId']}
                      rules={[{ required: true, message: 'Nhập mã!' }]}
                      className="mb-2"
                    >
                      <Input placeholder="P001" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Tên sản phẩm"
                      name={[name, 'productName']}
                      rules={[{ required: true, message: 'Nhập tên!' }]}
                      className="col-span-2 mb-2"
                    >
                      <Input placeholder="Tên sản phẩm" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="URL hình ảnh"
                      name={[name, 'image']}
                      className="mb-2"
                    >
                      <Input placeholder="/images/product.jpg" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Đơn giá (₫)"
                      name={[name, 'price']}
                      rules={[
                        { required: true, message: 'Nhập giá!' },
                        { type: 'number', min: 0, message: 'Giá phải >= 0!' }
                      ]}
                      className="mb-0 col-span-2"
                    >
                      <InputNumber 
                        placeholder="0" 
                        min={0}
                        className="w-full"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Số lượng"
                      name={[name, 'quantity']}
                      rules={[
                        { required: true, message: 'Nhập SL!' },
                        { type: 'number', min: 1, message: 'SL >= 1!' }
                      ]}
                      className="mb-0"
                    >
                      <InputNumber placeholder="1" min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      label="Thành tiền"
                      className="mb-0"
                    >
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
              <Form.Item
                label="Phí vận chuyển (₫)"
                name="shippingFee"
                rules={[{ type: 'number', min: 0, message: 'Phí >= 0!' }]}
              >
                <InputNumber 
                  placeholder="30000" 
                  min={0}
                  className="w-full"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Giảm giá (₫)"
                name="discount"
                rules={[{ type: 'number', min: 0, message: 'Giảm giá >= 0!' }]}
              >
                <InputNumber 
                  placeholder="0" 
                  min={0}
                  className="w-full"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mã giảm giá" name="couponCode">
                <Input placeholder="WELCOME10" />
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
            <Form.Item
              label="Trạng thái đơn hàng"
              name="orderStatus"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="shipping">Đang giao hàng</Option>
                <Option value="delivered">Đã giao hàng</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái thanh toán"
              name="paymentStatus"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="pending">Chờ thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
                <Option value="failed">Thất bại</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phương thức thanh toán"
              name="paymentMethod"
              rules={[{ required: true }]}
            >
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
            <Form.Item
              label="Phương thức vận chuyển"
              name="shippingMethod"
              rules={[{ required: true }]}
            >
              <Select size="large">
                <Option value="standard">Tiêu chuẩn</Option>
                <Option value="express">Nhanh</Option>
                <Option value="same_day">Trong ngày</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ngày đặt hàng" name="orderDate" initialValue={dayjs()}>
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
              <Input placeholder="VN123456789" size="large" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={3} placeholder="Ghi chú về đơn hàng (tùy chọn)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default OrderAdd

