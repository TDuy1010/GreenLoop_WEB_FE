import React from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Image
} from 'antd'
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  TagOutlined,
  DollarOutlined,
  FileTextOutlined,
  GiftOutlined
} from '@ant-design/icons'

const EventDetail = ({ visible, onClose, event }) => {
  if (!event) return null

  const statusConfig = {
    upcoming: { color: 'blue', text: 'Sắp diễn ra', icon: <ClockCircleOutlined /> },
    active: { color: 'green', text: 'Đang diễn ra', icon: <CheckCircleOutlined /> },
    completed: { color: 'default', text: 'Đã kết thúc', icon: <CheckCircleOutlined /> },
    cancelled: { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
    full: { color: 'orange', text: 'Đã đầy', icon: <TeamOutlined /> }
  }

  const categoryConfig = {
    workshop: { color: 'purple', text: 'Hội thảo' },
    collection: { color: 'green', text: 'Thu gom' },
    seminar: { color: 'blue', text: 'Tọa đàm' },
    volunteer: { color: 'orange', text: 'Tình nguyện' },
    campaign: { color: 'red', text: 'Chiến dịch' }
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="event-detail-modal"
    >
      {/* Header Section with Image */}
      <div className="py-6 bg-gradient-to-r from-green-50 to-blue-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex gap-4 mb-4">
            {/* Main Image */}
            <div className="flex-shrink-0">
              <Image
                width={200}
                height={200}
                src={event.image}
                alt={event.title}
                className="rounded-lg object-cover shadow-lg"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-3">{event.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {event.tags?.map(tag => (
                  <Tag key={tag} color="blue" icon={<TagOutlined />}>
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Tag 
                  color={statusConfig[event.status]?.color || 'default'}
                  icon={statusConfig[event.status]?.icon}
                  className="text-sm px-3 py-1"
                >
                  {statusConfig[event.status]?.text || event.status}
                </Tag>
                <Tag 
                  color={categoryConfig[event.category]?.color || 'default'}
                  className="text-sm px-3 py-1"
                >
                  {categoryConfig[event.category]?.text || event.category}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Information */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <CalendarOutlined className="mr-2" />
            Thông tin sự kiện
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <CalendarOutlined className="text-blue-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Ngày tổ chức</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(event.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <ClockCircleOutlined className="text-purple-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Thời gian</div>
                <div className="text-sm font-medium text-gray-900">
                  {event.startTime} - {event.endTime}
                </div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className="flex items-start gap-3">
              <EnvironmentOutlined className="text-red-500 text-lg mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Địa điểm</div>
                <div className="text-sm font-medium text-gray-900">{event.location}</div>
                <div className="text-xs text-gray-500 mt-1">{event.address}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <UserOutlined className="text-cyan-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Người tổ chức</div>
                <div className="text-sm font-medium text-gray-900">{event.organizer}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <TeamOutlined className="text-orange-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Số lượng tham gia</div>
                <div className="text-sm font-medium text-gray-900">
                  {event.registeredCount} / {event.maxParticipants} người
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Additional Details */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={12}>
          <Card 
            title={
              <span className="text-sm font-semibold text-gray-700">
                <FileTextOutlined className="mr-2" />
                Yêu cầu
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <p className="text-sm text-gray-700">{event.requirements || 'Không có yêu cầu đặc biệt'}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={
              <span className="text-sm font-semibold text-gray-700">
                <GiftOutlined className="mr-2" />
                Quyền lợi
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <p className="text-sm text-gray-700">{event.benefits || 'Chưa cập nhật'}</p>
          </Card>
        </Col>
      </Row>

      {/* Pricing & Participants */}
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <DollarOutlined className="mr-2" />
                Phí tham gia
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <div className="text-center py-2">
              {event.price === 0 ? (
                <>
                  <div className="text-3xl font-bold text-green-600 mb-1">MIỄN PHÍ</div>
                  <div className="text-xs text-gray-600">Sự kiện mở cho tất cả mọi người</div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {event.price?.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="text-xs text-gray-600">Phí đăng ký tham gia</div>
                </>
              )}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <TeamOutlined className="mr-2" />
                Thống kê
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-2">
                <TeamOutlined className="text-xl text-blue-600" />
              </div>
              <div className="text-xl font-bold text-blue-600 mb-1">
                {Math.round((event.registeredCount / event.maxParticipants) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Tỷ lệ lấp đầy</div>
              <div className="mt-2 text-xs text-gray-500">
                {event.registeredCount} / {event.maxParticipants} người
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Modal>
  )
}

export default EventDetail

