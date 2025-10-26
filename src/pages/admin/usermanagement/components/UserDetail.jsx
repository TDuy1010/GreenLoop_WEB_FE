import React from 'react'
import { 
  Modal, 
  Avatar, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Space,
  Badge
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

const UserDetail = ({ visible, onClose, user }) => {
  if (!user) return null

  const accountTypeConfig = {
    standard: { color: 'blue', text: 'Tiêu chuẩn' },
    premium: { color: 'purple', text: 'Premium' },
    vip: { color: 'gold', text: 'VIP' }
  }

  const genderConfig = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác'
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="user-detail-modal"
    >
      {/* Header Section with Avatar and Basic Info */}
      <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <Badge 
          dot={user.status === 'active'} 
          status={user.status === 'active' ? 'success' : 'default'}
          offset={[-10, 85]}
        >
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={user.avatar}
            className="bg-blue-100 text-blue-600 border-4 border-white shadow-lg"
          />
        </Badge>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          {user.name}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <Tag color={accountTypeConfig[user.accountType]?.color || 'blue'} className="text-sm px-3 py-1">
            {accountTypeConfig[user.accountType]?.text || user.accountType}
          </Tag>
          <Tag 
            color={user.status === 'active' ? 'green' : 'red'} 
            icon={<CheckCircleOutlined />}
            className="text-sm px-3 py-1"
          >
            {user.status === 'active' ? 'Active' : 'Inactive'}
          </Tag>
          {user.isVerified && (
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
              <div className="text-sm font-medium text-gray-900">{user.email}</div>
            </div>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center gap-3">
            <PhoneOutlined className="text-green-500 text-lg" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">Số điện thoại</div>
              <div className="text-sm font-medium text-gray-900">{user.phone}</div>
            </div>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center gap-3">
            <EnvironmentOutlined className="text-red-500 text-lg" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">Địa chỉ</div>
              <div className="text-sm font-medium text-gray-900">{user.address}</div>
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
                <div className="text-sm font-medium text-gray-900">{genderConfig[user.gender]}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-start gap-3">
              <CalendarOutlined className="text-orange-500 text-lg mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Ngày sinh</div>
                <div className="text-sm font-medium text-gray-900">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
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
                  {new Date(user.joinDate).toLocaleDateString('vi-VN', {
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
                  {user.ecoPoints || 0} EP
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
                {user.totalOrders || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Đơn hàng</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <HeartOutlined className="text-3xl text-red-500 mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {user.donationCount || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Quyên góp</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <GiftOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {user.eventParticipation || 0}
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
                {(user.totalSpent || 0).toLocaleString('vi-VN')} VNĐ
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Thời gian tham gia</div>
              <div className="text-xl font-bold text-purple-600">
                {Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24 * 30))} tháng
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Modal>
  )
}

export default UserDetail

