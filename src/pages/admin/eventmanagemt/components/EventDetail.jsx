import React, { useEffect, useState, useCallback } from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Skeleton,
  Table,
  Space,
  Empty,
  Button,
  Image,
  DatePicker,
  message
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
import { getEventById, getEventStaffs, getEventRegistrations, getEventDonations, getDonationById } from '../../../../service/api/eventApi'
import { getProducts, getProductsAssignableToEvent, assignProductsToEvent, removeProductsFromEvent } from '../../../../service/api/productApi'
import EventStaffEditor from './EventStaffEditor'
import DonationListModal from './DonationListModal'
import DonationDetailModal from './DonationDetailModal'
import EventProductListModal from './EventProductListModal'
import Vietmap from '../../../../components/Vietmap'
import heroImg from '../../../../assets/images/herosection.jpg'

const EventDetail = ({ visible, onClose, event }) => {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assignedStaffs, setAssignedStaffs] = useState([])
  const [loadingStaffs, setLoadingStaffs] = useState(false)
  const [registrations, setRegistrations] = useState([])
  const [loadingRegs, setLoadingRegs] = useState(false)
  const [regsModalOpen, setRegsModalOpen] = useState(false)
  const [staffsModalOpen, setStaffsModalOpen] = useState(false)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [donations, setDonations] = useState([])
  const [loadingDonations, setLoadingDonations] = useState(false)
  const [assignedProducts, setAssignedProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [assignProductModalOpen, setAssignProductModalOpen] = useState(false)
  const [productsAssignable, setProductsAssignable] = useState([])
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [assigning, setAssigning] = useState(false)
  const [displayRange, setDisplayRange] = useState([])
  const [selectedAssignedMappings, setSelectedAssignedMappings] = useState([])
  const [bulkRemoving, setBulkRemoving] = useState(false)
  const [donationsModalOpen, setDonationsModalOpen] = useState(false)
  const [donationDetail, setDonationDetail] = useState(null)
  const [loadingDonationDetail, setLoadingDonationDetail] = useState(false)
  const [donationDetailModalOpen, setDonationDetailModalOpen] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
    highlight: '',
    description: ''
  })
  const showFeedbackModal = useCallback(
    ({ type = 'info', title = '', message: content = '', highlight = '', description = '' }) => {
      setFeedbackModal({
        open: true,
        type,
        title,
        message: content,
        highlight,
        description
      })
    },
    []
  )

  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, open: false }))
  }


  const resolveMappingId = useCallback((product) => {
    if (!product) return null
    return (
      product.eventMappingId ??
      product.eventProductMappingId ??
      product.productEventMappingId ??
      product.mappingId ??
      null
    )
  }, [])
  const handleOpenDonationDetail = async (donationId) => {
    if (!donationId) return
    try {
      setLoadingDonationDetail(true)
      const res = await getDonationById(donationId)
      const data = res?.data?.data || res?.data
      if (data) {
        setDonationDetail({
          id: data.id,
          code: data.code,
          totalItems: data.totalItems ?? 0,
          totalWeight: data.totalWeight ?? 0,
          totalEcoPoints: data.totalEcoPoints ?? 0,
          inspectedBy: data.inspectedBy,
          inspectedName: data.inspectedName,
          userId: data.userId,
          donationItems: Array.isArray(data.donationItems) ? data.donationItems : []
        })
      }
    } catch (err) {
      console.error('Error loading donation detail:', err)
      setDonationDetail(null)
    } finally {
      setLoadingDonationDetail(false)
    }
  }

  // Load danh sách nhân viên đã được assign
  const loadAssignedStaffs = useCallback(async () => {
    if (!event?.id || !visible) return
    try {
      setLoadingStaffs(true)
      const res = await getEventStaffs(event.id)
      const staffList = res?.data?.data || res?.data || (Array.isArray(res) ? res : [])
      const mapped = staffList.map((s) => ({
        id: Number(s.staffId || s.id || s.employeeId),
        fullName: s.fullName || s.name || s.email,
        email: s.email,
        storeManager: s.isStoreManager === true || s.storeManager === true,
        roles: s.roles || []
      }))
      // Loại trùng theo id để tránh hiển thị lặp
      const uniq = Array.from(new Map(mapped.map(it => [it.id, it])).values())
      setAssignedStaffs(uniq)
    } catch (err) {
      console.error('Error loading assigned staffs:', err)
      setAssignedStaffs([])
    } finally {
      setLoadingStaffs(false)
    }
  }, [event?.id, visible])

  // Load danh sách người đăng ký tham gia
  const loadRegistrations = useCallback(async () => {
    if (!event?.id || !visible) return
    try {
      setLoadingRegs(true)
      const res = await getEventRegistrations(event.id, { page: 0, size: 50, sortBy: 'createdAt', sortDir: 'DESC' })
      const page = res?.data?.data || res?.data || {}
      const list = Array.isArray(page?.content) ? page.content : (Array.isArray(res) ? res : [])
      const mapped = list.map((r, idx) => ({
        key: `${r.userId || idx}-${r.createdAt}`,
        userId: String(r.userId),
        email: r.email,
        fullName: r.fullName || r.name || r.email,
        isActive: r.isActive === true,
        createdAt: r.createdAt,
        checkInTime: r.checkInTime,
        status: (r.registrationStatus || r.status || '').toString().toUpperCase()
      }))
      setRegistrations(mapped)
    } catch (err) {
      console.error('Error loading registrations:', err)
      setRegistrations([])
    } finally {
      setLoadingRegs(false)
    }
  }, [event?.id, visible])

  const loadDonations = useCallback(async () => {
    if (!event?.id || !visible) return
    try {
      setLoadingDonations(true)
      const res = await getEventDonations(event.id)
      const list = res?.data?.data || res?.data || (Array.isArray(res) ? res : [])
      const mapped = (Array.isArray(list) ? list : []).map((donation, idx) => ({
        key: donation.id || idx,
        id: donation.id,
        code: donation.code,
        totalItems: donation.totalItems ?? 0,
        totalWeight: donation.totalWeight ?? 0,
        totalEcoPoints: donation.totalEcoPoints ?? 0
      }))
      setDonations(mapped)
    } catch (err) {
      console.error('Error loading donations:', err)
      setDonations([])
    } finally {
      setLoadingDonations(false)
    }
  }, [event?.id, visible])

  const loadAssignedProducts = useCallback(async () => {
    if (!event?.id || !visible) return
    try {
      setLoadingProducts(true)
      const res = await getProductsAssignableToEvent(event.id)
      const list = res?.data?.data || res?.data || (Array.isArray(res) ? res : [])
      const mapped = (Array.isArray(list) ? list : []).map((product, idx) => {
        const mappingId = resolveMappingId(product)

        return {
          ...product,
          key: mappingId ?? product.id ?? idx,
          id: product.id,
          eventMappingId: mappingId,
          code: product.code,
          name: product.name,
          category: product.categoryName,
          type: product.type,
          status: (product.status || '').toUpperCase(),
          ecoPoints: product.ecoPointValue ?? product.ecoPoints ?? 0,
          displayFrom: product.displayFrom,
          displayTo: product.displayTo
        }
      })
      setAssignedProducts(mapped)
      // Giữ lại các productId vẫn còn trong danh sách sau khi reload
      setSelectedAssignedMappings((prev) =>
        prev.filter((id) => mapped.some((item) => item.eventMappingId === id))
      )
    } catch (err) {
      console.error('Error loading assigned products:', err)
      setAssignedProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }, [event?.id, visible, resolveMappingId])

  const openProductModal = () => {
    setProductModalOpen(true)
    setSelectedAssignedMappings([])
  }

  const computeDefaultDisplayRange = useCallback(() => {
    const baseSource = detail?.date || event?.startTime || detail?.startDate
    let base = dayjs(baseSource)
    if (!base.isValid()) {
      base = dayjs()
    }

    const parseTime = (timeText) => {
      if (!timeText || typeof timeText !== 'string') return null
      const match = timeText.match(/(\d{1,2}):(\d{2})/)
      if (!match) return null
      const hours = Number(match[1])
      const minutes = Number(match[2])
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
      return { hours, minutes }
    }

    const startTimeInfo = parseTime(detail?.startTime)
    const endTimeInfo = parseTime(detail?.endTime)

    let start = base.clone()
    if (startTimeInfo) {
      start = start.hour(startTimeInfo.hours).minute(startTimeInfo.minutes)
    } else if (event?.startTime && dayjs(event.startTime).isValid()) {
      start = dayjs(event.startTime)
    } else {
      start = start.startOf('day').hour(7).minute(0)
    }

    let end = base.clone()
    if (endTimeInfo) {
      end = end.hour(endTimeInfo.hours).minute(endTimeInfo.minutes)
    } else if (event?.endTime && dayjs(event.endTime).isValid()) {
      end = dayjs(event.endTime)
    } else {
      end = start.clone().add(8, 'hour')
    }

    if (!end.isAfter(start)) {
      end = start.clone().add(8, 'hour')
    }

    return [start, end]
  }, [event?.startTime, event?.endTime, detail?.date, detail?.startTime, detail?.endTime, detail?.startDate])

  const openAssignModal = async () => {
    try {
      setLoadingProducts(true)
      const res = await getProducts({ page: 0, size: 100, status: 'AVAILABLE' })
      const page = res?.data?.data || res?.data || {}
      const list = Array.isArray(page?.content) ? page.content : (Array.isArray(page) ? page : [])
      const mapped = list.map((product, idx) => ({
        key: product.id || idx,
        id: product.id,
        code: product.code,
        name: product.name,
        categoryName: product.categoryName,
        type: (product.type || '').toUpperCase(),
        status: (product.status || '').toUpperCase(),
        ecoPointValue: product.ecoPointValue ?? 0
      }))
      setProductsAssignable(mapped)
      setAssignProductModalOpen(true)
      setSelectedProductIds([])
      setDisplayRange(computeDefaultDisplayRange())
    } catch (err) {
      console.error('Error loading products for assign:', err)
      message.error('Không tải được danh sách sản phẩm')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleAssignProducts = async () => {
    if (!event?.id) return
    if (selectedProductIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm')
      return
    }
    if (!displayRange || displayRange.length !== 2) {
      message.warning('Vui lòng chọn thời gian hiển thị')
      return
    }
    try {
      setAssigning(true)
      const payload = {
        eventId: event.id,
        productIds: selectedProductIds,
        displayFrom: displayRange[0]?.toISOString(),
        displayTo: displayRange[1]?.toISOString()
      }
      const res = await assignProductsToEvent(payload)
      showFeedbackModal({
        type: 'success',
        title: 'Gán sản phẩm thành công',
        message: 'Các sản phẩm đã được đưa vào sự kiện.',
        highlight: `${selectedProductIds.length} sản phẩm`,
        description:
          res?.message ||
          `Thời gian hiển thị: ${dayjs(displayRange[0]).format('DD/MM HH:mm')} - ${dayjs(displayRange[1]).format(
            'DD/MM HH:mm'
          )}`
      })
      setAssignProductModalOpen(false)
      await loadAssignedProducts()
    } catch (err) {
      console.error('Assign products error:', err)
      showFeedbackModal({
        type: 'error',
        title: 'Gán sản phẩm thất bại',
        message: 'Không thể gán sản phẩm, vui lòng thử lại.',
        description: err?.response?.data?.message || err?.message
      })
    } finally {
      setAssigning(false)
    }
  }

  const handleBulkRemoveProducts = async () => {
    if (selectedAssignedMappings.length === 0) {
      message.warning('Vui lòng chọn sản phẩm cần gỡ.')
      return
    }
    if (!event?.id) {
      message.error('Không xác định được sự kiện.')
      return
    }
    try {
      setBulkRemoving(true)
      await removeProductsFromEvent(event.id, selectedAssignedMappings)
      showFeedbackModal({
        type: 'success',
        title: 'Đã gỡ sản phẩm',
        message: `Đã bỏ ${selectedAssignedMappings.length} sản phẩm khỏi sự kiện.`,
        highlight: `${selectedAssignedMappings.length} sản phẩm`,
        description: 'Danh sách được cập nhật ngay lập tức.'
      })
      setSelectedAssignedMappings([])
      await loadAssignedProducts()
    } catch (err) {
      console.error('Bulk remove products error:', err)
      showFeedbackModal({
        type: 'error',
        title: 'Không thể gỡ sản phẩm',
        message: 'Vui lòng thử lại sau.',
        description: err?.response?.data?.message || err?.message
      })
    } finally {
      setBulkRemoving(false)
    }
  }

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
    loadRegistrations()
    loadDonations()
    loadAssignedProducts()
  }, [event?.id, visible, loadAssignedStaffs, loadRegistrations, loadDonations, loadAssignedProducts])

  useEffect(() => {
    if (!visible) {
      setDetail(null)
      setLoading(false)
      setAssignedStaffs([])
      setLoadingStaffs(false)
      setDonations([])
      setLoadingDonations(false)
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
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-900">{detail?.totalRegistrations ?? 0}</div>
              <Button type="link" size="small" onClick={() => { setRegsModalOpen(true); loadRegistrations(); }}>
                Xem danh sách
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Tổng nhân sự</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-900">{detail?.totalStaffs ?? 0}</div>
              <Button type="link" size="small" onClick={() => { setStaffsModalOpen(true); loadAssignedStaffs(); }}>
                Xem danh sách
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className="text-xs text-gray-500">Tổng đơn donation</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-900">{donations.length}</div>
              <Button type="link" size="small" onClick={() => { setDonationsModalOpen(true); loadDonations(); }}>
                Xem danh sách
              </Button>
            </div>
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

      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-700">
              Sản phẩm trong sự kiện
            </span>
            <div className="flex gap-2">
              <Button type="primary" onClick={openAssignModal} className="bg-green-600">
                Gán sản phẩm
              </Button>
              <Button onClick={openProductModal} disabled={assignedProducts.length === 0}>
                Xem danh sách
              </Button>
            </div>
          </div>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <Skeleton loading={loadingProducts} active>
          {assignedProducts.length === 0 ? (
            <Empty description="Chưa có sản phẩm nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className="text-sm text-gray-600">
              Đã gán {assignedProducts.length} sản phẩm. Nhấn “Xem danh sách” để xem chi tiết.
            </div>
          )}
        </Skeleton>
      </Card>

      {/* Modals: Staffs and Registrations (giảm độ dài modal chi tiết) */}
      <Modal
        title={(
          <div className="flex items-center justify-between pr-10">
            <span>Nhân viên đã được phân công</span>
            <Button size="small" type="primary" onClick={() => setAssignModalOpen(true)}>
              Chỉnh sửa
            </Button>
          </div>
        )}
        open={staffsModalOpen}
        onCancel={() => setStaffsModalOpen(false)}
        footer={null}
        width={700}
      >
        {assignedStaffs.length === 0 ? (
          <Empty description="Chưa có nhân viên nào được phân công" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Table
            size="small"
            dataSource={assignedStaffs}
            rowKey="id"
            loading={loadingStaffs}
            pagination={{ pageSize: 10 }}
            columns={[
              {
                title: 'Họ tên',
                dataIndex: 'fullName',
                key: 'fullName',
                render: (text, record) => (
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>{text}</span>
                    {record.storeManager && (<Tag color="gold" size="small">Quản lý</Tag>)}
                  </Space>
                )
              },
              { title: 'Email', dataIndex: 'email', key: 'email' },
              {
                title: 'Vai trò',
                dataIndex: 'roles',
                key: 'roles',
                render: (roles, record) => {
                  const roleList = []
                  if (roles && Array.isArray(roles) && roles.length > 0) roleList.push(...roles)
                  if (record.storeManager) roleList.push('Quản lý cửa hàng')
                  if (roleList.length === 0) roleList.push('Nhân viên')
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
      </Modal>

      <DonationListModal
        visible={donationsModalOpen}
        loading={loadingDonations}
        donations={donations}
        onClose={() => setDonationsModalOpen(false)}
        onViewDetail={async (donationId) => {
          await handleOpenDonationDetail(donationId)
          setDonationDetailModalOpen(true)
        }}
      />

      {/* Modal chỉnh sửa phân công nhân viên */}
      <EventStaffEditor
        visible={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        eventId={detail?.id || event?.id}
        assigned={assignedStaffs}
        onSaved={async (updatedList) => {
          setAssignModalOpen(false)
          if (Array.isArray(updatedList)) {
            setAssignedStaffs(updatedList.map(it => ({ id: it.staffId, fullName: it.fullName, email: it.email, storeManager: !!it.storeManager })))
          }
          await loadAssignedStaffs()
        }}
      />

      <Modal
        title={( 
          <div className="flex items-center justify-between pr-12">
            <span>Danh sách người đăng ký tham gia</span>
          </div>
        )}
        open={regsModalOpen}
        onCancel={() => setRegsModalOpen(false)}
        footer={null}
        width={800}
      >
        {registrations.length === 0 ? (
          <Empty description="Chưa có người đăng ký" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Table
            size="small"
            dataSource={registrations}
            rowKey="key"
            loading={loadingRegs}
            pagination={{ pageSize: 10 }}
            columns={[
              { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
              { title: 'Email', dataIndex: 'email', key: 'email' },
              {
                title: 'Trạng thái', dataIndex: 'status', key: 'status',
                render: (_, record) => {
                  const current = (record.status || '').toUpperCase()
                  const color = current === 'BOOKED' ? 'green'
                    : current === 'CHECKED_IN' || current === 'ATTENDED' ? 'blue'
                    : current === 'NO_SHOW' ? 'orange'
                    : current === 'BLOCKED' ? 'purple'
                    : 'red'
                  return <Tag color={color}>{current || 'UNKNOWN'}</Tag>
                }
              },
              { title: 'Ngày đăng ký', dataIndex: 'createdAt', key: 'createdAt', render: (v) => v ? new Date(v).toLocaleString('vi-VN') : '-' },
              { title: 'Check-in', dataIndex: 'checkInTime', key: 'checkInTime', render: (v) => v ? new Date(v).toLocaleString('vi-VN') : '-' }
            ]}
          />
        )}
      </Modal>

      <DonationDetailModal
        visible={donationDetailModalOpen}
        loading={loadingDonationDetail}
        donation={donationDetail}
        onClose={() => {
          setDonationDetailModalOpen(false)
          setDonationDetail(null)
        }}
      />

      <EventProductListModal
        open={productModalOpen}
        loading={loadingProducts}
        products={assignedProducts}
        selectedRowKeys={selectedAssignedMappings}
        onSelectionChange={setSelectedAssignedMappings}
        onBulkRemove={handleBulkRemoveProducts}
        bulkRemoving={bulkRemoving}
        onClose={() => {
          setProductModalOpen(false)
          setSelectedAssignedMappings([])
        }}
      />

      {/* Modal gán sản phẩm vào sự kiện */}
      <Modal
        title="Gán sản phẩm vào sự kiện"
        open={assignProductModalOpen}
        onCancel={() => setAssignProductModalOpen(false)}
        onOk={handleAssignProducts}
        confirmLoading={assigning}
        width={800}
        okText="Gán sản phẩm"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn thời gian hiển thị
            </label>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              showTime
              format="DD/MM/YYYY HH:mm"
              value={displayRange}
              onChange={(dates) => setDisplayRange(dates || [])}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn sản phẩm ({selectedProductIds.length} đã chọn)
            </label>
            <Table
              size="small"
              dataSource={productsAssignable}
              rowKey="id"
              loading={loadingProducts}
              pagination={{ pageSize: 10 }}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedProductIds,
                onChange: (selectedKeys) => setSelectedProductIds(selectedKeys),
              }}
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <div>
                      <div className="font-medium text-gray-900">{text}</div>
                      <div className="text-xs text-gray-500">Mã: {record.code}</div>
                    </div>
                  )
                },
                { title: 'Danh mục', dataIndex: 'categoryName', key: 'categoryName' },
                {
                  title: 'Loại',
                  dataIndex: 'type',
                  key: 'type',
                  render: (value) => (
                    <Tag color={value === 'CHARITY' ? 'green' : 'blue'}>
                      {value === 'CHARITY' ? 'Quyên góp' : 'Mua bán'}
                    </Tag>
                  )
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    const color = status === 'AVAILABLE' ? 'green' : 'orange'
                    return <Tag color={color}>{status || 'N/A'}</Tag>
                  }
                },
                { title: 'Eco Points', dataIndex: 'ecoPointValue', key: 'ecoPointValue', align: 'right' }
              ]}
            />
          </div>
        </div>
      </Modal>

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

      <Modal
        open={feedbackModal.open}
        onCancel={closeFeedbackModal}
        footer={[
          <Button key="close" type="primary" onClick={closeFeedbackModal}>
            Đóng
          </Button>
        ]}
        centered
        title={feedbackModal.title || (feedbackModal.type === 'success' ? 'Thành công' : 'Thông báo')}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
              feedbackModal.type === 'success'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}
          >
            {feedbackModal.type === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </div>
          <div className="space-y-1">
            {feedbackModal.highlight && (
              <p className="text-sm font-semibold text-gray-900">{feedbackModal.highlight}</p>
            )}
            <p className="text-gray-700 text-sm leading-relaxed">{feedbackModal.message}</p>
            {feedbackModal.description && (
              <p className="text-xs text-gray-500">{feedbackModal.description}</p>
            )}
          </div>
        </div>
      </Modal>
    </Modal>
  )
}

export default EventDetail

