import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Avatar, 
  Tag, 
  Descriptions, 
  Divider,
  Row,
  Col,
  Card,
  Space,
  Spin,
  message,
  Button,
  Alert,
  Typography
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  DollarOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  KeyOutlined,
  CopyOutlined,
  LockOutlined
} from '@ant-design/icons'
import { getEmployeeById, resetEmployeePassword } from '../../../../service/api/employeeApi'

const { Paragraph, Text } = Typography

const StaffDetail = ({ visible, onClose, staff }) => {
  const [employeeDetail, setEmployeeDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [tempPassword, setTempPassword] = useState(null)

  useEffect(() => {
    if (visible && staff?.id) {
      fetchEmployeeDetail(staff.id)
    }
  }, [visible, staff?.id])

  const fetchEmployeeDetail = async (employeeId) => {
    try {
      setLoading(true)
      const response = await getEmployeeById(employeeId)
      
      if (response.success && response.data) {
        // Role mapping
        const roleMapping = {
          'ADMIN': 'Quản trị viên',
          'MANAGER': 'Quản lý',
          'STORE_MANAGER': 'Quản lý cửa hàng',
          'SUPPORT_STAFF': 'Nhân viên hỗ trợ',
          'STAFF': 'Nhân viên'
        };

        const roleName = response.data.roles && response.data.roles.length > 0 
          ? response.data.roles[0] 
          : 'STAFF';
        const roleDisplay = roleMapping[roleName] || roleName;

        // Map API data to component format
        const mappedData = {
          id: response.data.id,
          name: response.data.fullName,
          email: response.data.email,
          phone: response.data.phoneNumber || 'Chưa có',
          position: roleDisplay,
          department: roleDisplay,
          role: roleName,
          status: response.data.isActive ? 'active' : 'inactive',
          joinDate: response.data.createdAt,
          avatar: response.data.avatarUrl,
          salary: 0,
          gender: response.data.gender || 'Chưa cập nhật',
          dateOfBirth: response.data.dateOfBirth
        }
        setEmployeeDetail(mappedData)
      }
    } catch (error) {
      console.error('Error fetching employee detail:', error)
      message.error('Không thể tải thông tin chi tiết nhân viên!')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!displayStaff?.id) return
    
    try {
      setResetLoading(true)
      const response = await resetEmployeePassword(displayStaff.id)
      
      if (response.success && response.data) {
        setTempPassword(response.data.temporaryPassword)
        setPasswordModalVisible(true)
        message.success('Reset mật khẩu thành công!')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Không thể reset mật khẩu. Vui lòng thử lại!')
      }
    } finally {
      setResetLoading(false)
    }
  }

  const handleClose = () => {
    setEmployeeDetail(null)
    onClose()
  }

  if (!visible) return null

  const displayStaff = employeeDetail || staff

  return (
    <>
      <Modal
        title={null}
        open={visible}
        onCancel={handleClose}
        footer={
          <div className="flex justify-between items-center">
            <Button
              type="primary"
              danger
              icon={<KeyOutlined />}
              onClick={handleResetPassword}
              loading={resetLoading}
            >
              Reset mật khẩu
            </Button>
            <Button onClick={handleClose}>Đóng</Button>
          </div>
        }
        width={700}
        className="staff-detail-modal"
      >
      <Spin spinning={loading} tip="Đang tải thông tin...">
        {displayStaff && (
          <>
            {/* Header Section with Avatar and Basic Info */}
            <div className="text-center py-6 bg-gradient-to-r from-green-50 to-blue-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={displayStaff.avatar}
                className="bg-green-100 text-green-600 border-4 border-white shadow-lg"
              />
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {displayStaff.name}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <Tag color="blue" className="text-sm px-3 py-1">
                  {displayStaff.position}
                </Tag>
                <Tag color="purple" className="text-sm px-3 py-1">
                  {displayStaff.department}
                </Tag>
                <Tag 
                  color={displayStaff.status === 'active' ? 'green' : 'red'} 
                  icon={displayStaff.status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  className="text-sm px-3 py-1"
                >
                  {displayStaff.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
                </Tag>
              </div>
            </div>

            {/* Contact Information */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thông tin liên hệ
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-blue-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium text-gray-900">{displayStaff.email}</div>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-green-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Số điện thoại</div>
                    <div className="text-sm font-medium text-gray-900">{displayStaff.phone}</div>
                  </div>
                </div>
              </Space>
            </Card>

            {/* Work Information */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thông tin công việc
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <IdcardOutlined className="text-purple-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Mã nhân viên</div>
                      <div className="text-sm font-medium text-gray-900">NV-{String(displayStaff.id).padStart(4, '0')}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-orange-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Ngày vào làm</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(displayStaff.joinDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <UserOutlined className="text-blue-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Vị trí</div>
                      <div className="text-sm font-medium text-gray-900">{displayStaff.position}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <IdcardOutlined className="text-cyan-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Chức vụ</div>
                      <div className="text-sm font-medium text-gray-900">{displayStaff.department}</div>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="flex items-start gap-3">
                    <DollarOutlined className="text-green-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Mức lương</div>
                      <div className="text-base font-bold text-green-600">
                        {displayStaff.salary ? displayStaff.salary.toLocaleString('vi-VN') : 'Chưa cập nhật'} VNĐ
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Additional Statistics */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thống kê
                </span>
              }
              className="shadow-sm"
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor((new Date() - new Date(displayStaff.joinDate)) / (1000 * 60 * 60 * 24 * 30))}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Tháng làm việc</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {displayStaff.status === 'active' ? '✓' : '✗'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Trạng thái</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">A+</div>
                    <div className="text-xs text-gray-600 mt-1">Hiệu suất</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Spin>
    </Modal>

    {/* Modal hiển thị mật khẩu tạm thời */}
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-orange-600">
          <CheckCircleOutlined className="text-2xl" />
          <span>Reset mật khẩu thành công!</span>
        </div>
      }
      open={passwordModalVisible}
      onOk={() => {
        setPasswordModalVisible(false)
        setTempPassword(null)
      }}
      onCancel={() => {
        setPasswordModalVisible(false)
        setTempPassword(null)
      }}
      width={600}
      okText="Đã lưu"
      cancelText="Đóng"
      okButtonProps={{
        className: 'bg-orange-600 hover:bg-orange-700'
      }}
    >
      <Divider className="mt-4 mb-4" />
      
      {displayStaff && tempPassword && (
        <div className="space-y-4">
          {/* Thông tin nhân viên */}
          <Alert
            message="Mật khẩu tạm thời mới đã được tạo"
            description="Vui lòng lưu lại mật khẩu tạm thời và gửi cho nhân viên. Nhân viên nên đổi mật khẩu ngay sau lần đăng nhập đầu tiên."
            type="success"
            showIcon
          />

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <Text type="secondary" className="text-sm">Nhân viên:</Text>
              <div className="font-medium text-base">{displayStaff.name}</div>
            </div>
            
            <div>
              <Text type="secondary" className="text-sm">Email đăng nhập:</Text>
              <div className="font-medium text-base">{displayStaff.email}</div>
            </div>

            <div>
              <Text type="secondary" className="text-sm">Mã nhân viên:</Text>
              <div className="font-medium text-base">NV-{String(displayStaff.id).padStart(4, '0')}</div>
            </div>
          </div>

          {/* Mật khẩu tạm thời */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="mb-2">
              <Text type="secondary" className="text-sm">Mật khẩu tạm thời mới:</Text>
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
                className="text-2xl font-mono bg-white px-4 py-2 rounded border border-orange-300"
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
                <li>Mật khẩu cũ đã bị vô hiệu hóa</li>
                <li>Gửi mật khẩu mới trực tiếp cho nhân viên qua kênh an toàn</li>
                <li>Yêu cầu nhân viên đổi mật khẩu ngay sau lần đăng nhập đầu tiên</li>
                <li>Không chia sẻ mật khẩu này qua kênh không an toàn</li>
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

export default StaffDetail
