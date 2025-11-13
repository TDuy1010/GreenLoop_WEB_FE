import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  InputNumber,
  Upload,
  Avatar,
  message,
  Row,
  Col,
  Divider,
  Switch
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  DollarOutlined,
  EditOutlined,
  PlusOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { updateEmployee } from '../../../../service/api/employeeApi'

const { Option } = Select
const { TextArea } = Input

const StaffEdit = ({ visible, onClose, onUpdate, staff }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  // Role mapping
  const roleMapping = {
    'Nhân viên': 'STAFF',
    'Quản lý cửa hàng': 'STORE_MANAGER',
    'Nhân viên hỗ trợ': 'SUPPORT_STAFF',
    'Quản lý': 'MANAGER',
    'Quản trị viên': 'ADMIN'
  }

  const reverseRoleMapping = {
    'STAFF': 'Nhân viên',
    'STORE_MANAGER': 'Quản lý cửa hàng',
    'SUPPORT_STAFF': 'Nhân viên hỗ trợ',
    'MANAGER': 'Quản lý',
    'ADMIN': 'Quản trị viên'
  }

  const genderMapping = {
    'Nam': 'MALE',
    'Nữ': 'FEMALE',
    'Khác': 'OTHER'
  }

  const reverseGenderMapping = {
    'MALE': 'Nam',
    'FEMALE': 'Nữ',
    'OTHER': 'Khác'
  }

  // Load dữ liệu staff vào form khi modal mở
  useEffect(() => {
    if (visible && staff) {
      form.setFieldsValue({
        fullName: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: reverseRoleMapping[staff.role] || staff.department,
        dateOfBirth: staff.dateOfBirth ? dayjs(staff.dateOfBirth) : null,
        gender: reverseGenderMapping[staff.gender] || 'Nam',
        isActive: staff.status === 'active'
      })
      setAvatarUrl(staff.avatar)
      setAvatarFile(null)
    }
  }, [visible, staff, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Prepare employee data for API
      const employeeData = {
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        gender: genderMapping[values.gender] || 'MALE',
        role: roleMapping[values.role] || 'STAFF',
        isActive: values.isActive
      }
      
      // Call API to update employee
      const response = await updateEmployee(staff.id, employeeData, avatarFile)
      
      if (response.success) {
        message.success('Cập nhật nhân viên thành công!')
        
        // Refresh employee list
        if (onUpdate) {
          onUpdate()
        }
        
        onClose()
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Không thể cập nhật nhân viên. Vui lòng thử lại!')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setAvatarUrl(null)
    setAvatarFile(null)
    onClose()
  }

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj || info.file
    
    // Validate file
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Chỉ có thể upload file ảnh!')
      return
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!')
      return
    }
    
    // Save file and create preview URL
    setAvatarFile(file)
    const previewUrl = URL.createObjectURL(file)
    setAvatarUrl(previewUrl)
    message.success('Chọn ảnh thành công!')
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

  if (!staff) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold">
          <EditOutlined className="text-blue-600" />
          <span>Chỉnh sửa thông tin nhân viên</span>
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

      {/* Staff ID Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-800">
          <IdcardOutlined />
          <span className="font-medium">Mã nhân viên:</span>
          <span className="font-bold">NV-{String(staff.id).padStart(4, '0')}</span>
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
            beforeUpload={() => false}
            onChange={handleAvatarChange}
            accept="image/*"
          >
            {uploadButton}
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            Click để thay đổi ảnh đại diện (Tối đa 2MB, không bắt buộc)
          </div>
        </Form.Item>

        <Row gutter={16}>
          {/* Họ và tên */}
          <Col span={24}>
            <Form.Item
              name="fullName"
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
                placeholder="example@greenloop.com" 
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

          {/* Chức vụ/Role */}
          <Col span={12}>
            <Form.Item
              name="role"
              label={
                <span className="font-medium">
                  <IdcardOutlined className="mr-2 text-gray-400" />
                  Chức vụ
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
            >
              <Select 
                placeholder="Chọn chức vụ"
                size="large"
              >
                <Option value="Quản trị viên">Quản trị viên (ADMIN)</Option>
                <Option value="Quản lý">Quản lý (MANAGER)</Option>
                <Option value="Quản lý cửa hàng">Quản lý cửa hàng (STORE MANAGER)</Option>
                <Option value="Nhân viên hỗ trợ">Nhân viên hỗ trợ (SUPPORT STAFF)</Option>
                <Option value="Nhân viên">Nhân viên (STAFF)</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Ngày sinh */}
          <Col span={12}>
            <Form.Item
              name="dateOfBirth"
              label={
                <span className="font-medium">
                  <IdcardOutlined className="mr-2 text-gray-400" />
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
                  // Không cho chọn ngày trong tương lai
                  return current && current > dayjs().endOf('day')
                }}
              />
            </Form.Item>
          </Col>

          {/* Giới tính */}
          <Col span={12}>
            <Form.Item
              name="gender"
              label={
                <span className="font-medium">
                  Giới tính
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select size="large" placeholder="Chọn giới tính">
                <Option value="Nam">
                  <ManOutlined className="mr-2" /> Nam
                </Option>
                <Option value="Nữ">
                  <WomanOutlined className="mr-2" /> Nữ
                </Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Trạng thái */}
          <Col span={12}>
            <Form.Item
              name="isActive"
              label={
                <span className="font-medium">
                  Trạng thái hoạt động
                </span>
              }
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                className="bg-gray-400"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Last Updated Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Cập nhật lần cuối:</span>{' '}
          {new Date().toLocaleString('vi-VN')}
        </div>
      </div>
    </Modal>
  )
}

export default StaffEdit
