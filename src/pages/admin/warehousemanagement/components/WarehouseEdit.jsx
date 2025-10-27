import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select,
  InputNumber,
  Button,
  message,
  DatePicker,
  Row,
  Col,
  Alert,
  Statistic
} from 'antd'
import { 
  EditOutlined,
  InboxOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

const WarehouseEdit = ({ visible, onClose, onUpdate, warehouse }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (warehouse && visible) {
      form.setFieldsValue({
        name: warehouse.name,
        type: warehouse.type,
        address: warehouse.address,
        manager: warehouse.manager,
        phone: warehouse.phone,
        email: warehouse.email,
        capacity: warehouse.capacity,
        status: warehouse.status,
        establishedDate: warehouse.establishedDate ? dayjs(warehouse.establishedDate) : null,
        operatingHours: warehouse.operatingHours,
        categories: warehouse.categories,
        facilities: warehouse.facilities
      })
    }
  }, [warehouse, visible, form])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      
      const formattedValues = {
        ...warehouse,
        ...values,
        establishedDate: values.establishedDate ? values.establishedDate.format('YYYY-MM-DD') : warehouse.establishedDate,
        lastUpdated: dayjs().format('YYYY-MM-DD')
      }

      await onUpdate(formattedValues)
      message.success('Cập nhật kho thành công!')
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  if (!warehouse) return null

  const occupancyRate = Math.round((warehouse.currentStock / warehouse.capacity) * 100)

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-600" />
          <span>Chỉnh sửa kho</span>
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
      width={800}
      className="warehouse-edit-modal"
    >
      {/* Warehouse Info Banner */}
      <Alert
        message={
          <div className="flex items-center justify-between">
            <div>
              <strong>Mã kho:</strong> WH-{String(warehouse.id).padStart(3, '0')}
            </div>
            <div>
              <strong>Ngày thành lập:</strong> {new Date(warehouse.establishedDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        }
        type="info"
        showIcon
        className="mb-4"
      />

      {/* Statistics Banner */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Statistic 
            title="Công suất" 
            value={warehouse.capacity}
            suffix="m³"
            prefix={<InboxOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="Đã sử dụng" 
            value={warehouse.currentStock}
            suffix="m³"
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic 
            title="Tỷ lệ sử dụng" 
            value={occupancyRate}
            suffix="%"
            valueStyle={{ color: '#722ed1' }}
          />
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Statistic 
            title="Số sản phẩm" 
            value={warehouse.totalProducts}
            prefix={<AppstoreOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic 
            title="Cập nhật lần cuối" 
            value={new Date(warehouse.lastUpdated).toLocaleDateString('vi-VN')}
          />
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        className="mt-4"
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
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại kho"
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn loại kho!' }]}
            >
              <Select size="large">
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
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <TextArea rows={2} />
        </Form.Item>

        {/* Manager Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Người quản lý"
              name="manager"
              rules={[{ required: true, message: 'Vui lòng nhập tên người quản lý!' }]}
            >
              <Input size="large" />
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
              <Input size="large" />
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
          <Input size="large" />
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
              <Select size="large">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="maintenance">Bảo trì</Option>
                <Option value="full">Đầy</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Ngày thành lập"
              name="establishedDate"
            >
              <DatePicker 
                className="w-full" 
                size="large"
                format="DD/MM/YYYY"
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
          <Input size="large" />
        </Form.Item>

        {/* Categories */}
        <Form.Item
          label="Danh mục sản phẩm"
          name="categories"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select 
            mode="multiple" 
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

export default WarehouseEdit

