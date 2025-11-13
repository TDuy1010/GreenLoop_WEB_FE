import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Avatar, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Space,
  Badge,
  Spin,
  message
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  GiftOutlined,
  StarOutlined
} from '@ant-design/icons'
import { getCustomerById } from '../../../../service/api/customerApi'

const UserDetail = ({ visible, onClose, user }) => {
  const [customerDetail, setCustomerDetail] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && user?.id) {
      fetchCustomerDetail(user.id)
    }
  }, [visible, user?.id])

  const fetchCustomerDetail = async (customerId) => {
    try {
      setLoading(true)
      const response = await getCustomerById(customerId)
      
      if (response.success && response.data) {
        // Map API data to component format
        const mappedData = {
          id: response.data.id,
          name: response.data.fullName,
          email: response.data.email,
          phone: response.data.phoneNumber || 'Chưa có',
          gender: response.data.gender || 'other',
          dateOfBirth: response.data.dateOfBirth,
          address: 'Chưa cập nhật',
          joinDate: response.data.createdAt,
          status: response.data.isActive ? 'active' : 'inactive',
          isVerified: response.data.isEmailVerified,
          avatar: response.data.avatarUrl,
          totalOrders: 0,
          totalSpent: 0,
          ecoPoints: 0,
          lastLogin: response.data.updatedAt,
          accountType: 'standard',
          donationCount: 0,
          eventParticipation: 0
        }
        setCustomerDetail(mappedData)
      }
    } catch (error) {
      console.error('Error fetching customer detail:', error)
      message.error('Không thể tải thông tin chi tiết khách hàng!')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCustomerDetail(null)
    onClose()
  }

  if (!visible) return null

  const accountTypeConfig = {
    standard: { color: 'blue', text: 'Tiêu chuẩn' },
    premium: { color: 'purple', text: 'Premium' },
    vip: { color: 'gold', text: 'VIP' }
  }

  const genderConfig = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Chưa cập nhật'
  }

  const displayUser = customerDetail || user

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      className="user-detail-modal"
    >
      <Spin spinning={loading} tip="Đang tải thông tin...">
        {displayUser && (
          <>
            {/* Header Section with Avatar and Basic Info */}
            <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
              <Badge 
                dot={displayUser.status === 'active'} 
                status={displayUser.status === 'active' ? 'success' : 'default'}
                offset={[-10, 85]}
              >
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  src={displayUser.avatar}
                  className="bg-blue-100 text-blue-600 border-4 border-white shadow-lg"
                />
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {displayUser.name}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <Tag color={accountTypeConfig[displayUser.accountType]?.color || 'blue'} className="text-sm px-3 py-1">
                  {accountTypeConfig[displayUser.accountType]?.text || displayUser.accountType}
                </Tag>
                <Tag 
                  color={displayUser.status === 'active' ? 'green' : 'red'} 
                  icon={<CheckCircleOutlined />}
                  className="text-sm px-3 py-1"
                >
                  {displayUser.status === 'active' ? 'Active' : 'Inactive'}
                </Tag>
                {displayUser.isVerified && (
                  <Tag color="green" icon={<CheckCircleOutlined />} className="text-sm px-3 py-1">
                    Đã xác thực
                  </Tag>
                )}
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
                    <div className="text-sm font-medium text-gray-900">{displayUser.email}</div>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-green-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Số điện thoại</div>
                    <div className="text-sm font-medium text-gray-900">{displayUser.phone}</div>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center gap-3">
                  <EnvironmentOutlined className="text-red-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Địa chỉ</div>
                    <div className="text-sm font-medium text-gray-900">{displayUser.address}</div>
                  </div>
                </div>
              </Space>
            </Card>

            {/* Personal Information */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thông tin cá nhân
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <UserOutlined className="text-purple-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Giới tính</div>
                      <div className="text-sm font-medium text-gray-900">{genderConfig[displayUser.gender]}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-orange-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Ngày sinh</div>
                      <div className="text-sm font-medium text-gray-900">
                        {displayUser.dateOfBirth ? new Date(displayUser.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-cyan-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Ngày tham gia</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(displayUser.joinDate).toLocaleDateString('vi-VN', {
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
                    <StarOutlined className="text-yellow-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Điểm Eco</div>
                      <div className="text-base font-bold text-yellow-600">
                        {displayUser.ecoPoints || 0} EP
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Activity Statistics */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Hoạt động
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <ShoppingCartOutlined className="text-3xl text-blue-500 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {displayUser.totalOrders || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Đơn hàng</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <HeartOutlined className="text-3xl text-red-500 mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {displayUser.donationCount || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Quyên góp</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <GiftOutlined className="text-3xl text-green-500 mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {displayUser.eventParticipation || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Sự kiện</div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Financial Information */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thông tin tài chính
                </span>
              }
              className="shadow-sm"
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Tổng chi tiêu</div>
                    <div className="text-xl font-bold text-green-600">
                      {(displayUser.totalSpent || 0).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Thời gian tham gia</div>
                    <div className="text-xl font-bold text-purple-600">
                      {Math.floor((new Date() - new Date(displayUser.joinDate)) / (1000 * 60 * 60 * 24 * 30))} tháng
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Spin>
    </Modal>
  )
}

export default UserDetail

