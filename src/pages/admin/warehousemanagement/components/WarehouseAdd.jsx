import React, { useState } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select,
  InputNumber,
  Button,
  message,
  DatePicker,
  TimePicker,
  Row,
  Col
} from 'antd'
import { 
  PlusOutlined,
  HomeOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const WarehouseAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      const formattedValues = {
        ...values,
        establishedDate: values.establishedDate ? values.establishedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        lastUpdated: dayjs().format('YYYY-MM-DD'),
        currentStock: 0,
        totalProducts: 0,
        id: Date.now()
      }

      await onAdd(formattedValues)
      message.success('Thêm kho thành công!')
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
          <span>Thêm kho mới</span>
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
          Thêm kho
        </Button>
      ]}
      width={800}
      className="warehouse-add-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{
          status: 'active',
          type: 'branch',
          operatingHours: '8:00 - 17:00'
        }}
      >
        {/* Basic Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên kho"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên kho!' },
                { min: 3, message: 'Tên kho phải có ít nhất 3 ký tự!' }
              ]}
            >
              <Input placeholder="Kho TP.HCM" size="large" prefix={<HomeOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại kho"
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn loại kho!' }]}
            >
              <Select placeholder="Chọn loại kho" size="large">
                <Option value="main">Kho chính</Option>
                <Option value="branch">Kho chi nhánh</Option>
                <Option value="temporary">Kho tạm</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ!' }
          ]}
        >
          <TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
        </Form.Item>

        {/* Manager Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Người quản lý"
              name="manager"
              rules={[
                { required: true, message: 'Vui lòng nhập tên người quản lý!' }
              ]}
            >
              <Input placeholder="Nguyễn Văn A" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input placeholder="0901234567" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="kho@greenloop.com" size="large" />
        </Form.Item>

        {/* Capacity & Status */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Công suất (m³)"
              name="capacity"
              rules={[
                { required: true, message: 'Vui lòng nhập công suất!' },
                { type: 'number', min: 1, message: 'Công suất phải > 0!' }
              ]}
            >
              <InputNumber 
                placeholder="1000" 
                min={1}
                className="w-full"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="maintenance">Bảo trì</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Ngày thành lập"
              name="establishedDate"
              initialValue={dayjs()}
            >
              <DatePicker 
                className="w-full" 
                size="large"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Operating Hours */}
        <Form.Item
          label="Giờ làm việc"
          name="operatingHours"
          rules={[{ required: true, message: 'Vui lòng nhập giờ làm việc!' }]}
        >
          <Input placeholder="8:00 - 17:00" size="large" />
        </Form.Item>

        {/* Categories */}
        <Form.Item
          label="Danh mục sản phẩm"
          name="categories"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Chọn danh mục sản phẩm"
            size="large"
          >
            <Option value="Thời trang">Thời trang</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
            <Option value="Giày dép">Giày dép</Option>
            <Option value="Sách & Văn phòng phẩm">Sách & Văn phòng phẩm</Option>
            <Option value="Đồ gia dụng">Đồ gia dụng</Option>
            <Option value="Điện tử">Điện tử</Option>
            <Option value="Đồ chơi">Đồ chơi</Option>
            <Option value="Thể thao">Thể thao</Option>
          </Select>
        </Form.Item>

        {/* Facilities */}
        <Form.Item
          label="Tiện ích & Trang thiết bị"
          name="facilities"
          rules={[{ required: true, message: 'Vui lòng chọn tiện ích!' }]}
        >
          <Select 
            mode="multiple" 
            placeholder="Chọn tiện ích"
            size="large"
          >
            <Option value="Điều hòa">Điều hòa</Option>
            <Option value="Camera an ninh">Camera an ninh</Option>
            <Option value="Hệ thống báo cháy">Hệ thống báo cháy</Option>
            <Option value="Kho lạnh">Kho lạnh</Option>
            <Option value="Thang máy">Thang máy</Option>
            <Option value="Bãi đỗ xe">Bãi đỗ xe</Option>
            <Option value="Nhà ăn">Nhà ăn</Option>
            <Option value="Phòng nghỉ">Phòng nghỉ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default WarehouseAdd

