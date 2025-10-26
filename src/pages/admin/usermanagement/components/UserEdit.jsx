import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Upload,
  Avatar,
  message,
  Row,
  Col,
  Divider,
  Checkbox
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  PlusOutlined,
  CalendarOutlined,
  IdcardOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

const UserEdit = ({ visible, onClose, onUpdate, user }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)

  // Load dữ liệu user vào form khi modal mở
  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
        address: user.address,
        accountType: user.accountType,
        status: user.status,
        isVerified: user.isVerified
      })
      setAvatarUrl(user.avatar)
    }
  }, [visible, user, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Format data
      const updatedUser = {
        ...user,
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : user.dateOfBirth,
        avatar: avatarUrl
      }
      
      // Call parent function to update user
      onUpdate(updatedUser)
      
      message.success('Cập nhật khách hàng thành công!')
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
      message.error('Vui lòng kiểm tra lại thông tin!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setAvatarUrl(null)
    onClose()
  }

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url || URL.createObjectURL(info.file.originFileObj))
      message.success('Upload ảnh thành công!')
    } else if (info.file.status === 'error') {
      message.error('Upload ảnh thất bại!')
    }
  }

  const uploadButton = (
    <div className="flex flex-col items-center justify-center cursor-pointer">
      {avatarUrl ? (
        <Avatar src={avatarUrl} size={100} icon={<UserOutlined />} />
      ) : (
        <>
          <PlusOutlined className="text-2xl mb-2" />
          <div className="text-sm">Tải ảnh lên</div>
        </>
      )}
    </div>
  )

  if (!user) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-600" />
          <span>Chỉnh sửa thông tin khách hàng</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{
        className: 'bg-blue-600 hover:bg-blue-700'
      }}
    >
      <Divider className="mt-4 mb-6" />

      {/* User ID Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <IdcardOutlined />
          <span className="font-medium">Mã khách hàng:</span>
          <span className="font-bold">KH-{String(user.id).padStart(4, '0')}</span>
        </div>
        <div className="text-xs text-blue-600">
          Tham gia: {new Date(user.joinDate).toLocaleDateString('vi-VN')}
        </div>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        {/* Avatar Upload */}
        <Form.Item className="text-center mb-6">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://api.cloudinary.com/v1_1/demo/upload"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/')
              if (!isImage) {
                message.error('Chỉ có thể upload file ảnh!')
              }
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isLt2M) {
                message.error('Ảnh phải nhỏ hơn 2MB!')
              }
              return isImage && isLt2M
            }}
            onChange={handleAvatarChange}
          >
            {uploadButton}
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            Click để thay đổi ảnh đại diện (Tối đa 2MB)
          </div>
        </Form.Item>

        <Row gutter={16}>
          {/* Họ và tên */}
          <Col span={12}>
            <Form.Item
              name="name"
              label={
                <span className="font-medium">
                  <UserOutlined className="mr-2 text-gray-400" />
                  Họ và tên
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập họ và tên!' },
                { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input 
                placeholder="Nguyễn Văn A" 
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col span={12}>
            <Form.Item
              name="email"
              label={
                <span className="font-medium">
                  <MailOutlined className="mr-2 text-gray-400" />
                  Email
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                placeholder="example@gmail.com" 
                size="large"
                prefix={<MailOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>

          {/* Số điện thoại */}
          <Col span={12}>
            <Form.Item
              name="phone"
              label={
                <span className="font-medium">
                  <PhoneOutlined className="mr-2 text-gray-400" />
                  Số điện thoại
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
              ]}
            >
              <Input 
                placeholder="0901234567" 
                size="large"
                prefix={<PhoneOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>

          {/* Giới tính */}
          <Col span={12}>
            <Form.Item
              name="gender"
              label={
                <span className="font-medium">
                  <UserOutlined className="mr-2 text-gray-400" />
                  Giới tính
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select 
                placeholder="Chọn giới tính"
                size="large"
              >
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Ngày sinh */}
          <Col span={12}>
            <Form.Item
              name="dateOfBirth"
              label={
                <span className="font-medium">
                  <CalendarOutlined className="mr-2 text-gray-400" />
                  Ngày sinh
                </span>
              }
            >
              <DatePicker 
                placeholder="Chọn ngày sinh"
                size="large"
                format="DD/MM/YYYY"
                className="w-full"
                disabledDate={(current) => {
                  return current && current > dayjs().endOf('day')
                }}
              />
            </Form.Item>
          </Col>

          {/* Loại tài khoản */}
          <Col span={12}>
            <Form.Item
              name="accountType"
              label={
                <span className="font-medium">
                  Loại tài khoản
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
            >
              <Select size="large">
                <Option value="standard">Tiêu chuẩn</Option>
                <Option value="premium">Premium</Option>
                <Option value="vip">VIP</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Địa chỉ */}
          <Col span={24}>
            <Form.Item
              name="address"
              label={
                <span className="font-medium">
                  <EnvironmentOutlined className="mr-2 text-gray-400" />
                  Địa chỉ
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input 
                placeholder="123 Nguyễn Trãi, Quận 1, TP.HCM" 
                size="large"
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>

          {/* Trạng thái */}
          <Col span={12}>
            <Form.Item
              name="status"
              label={
                <span className="font-medium">
                  Trạng thái
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select size="large">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Xác thực */}
          <Col span={12}>
            <Form.Item
              name="isVerified"
              valuePropName="checked"
              label={<span className="font-medium">Xác thực</span>}
            >
              <Checkbox>Tài khoản đã xác thực</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Statistics Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Row gutter={16} className="text-xs">
          <Col span={8}>
            <div className="text-gray-600">
              <span className="font-medium">Tổng đơn hàng:</span>{' '}
              <span className="text-blue-600 font-bold">{user.totalOrders || 0}</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-gray-600">
              <span className="font-medium">Tổng chi tiêu:</span>{' '}
              <span className="text-green-600 font-bold">{(user.totalSpent || 0).toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-gray-600">
              <span className="font-medium">Điểm Eco:</span>{' '}
              <span className="text-yellow-600 font-bold">{user.ecoPoints || 0} EP</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* Last Updated Info */}
      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Cập nhật lần cuối:</span>{' '}
          {new Date().toLocaleString('vi-VN')}
        </div>
      </div>
    </Modal>
  )
}

export default UserEdit

