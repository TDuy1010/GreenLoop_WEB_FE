import React, { useState } from 'react'
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
  Alert,
  Typography,
  Button,
  Space
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  DollarOutlined,
  UploadOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CopyOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { createEmployee } from '../../../../service/api/employeeApi'

const { Option } = Select
const { TextArea } = Input
const { Paragraph, Text } = Typography

const StaffAdd = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [tempPassword, setTempPassword] = useState(null)
  const [newEmployeeInfo, setNewEmployeeInfo] = useState(null)

  // Role mapping: Tiếng Việt -> API
  const roleMapping = {
    'Nhân viên': 'STAFF',
    'Quản lý cửa hàng': 'STORE_MANAGER',
    'Nhân viên hỗ trợ': 'SUPPORT_STAFF',
    'Quản lý': 'MANAGER',
    'Quản trị viên': 'ADMIN'
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Prepare employee data for API
      const employeeData = {
        email: values.email,
        fullName: values.fullName,
        phone: values.phone,
        role: roleMapping[values.role] || 'STAFF'
      }
      
      // Call API to create employee
      const response = await createEmployee(employeeData, avatarFile)
      
      if (response.success && response.data) {
        message.success('Thêm nhân viên thành công!')
        
        // Lưu mật khẩu tạm thời và thông tin nhân viên
        setTempPassword(response.data.temporaryPassword)
        setNewEmployeeInfo({
          fullName: values.fullName,
          email: values.email,
          role: values.role
        })
        
        // Reset form
        form.resetFields()
        setAvatarUrl(null)
        setAvatarFile(null)
        
        // Đóng modal thêm nhân viên
        onClose()
        
        // Hiển thị modal mật khẩu tạm thời
        setPasswordModalVisible(true)
        
        // Refresh employee list
        if (onAdd) {
          onAdd()
        }
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Không thể thêm nhân viên. Vui lòng thử lại!')
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

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <UserOutlined className="text-green-600" />
            <span>Thêm nhân viên mới</span>
          </div>
        }
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
        okText="Thêm nhân viên"
        cancelText="Hủy"
        confirmLoading={loading}
        okButtonProps={{
          className: 'bg-green-600 hover:bg-green-700'
        }}
      >
      <Divider className="mt-4 mb-6" />
      
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
            Click để tải ảnh đại diện (Tối đa 2MB, không bắt buộc)
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
          <Col span={24}>
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
        </Row>
      </Form>
    </Modal>

    {/* Modal hiển thị mật khẩu tạm thời */}
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
          <CheckCircleOutlined className="text-2xl" />
          <span>Tạo nhân viên thành công!</span>
        </div>
      }
      open={passwordModalVisible}
      onOk={() => {
        setPasswordModalVisible(false)
        setTempPassword(null)
        setNewEmployeeInfo(null)
      }}
      onCancel={() => {
        setPasswordModalVisible(false)
        setTempPassword(null)
        setNewEmployeeInfo(null)
      }}
      width={600}
      okText="Đã lưu"
      cancelText="Đóng"
      okButtonProps={{
        className: 'bg-green-600 hover:bg-green-700'
      }}
    >
      <Divider className="mt-4 mb-4" />
      
      {newEmployeeInfo && (
        <div className="space-y-4">
          {/* Thông tin nhân viên */}
          <Alert
            message="Thông tin đăng nhập đã được tạo"
            description="Vui lòng lưu lại mật khẩu tạm thời và gửi cho nhân viên. Nhân viên nên đổi mật khẩu ngay sau lần đăng nhập đầu tiên."
            type="success"
            showIcon
          />

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <Text type="secondary" className="text-sm">Họ và tên:</Text>
              <div className="font-medium text-base">{newEmployeeInfo.fullName}</div>
            </div>
            
            <div>
              <Text type="secondary" className="text-sm">Email đăng nhập:</Text>
              <div className="font-medium text-base">{newEmployeeInfo.email}</div>
            </div>

            <div>
              <Text type="secondary" className="text-sm">Chức vụ:</Text>
              <div className="font-medium text-base">{newEmployeeInfo.role}</div>
            </div>
          </div>

          {/* Mật khẩu tạm thời */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="mb-2">
              <Text type="secondary" className="text-sm">Mật khẩu tạm thời:</Text>
            </div>
            <Paragraph
              copyable={{
                text: tempPassword,
                icon: [
                  <CopyOutlined key="copy-icon" className="text-blue-600" />,
                  <CheckCircleOutlined key="copied-icon" className="text-green-600" />
                ],
                tooltips: ['Sao chép', 'Đã sao chép!']
              }}
              className="mb-0"
            >
              <Text 
                strong 
                className="text-2xl font-mono bg-white px-4 py-2 rounded border border-yellow-300"
                style={{ letterSpacing: '2px' }}
              >
                {tempPassword}
              </Text>
            </Paragraph>
          </div>

          {/* Hướng dẫn */}
          <Alert
            message="Lưu ý bảo mật"
            description={
              <ul className="mb-0 pl-4 space-y-1">
                <li>Không chia sẻ mật khẩu này qua kênh không an toàn</li>
                <li>Gửi mật khẩu trực tiếp cho nhân viên qua email hoặc tin nhắn riêng tư</li>
                <li>Yêu cầu nhân viên đổi mật khẩu ngay sau lần đăng nhập đầu tiên</li>
              </ul>
            }
            type="warning"
            showIcon
            className="text-sm"
          />
        </div>
      )}
    </Modal>
    </>
  )
}

export default StaffAdd

