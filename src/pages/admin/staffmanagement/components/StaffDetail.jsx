import React from 'react'
import { 
  Modal, 
  Avatar, 
  Tag, 
  Descriptions, 
  Divider,
  Row,
  Col,
  Card,
  Space
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  DollarOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'

const StaffDetail = ({ visible, onClose, staff }) => {
  if (!staff) return null

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="staff-detail-modal"
    >
      {/* Header Section with Avatar and Basic Info */}
      <div className="text-center py-6 bg-gradient-to-r from-green-50 to-blue-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <Avatar
          size={100}
          icon={<UserOutlined />}
          src={staff.avatar}
          className="bg-green-100 text-green-600 border-4 border-white shadow-lg"
        />
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          {staff.name}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <Tag color="blue" className="text-sm px-3 py-1">
            {staff.position}
          </Tag>
          <Tag color="purple" className="text-sm px-3 py-1">
            {staff.department}
          </Tag>
          <Tag 
            color={staff.status === 'active' ? 'green' : 'red'} 
            icon={staff.status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            className="text-sm px-3 py-1"
          >
            {staff.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
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
              <div className="text-sm font-medium text-gray-900">{staff.email}</div>
            </div>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center gap-3">
            <PhoneOutlined className="text-green-500 text-lg" />
            <div className="flex-1">
              <div className="text-xs text-gray-500">Số điện thoại</div>
              <div className="text-sm font-medium text-gray-900">{staff.phone}</div>
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
                <div className="text-sm font-medium text-gray-900">NV-{String(staff.id).padStart(4, '0')}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-start gap-3">
              <CalendarOutlined className="text-orange-500 text-lg mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Ngày vào làm</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(staff.joinDate).toLocaleDateString('vi-VN', {
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
                <div className="text-sm font-medium text-gray-900">{staff.position}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-start gap-3">
              <IdcardOutlined className="text-cyan-500 text-lg mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Chức vụ</div>
                <div className="text-sm font-medium text-gray-900">{staff.department}</div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="flex items-start gap-3">
              <DollarOutlined className="text-green-500 text-lg mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Mức lương</div>
                <div className="text-base font-bold text-green-600">
                  {staff.salary ? staff.salary.toLocaleString('vi-VN') : 'N/A'} VNĐ
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
                {Math.floor((new Date() - new Date(staff.joinDate)) / (1000 * 60 * 60 * 24 * 30))}
              </div>
              <div className="text-xs text-gray-600 mt-1">Tháng làm việc</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {staff.status === 'active' ? '✓' : '✗'}
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
    </Modal>
  )
}

export default StaffDetail
