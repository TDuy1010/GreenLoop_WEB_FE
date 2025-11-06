import React, { useEffect, useState, useCallback } from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Image,
  Skeleton,
  Table,
  Space,
  Empty
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TagOutlined,
  TeamOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getEventById, getEventStaffs } from '../../../../service/api/eventApi'
import Vietmap from '../../../../components/Vietmap'
import heroImg from '../../../../assets/images/herosection.jpg'

const EventDetail = ({ visible, onClose, event }) => {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assignedStaffs, setAssignedStaffs] = useState([])
  const [loadingStaffs, setLoadingStaffs] = useState(false)

  // Load danh sách nhân viên đã được assign
  const loadAssignedStaffs = useCallback(async () => {
    if (!event?.id || !visible) return
    try {
      setLoadingStaffs(true)
      const res = await getEventStaffs(event.id)
      const staffList = res?.data?.data || res?.data || (Array.isArray(res) ? res : [])
      const mapped = staffList.map((s) => ({
        id: s.staffId || s.id || s.employeeId,
        fullName: s.fullName || s.name || s.email,
        email: s.email,
        storeManager: s.isStoreManager === true || s.storeManager === true,
        roles: s.roles || []
      }))
      setAssignedStaffs(mapped)
    } catch (err) {
      console.error('Error loading assigned staffs:', err)
      setAssignedStaffs([])
    } finally {
      setLoadingStaffs(false)
    }
  }, [event?.id, visible])

  useEffect(() => {
    const loadDetail = async () => {
      if (!event?.id || !visible) return
      setLoading(true)
      setDetail(null)
      try {
        const res = await getEventById(event.id)
        const d = res?.data?.data || res?.data // Kiểm tra cả nested structure
        console.log('Event Detail Response:', res)
        console.log('Event Data:', d)
        
        if (d) {
          // Kiểm tra nhiều tên field khác nhau cho hình ảnh
          const imageUrl = d.imageUrl || 
                          d.thumbnail || 
                          d.thumbnailUrl || 
                          d.image || 
                          d.photo ||
                          (res?.data?.imageUrl) || 
                          (res?.data?.thumbnail) ||
                          null
          
          console.log('Image URL found:', imageUrl)
          
          setDetail({
            id: d.id,
            code: d.code,
            title: d.name,
            description: d.description,
            image: imageUrl || heroImg,
            location: d.locationDetail || d.location,
            address: d.locationDetail || d.location,
            date: d.startTime,
            // Convert UTC time từ backend về GMT+7 (Việt Nam) khi hiển thị
            // Backend lưu UTC: 7:00 GMT+7 = 00:00 UTC, 10:00 GMT+7 = 03:00 UTC
            // Cần convert: UTC + 7 giờ = GMT+7
            startTime: (() => {
              try {
                // Parse UTC string (có Z hoặc UTC format)
                const date = new Date(d.startTime)
                // Thêm 7 giờ (7 * 60 * 60 * 1000 milliseconds) để convert về GMT+7
                const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
                return dayjs(vietnamTime).format('HH:mm')
              } catch (e) {
                console.error('Error parsing startTime:', d.startTime, e)
                // Fallback: thử parse như local time
                try {
                  return dayjs(d.startTime).format('HH:mm')
                } catch {
                  return '--:--'
                }
              }
            })(),
            endTime: (() => {
              try {
                // Parse UTC string và thêm 7 giờ để convert về GMT+7
                const date = new Date(d.endTime)
                const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
                return dayjs(vietnamTime).format('HH:mm')
              } catch (e) {
                console.error('Error parsing endTime:', d.endTime, e)
                // Fallback: thử parse như local time
                try {
                  return dayjs(d.endTime).format('HH:mm')
                } catch {
                  return '--:--'
                }
              }
            })(),
            status: d.status,
            coordinates: d.latitude && d.longitude ? { lat: Number(d.latitude), lng: Number(d.longitude) } : undefined,
            totalRegistrations: d.totalRegistrations,
            totalStaffs: d.totalStaffs,
            isRegistered: d.isRegistered,
            isActive: d.isActive,
            googlePlaceId: d.googlePlaceId,
            createdBy: d.createByName || d.createdBy,
            createdAt: d.createdAt,
            updatedBy: d.updatedByName || d.updatedBy,
            updatedAt: d.updatedAt,
          })
        }
      } catch (error) {
        console.error('Error loading event detail:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
    loadAssignedStaffs()
  }, [event?.id, visible, loadAssignedStaffs])

  useEffect(() => {
    if (!visible) {
      setDetail(null)
      setLoading(false)
      setAssignedStaffs([])
      setLoadingStaffs(false)
    }
  }, [visible])

  if (!event || !visible) return null

  const statusConfig = {
    CREATED: { color: 'blue', text: 'Đã tạo', icon: <ClockCircleOutlined /> },
    PUBLISHED: { color: 'green', text: 'Công khai', icon: <CheckCircleOutlined /> },
    COMPLETED: { color: 'default', text: 'Đã kết thúc', icon: <CheckCircleOutlined /> },
    CANCELLED: { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> }
  }

  return (
    <Modal
      title={null}
      open={visible && !!detail}
      onCancel={onClose}
      footer={null}
      width={900}
      className="event-detail-modal"
      destroyOnClose
      key={event?.id}
    >
      {/* Header Section with Image */}
      <div className="py-6 bg-gradient-to-r from-green-50 to-blue-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex gap-4 mb-4">
            {/* Main Image */}
            <div className="flex-shrink-0">
              <Skeleton loading={loading} active avatar paragraph={false} title={false}>
                <Image
                width={200}
                height={200}
                src={detail?.image || heroImg}
                alt={detail?.title}
                className="rounded-lg object-cover shadow-lg"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              </Skeleton>
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <Skeleton loading={loading} active title paragraph={false}>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {detail?.title || 'Chi tiết sự kiện'}
                </h2>
              </Skeleton>
              {detail?.code && (
                <div className="text-xs text-gray-500 mb-2">Mã sự kiện: <span className="font-medium text-gray-700">{detail.code}</span></div>
              )}
              <Skeleton loading={loading} active paragraph={{ rows: 2 }} title={false}>
                <p className="text-gray-600 mb-3 line-clamp-3">{detail?.description}</p>
              </Skeleton>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {detail?.tags?.map(tag => (
                  <Tag key={tag} color="blue" icon={<TagOutlined />}>
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Tag 
                  color={statusConfig[detail?.status]?.color || 'default'}
                  icon={statusConfig[detail?.status]?.icon}
                  className="text-sm px-3 py-1"
                >
                  {statusConfig[detail?.status]?.text || detail?.status}
                </Tag>
                {detail?.isActive !== undefined && (
                  <Tag color={detail.isActive ? 'green' : 'red'} className="text-sm px-3 py-1">
                    {detail.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                  </Tag>
                )}
                {detail?.isRegistered !== undefined && (
                  <Tag color={detail.isRegistered ? 'blue' : 'default'} className="text-sm px-3 py-1">
                    {detail.isRegistered ? 'Bạn đã đăng ký' : 'Chưa đăng ký'}
                  </Tag>
                )}
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
        <Skeleton loading={loading} active>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <CalendarOutlined className="text-blue-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Ngày tổ chức</div>
                <div className="text-sm font-medium text-gray-900">
                  {detail?.date ? new Date(detail.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''}
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
                  {detail?.startTime} - {detail?.endTime}
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Tổng đăng ký</div>
            <div className="text-sm font-medium text-gray-900">{detail?.totalRegistrations ?? 0}</div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Tổng nhân sự</div>
            <div className="text-sm font-medium text-gray-900">{detail?.totalStaffs ?? 0}</div>
          </Col>
          <Col span={24}>
            <div className="flex items-start gap-3">
              <EnvironmentOutlined className="text-red-500 text-lg mt-1" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Địa điểm</div>
                <div className="text-sm font-medium text-gray-900">{detail?.location}</div>
                <div className="text-xs text-gray-500 mt-1">{detail?.address}</div>
                {detail?.coordinates && (
                  <div className="text-xs text-gray-500 mt-1">Toạ độ: {detail.coordinates.lat}, {detail.coordinates.lng}</div>
                )}
                {detail?.googlePlaceId && (
                  <div className="text-xs text-gray-500 mt-1">Google Place ID: {detail.googlePlaceId}</div>
                )}
              </div>
            </div>
          </Col>
        </Row>
        </Skeleton>
      </Card>

      {/* Assigned Staffs */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <TeamOutlined className="mr-2" />
            Nhân viên đã được phân công ({assignedStaffs.length})
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
        loading={loadingStaffs}
      >
        {assignedStaffs.length === 0 ? (
          <Empty 
            description="Chưa có nhân viên nào được phân công cho sự kiện này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            size="small"
            dataSource={assignedStaffs}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Họ tên',
                dataIndex: 'fullName',
                key: 'fullName',
                render: (text, record) => (
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>{text}</span>
                    {record.storeManager && (
                      <Tag color="gold" size="small">Quản lý</Tag>
                    )}
                  </Space>
                )
              },
              {
                title: 'Email',
                dataIndex: 'email',
                key: 'email'
              },
              {
                title: 'Vai trò',
                dataIndex: 'roles',
                key: 'roles',
                render: (roles, record) => {
                  const roleList = []
                  // Thêm vai trò từ mảng roles nếu có
                  if (roles && Array.isArray(roles) && roles.length > 0) {
                    roleList.push(...roles)
                  }
                  // Thêm vai trò "Quản lý cửa hàng" nếu là store manager
                  if (record.storeManager) {
                    roleList.push('Quản lý cửa hàng')
                  }
                  // Nếu không có vai trò nào, hiển thị "Nhân viên"
                  if (roleList.length === 0) {
                    roleList.push('Nhân viên')
                  }
                  return (
                    <Space wrap>
                      {roleList.map((role, index) => (
                        <Tag key={index} size="small" color={role === 'Quản lý cửa hàng' ? 'gold' : 'default'}>
                          {role}
                        </Tag>
                      ))}
                    </Space>
                  )
                }
              }
            ]}
          />
        )}
      </Card>

      {/* System Meta */}
      <Card 
        title={<span className="text-base font-semibold text-gray-700">Thông tin hệ thống</span>}
        className="mb-4 shadow-sm"
        size="small"
      >
        <Row gutter={[16, 12]}>
          <Col span={12}>
            <div className="text-xs text-gray-500">Tạo bởi</div>
            <div className="text-sm font-medium text-gray-900">{detail?.createdBy || '-'}</div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Ngày tạo</div>
            <div className="text-sm font-medium text-gray-900">{detail?.createdAt ? new Date(detail.createdAt).toLocaleString('vi-VN') : '-'}</div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Cập nhật bởi</div>
            <div className="text-sm font-medium text-gray-900">{detail?.updatedBy || '-'}</div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Ngày cập nhật</div>
            <div className="text-sm font-medium text-gray-900">{detail?.updatedAt ? new Date(detail.updatedAt).toLocaleString('vi-VN') : '-'}</div>
          </Col>
        </Row>
      </Card>

      {/* Vietmap Location */}
      {!loading && detail?.coordinates && (
        <Card 
          title={
            <span className="text-base font-semibold text-gray-700">
              Vị trí sự kiện (Vietmap)
            </span>
          }
          className="shadow-sm mb-4"
          size="small"
        >
          <Vietmap
            latitude={detail.coordinates.lat}
            longitude={detail.coordinates.lng}
            height="360px"
            apiKey={import.meta.env.VITE_VIETMAP_API_KEY || '3aa910999593c14303117e42dc0e62171cd42a0daa6c944c'}
            zoom={16}
          />
        </Card>
      )}
      {/* Dữ liệu chi tiết hiện không yêu cầu thêm các khối phụ */}
    </Modal>
  )
}

export default EventDetail

