import React from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Table,
  Badge
} from 'antd'
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InboxOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons'

const DonationDetail = ({ visible, onClose, donation }) => {
  if (!donation) return null

  const statusConfig = {
    received: { color: 'green', text: 'Đã tiếp nhận', icon: <CheckCircleOutlined /> },
    pending: { color: 'orange', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
    processing: { color: 'blue', text: 'Đang xử lý', icon: <ClockCircleOutlined /> },
    rejected: { color: 'red', text: 'Từ chối', icon: <CloseCircleOutlined /> }
  }

  const getConditionColor = (condition) => {
    if (condition.includes('95%') || condition.includes('90%')) return 'green'
    if (condition.includes('85%') || condition.includes('80%')) return 'blue'
    if (condition.includes('75%') || condition.includes('70%')) return 'orange'
    return 'default'
  }

  const clothingColumns = [
    {
      title: 'Loại quần áo',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (qty) => <Badge count={qty} showZero color="#1890ff" />
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => <Tag>{size}</Tag>
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (color) => <Tag color="blue">{color}</Tag>
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition) => (
        <Tag color={getConditionColor(condition)}>
          {condition}
        </Tag>
      )
    }
  ]

  const totalItems = donation.clothingItems?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="donation-detail-modal"
    >
      {/* Header Section */}
      <div className="py-6 bg-gradient-to-r from-green-50 to-blue-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Quyên góp #{donation.id}
            </h2>
            <Tag 
              color={statusConfig[donation.status]?.color || 'default'}
              icon={statusConfig[donation.status]?.icon}
              className="text-base px-4 py-2"
            >
              {statusConfig[donation.status]?.text || donation.status}
            </Tag>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <CalendarOutlined />
              {new Date(donation.donatedAt).toLocaleString('vi-VN')}
            </span>
            <span className="flex items-center gap-2">
              <InboxOutlined />
              {totalItems} món đồ
            </span>
            {donation.totalWeight && (
              <span className="flex items-center gap-2">
                <FileTextOutlined />
                {donation.totalWeight} kg
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Donor Information */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <UserOutlined className="mr-2" />
            Thông tin người quyên góp
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <UserOutlined className="text-blue-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Họ và tên</div>
                <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <PhoneOutlined className="text-green-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="text-sm font-medium text-gray-900">{donation.donorPhone}</div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="flex items-center gap-3">
              <MailOutlined className="text-purple-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm font-medium text-gray-900">{donation.donorEmail}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Event Information */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <EnvironmentOutlined className="mr-2" />
            Thông tin sự kiện
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <div className="flex items-center gap-3">
          <CalendarOutlined className="text-orange-500 text-lg" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Sự kiện</div>
            <div className="text-sm font-medium text-gray-900">{donation.eventName}</div>
          </div>
        </div>
      </Card>

      {/* Clothing Items */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <InboxOutlined className="mr-2" />
            Danh sách quần áo quyên góp ({totalItems} món)
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <Table
          columns={clothingColumns}
          dataSource={donation.clothingItems}
          pagination={false}
          rowKey={(record, index) => index}
          size="small"
        />
      </Card>

      {/* Additional Information */}
      <Row gutter={[16, 16]}>
        {donation.receivedBy && (
          <Col span={12}>
            <Card 
              title={
                <span className="text-sm font-semibold text-gray-700">
                  <TeamOutlined className="mr-2" />
                  Người tiếp nhận
                </span>
              }
              className="shadow-sm"
              size="small"
            >
              <div className="text-center py-2">
                <div className="text-lg font-bold text-blue-600 mb-1">
                  {donation.receivedBy}
                </div>
                <div className="text-xs text-gray-600">Nhân viên tiếp nhận</div>
              </div>
            </Card>
          </Col>
        )}
        <Col span={donation.receivedBy ? 12 : 24}>
          <Card 
            title={
              <span className="text-sm font-semibold text-gray-700">
                <FileTextOutlined className="mr-2" />
                Ghi chú
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <p className="text-sm text-gray-700 min-h-[60px]">
              {donation.note || 'Không có ghi chú'}
            </p>
          </Card>
        </Col>
      </Row>

      {/* Statistics */}
      <Divider />
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card className="text-center bg-blue-50" size="small">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {totalItems}
            </div>
            <div className="text-xs text-gray-600">Tổng số món</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="text-center bg-green-50" size="small">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {donation.clothingItems?.length || 0}
            </div>
            <div className="text-xs text-gray-600">Loại quần áo</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="text-center bg-purple-50" size="small">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {donation.totalWeight || 0} kg
            </div>
            <div className="text-xs text-gray-600">Tổng khối lượng</div>
          </Card>
        </Col>
      </Row>
    </Modal>
  )
}

export default DonationDetail

