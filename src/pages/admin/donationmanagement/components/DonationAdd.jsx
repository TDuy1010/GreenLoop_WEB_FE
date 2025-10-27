import React, { useState } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select,
  DatePicker,
  InputNumber,
  Button,
  message,
  Divider,
  Card,
  Space
} from 'antd'
import { 
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const DonationAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      // Format data
      const formattedValues = {
        ...values,
        donatedAt: values.donatedAt ? values.donatedAt.format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
        id: Date.now(), // Generate temporary ID
        receivedBy: values.receivedBy || null
      }

      await onAdd(formattedValues)
      message.success('Thêm quyên góp thành công!')
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
          <span>Thêm quyên góp mới</span>
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
          Thêm quyên góp
        </Button>
      ]}
      width={800}
      className="donation-add-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          status: 'pending',
          clothingItems: [{ type: '', condition: '', quantity: 1, size: '', color: '' }]
        }}
      >
        {/* Donor Information */}
        <Card 
          title={
            <span className="text-sm font-semibold">
              <UserOutlined className="mr-2" />
              Thông tin người quyên góp
            </span>
          }
          size="small"
          className="mb-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="donorName"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input placeholder="Nhập họ và tên" size="large" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="donorPhone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="0123456789" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="donorEmail"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
              className="col-span-2"
            >
              <Input placeholder="email@example.com" size="large" />
            </Form.Item>
          </div>
        </Card>

        {/* Event & Status */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Sự kiện"
            name="eventName"
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
          >
            <Input placeholder="Tên sự kiện thu gom" size="large" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái" size="large">
              <Option value="pending">Chờ xử lý</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="received">Đã tiếp nhận</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Clothing Items */}
        <Divider orientation="left">Danh sách quần áo quyên góp</Divider>
        
        <Form.List name="clothingItems">
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
                  <div className="grid grid-cols-3 gap-3">
                    <Form.Item
                      {...restField}
                      label="Loại quần áo"
                      name={[name, 'type']}
                      rules={[{ required: true, message: 'Nhập loại!' }]}
                      className="mb-2"
                    >
                      <Input placeholder="Áo thun, Quần jean..." />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Số lượng"
                      name={[name, 'quantity']}
                      rules={[
                        { required: true, message: 'Nhập số lượng!' },
                        { type: 'number', min: 1, message: 'Tối thiểu 1!' }
                      ]}
                      className="mb-2"
                    >
                      <InputNumber placeholder="1" min={1} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Tình trạng"
                      name={[name, 'condition']}
                      rules={[{ required: true, message: 'Chọn tình trạng!' }]}
                      className="mb-2"
                    >
                      <Select placeholder="Tình trạng">
                        <Option value="Mới 95%">Mới 95%</Option>
                        <Option value="Mới 90%">Mới 90%</Option>
                        <Option value="Mới 85%">Mới 85%</Option>
                        <Option value="Mới 80%">Mới 80%</Option>
                        <Option value="Mới 75%">Mới 75%</Option>
                        <Option value="Mới 70%">Mới 70%</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Size"
                      name={[name, 'size']}
                      rules={[{ required: true, message: 'Nhập size!' }]}
                      className="mb-0"
                    >
                      <Input placeholder="S, M, L..." />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Màu sắc"
                      name={[name, 'color']}
                      rules={[{ required: true, message: 'Nhập màu!' }]}
                      className="col-span-2 mb-0"
                    >
                      <Input placeholder="Trắng, Xanh..." />
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
                  Thêm món đồ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Tổng khối lượng (kg)"
            name="totalWeight"
            rules={[
              { type: 'number', min: 0.1, message: 'Khối lượng phải > 0!' }
            ]}
          >
            <InputNumber 
              placeholder="0.0" 
              min={0.1}
              step={0.1}
              className="w-full"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Người tiếp nhận"
            name="receivedBy"
          >
            <Input placeholder="Tên nhân viên (nếu có)" size="large" />
          </Form.Item>

          <Form.Item
            label="Ngày quyên góp"
            name="donatedAt"
            initialValue={dayjs()}
          >
            <DatePicker 
              showTime 
              className="w-full" 
              size="large"
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày giờ"
            />
          </Form.Item>

          <Form.Item
            label="Event ID"
            name="eventId"
            rules={[
              { required: true, message: 'Vui lòng nhập Event ID!' },
              { type: 'number', min: 1, message: 'Event ID phải > 0!' }
            ]}
          >
            <InputNumber placeholder="1" min={1} className="w-full" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          label="Ghi chú"
          name="note"
        >
          <TextArea 
            rows={3} 
            placeholder="Ghi chú về quyên góp (tùy chọn)"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DonationAdd

