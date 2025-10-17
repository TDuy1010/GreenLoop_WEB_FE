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
  Divider
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  DollarOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

const StaffEdit = ({ visible, onClose, onUpdate, staff }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)

  // Load dữ liệu staff vào form khi modal mở
  useEffect(() => {
    if (visible && staff) {
      form.setFieldsValue({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        position: staff.position,
        department: staff.department,
        joinDate: staff.joinDate ? dayjs(staff.joinDate) : null,
        salary: staff.salary,
        status: staff.status,
        notes: staff.notes || ''
      })
      setAvatarUrl(staff.avatar)
    }
  }, [visible, staff, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // Format data
      const updatedStaff = {
        ...staff,
        ...values,
        joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : staff.joinDate,
        avatar: avatarUrl
      }
      
      // Call parent function to update staff
      onUpdate(updatedStaff)
      
      message.success('Cập nhật nhân viên thành công!')
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
      // Get this url from response in real world
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
            action="https://api.cloudinary.com/v1_1/demo/upload" // Replace with your upload endpoint
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

          {/* Vị trí */}
          <Col span={12}>
            <Form.Item
              name="position"
              label={
                <span className="font-medium">
                  <IdcardOutlined className="mr-2 text-gray-400" />
                  Vị trí
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}
            >
              <Select 
                placeholder="Chọn vị trí"
                size="large"
              >
                <Option value="Nhân viên">Nhân viên</Option>
                <Option value="Quản lý">Quản lý</Option>
                <Option value="Trưởng phòng">Trưởng phòng</Option>
                <Option value="Giám đốc">Giám đốc</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Chức vụ/Phòng ban */}
          <Col span={12}>
            <Form.Item
              name="department"
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
                <Option value="Vận hành">Vận hành</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Kỹ thuật">Kỹ thuật</Option>
                <Option value="Nhân sự">Nhân sự</Option>
                <Option value="Tài chính">Tài chính</Option>
                <Option value="Kinh doanh">Kinh doanh</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Ngày vào làm */}
          <Col span={12}>
            <Form.Item
              name="joinDate"
              label={
                <span className="font-medium">
                  <IdcardOutlined className="mr-2 text-gray-400" />
                  Ngày vào làm
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm!' }]}
            >
              <DatePicker 
                placeholder="Chọn ngày"
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

          {/* Mức lương */}
          <Col span={12}>
            <Form.Item
              name="salary"
              label={
                <span className="font-medium">
                  <DollarOutlined className="mr-2 text-gray-400" />
                  Mức lương (VNĐ)
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng nhập mức lương!' },
                { 
                  type: 'number', 
                  min: 0, 
                  message: 'Mức lương phải lớn hơn 0!' 
                }
              ]}
            >
              <InputNumber
                placeholder="15000000"
                size="large"
                className="w-full"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                prefix={<DollarOutlined className="text-gray-400" />}
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
                <Option value="active">Đang làm việc</Option>
                <Option value="inactive">Nghỉ việc</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Ghi chú */}
          <Col span={24}>
            <Form.Item
              name="notes"
              label={
                <span className="font-medium">
                  Ghi chú
                </span>
              }
            >
              <TextArea
                rows={3}
                placeholder="Nhập ghi chú về nhân viên (nếu có)..."
                maxLength={500}
                showCount
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
