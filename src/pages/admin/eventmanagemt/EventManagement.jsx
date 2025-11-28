import React, { useEffect, useState } from 'react'
import { 
  Button, 
  Input, 
  Select, 
  message,
  Card,
  Row,
  Col,
  Statistic
} from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
 

import EventTable from './components/EventTable'
import EventAssignStaff from './components/EventAssignStaff'
import EventStaffEditor from './components/EventStaffEditor'
import EventDetail from './components/EventDetail'
import EventAdd from './components/EventAdd'
import EventEdit from './components/EventEdit'
import { getEvents, getEventStaffs } from '../../../service/api/eventApi'
import { API_CONFIG } from '../../../service/instance'
import { EVENT_STATUS_OPTIONS, EVENT_STATUS_CONFIG, EVENT_STATUS_EQUIVALENTS } from './constants/status'
import { isStaffOnly } from '../../../utils/authHelper'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input


const getStaffCount = (ev = {}) => {
  const candidates = [
    ev.totalStaffs,
    ev.staffCount,
    ev.staffsCount,
    ev.assignedStaffCount,
    Array.isArray(ev.staffs) ? ev.staffs.length : undefined,
    Array.isArray(ev.eventStaffs) ? ev.eventStaffs.length : undefined
  ]
  const found = candidates.find((val) => typeof val === 'number' && !Number.isNaN(val))
  return found ?? 0
}

const EventManagement = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [selectedEventForAssign, setSelectedEventForAssign] = useState(null)
  const [editorModalVisible, setEditorModalVisible] = useState(false)
  const [selectedEventForEditor, setSelectedEventForEditor] = useState(null)
  const [assignedStaffs, setAssignedStaffs] = useState([])

  const [eventData, setEventData] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Load danh sách sự kiện từ API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await getEvents({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'DESC' })
        const list = res?.data?.content || []
        console.log('EventManagement - First event from API:', list[0])
        console.log('EventManagement - First event description:', list[0]?.description)
        console.log('EventManagement - First event totalStaffs:', list[0]?.totalStaffs, typeof list[0]?.totalStaffs)
        const mapped = list.map(ev => {
          // Chuẩn hoá URL ảnh từ backend (ưu tiên các field phổ biến)
          const rawImage = ev.imageUrl || ev.thumbnail || ev.thumbnailUrl || ev.image || ev.photo || ''
          const isAbsolute = typeof rawImage === 'string' && /^(http|https):\/\//i.test(rawImage)
          // Lấy domain API gốc (bỏ /api/v1 nếu có) để ghép cho đường dẫn tương đối
          const apiRoot = (API_CONFIG?.BASE_URL || '').replace(/\/api\/v1$/i, '')
          const normalizedImage = (() => {
            if (!rawImage) return ''
            if (isAbsolute) return rawImage
            // Nếu đường dẫn đã bắt đầu bằng /api thì để nguyên (dev proxy sẽ forward)
            if (rawImage.startsWith('/api')) return rawImage
            // Ngược lại, ghép với apiRoot nếu có; fallback ghép với BASE_URL
            if (apiRoot) return `${apiRoot}${rawImage}`
            return `${API_CONFIG?.BASE_URL || ''}${rawImage}`
          })()
          // Convert UTC time từ backend về GMT+7 (Việt Nam) khi hiển thị
          const convertToVietnamTime = (utcTimeString) => {
            try {
              const date = new Date(utcTimeString)
              // Thêm 7 giờ để convert từ UTC về GMT+7
              const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
              return dayjs(vietnamTime).format('HH:mm')
            } catch {
              // Fallback: thử parse như local time
              try {
                return dayjs(utcTimeString).format('HH:mm')
              } catch {
                return '--:--'
              }
            }
          }

          // Convert UTC date về GMT+7 để lấy đúng ngày
          const convertToVietnamDate = (utcTimeString) => {
            try {
              const date = new Date(utcTimeString)
              // Thêm 7 giờ để convert từ UTC về GMT+7
              const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
              return dayjs(vietnamTime).format('YYYY-MM-DD')
            } catch {
              // Fallback: lấy 10 ký tự đầu nếu không parse được
              return utcTimeString?.substring(0, 10) || ''
            }
          }

          return {
            id: ev.id,
            title: ev.name,
            description: ev.description || '',
            date: convertToVietnamDate(ev.startTime),
            startTime: convertToVietnamTime(ev.startTime),
            endTime: convertToVietnamTime(ev.endTime),
            location: ev.location,
            address: '',
            coordinates: ev.latitude && ev.longitude ? { lat: Number(ev.latitude), lng: Number(ev.longitude) } : undefined,
            maxParticipants: Number(ev.maxParticipants) || 0,
            registeredCount: Number(ev.registeredCount) || 0,
            totalParticipants: Number(ev.totalParticipants) || 0,
            totalStaffs: Number(ev.totalStaffs) || 0,
            staffCount: getStaffCount(ev),
            status: ev.status, // CREATED | PUBLISHED | ...
            isActive: ev.isActive === true,
            category: ev.category || 'workshop',
            organizer: 'GreenLoop',
            image: normalizedImage,
            tags: [],
            price: ev.price || 0,
          }
        })
        setEventData(mapped)
        setFilteredData(mapped)
      } catch (e) {
        setError(e?.message || 'Không thể tải danh sách sự kiện')
        message.error('Tải danh sách sự kiện thất bại')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  

  // Statistics
  const totalEvents = eventData.length
  const upcomingEvents = eventData.filter(event => event.status === 'UPCOMING').length
  const activeEvents = eventData.filter(event => event.status === 'ONGOING').length
  const totalParticipants = eventData.reduce((sum, event) => sum + (event.registeredCount || 0), 0)

  // Không dùng phân loại (category) nữa


  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, filterStatus)
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    filterData(searchText, value)
  }

  const filterData = (search, status, data = null) => {
    // Sử dụng data được truyền vào hoặc eventData từ state
    let filtered = data || eventData

    if (search) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase()) ||
        event.location?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      const equivalents = EVENT_STATUS_EQUIVALENTS[status] || [status]
      filtered = filtered.filter(event => equivalents.includes(event.status))
    }

    setFilteredData(filtered)
  }

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true)
  }

  const handleAddEvent = async () => {
    // Reload danh sách từ API sau khi tạo thành công
    console.log('EventManagement: handleAddEvent called - reloading event list...')
    try {
      setLoading(true)
      setError('')
      const res = await getEvents({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'DESC' })
      console.log('EventManagement: getEvents response:', res)
      const list = res?.data?.content || []
      console.log('EventManagement: Found', list.length, 'events')
      const mapped = list.map(ev => {
        const rawImage = ev.imageUrl || ev.thumbnail || ev.thumbnailUrl || ev.image || ev.photo || ''
        const isAbsolute = typeof rawImage === 'string' && /^(http|https):\/\//i.test(rawImage)
        const apiRoot = (API_CONFIG?.BASE_URL || '').replace(/\/api\/v1$/i, '')
        const normalizedImage = (() => {
          if (!rawImage) return ''
          if (isAbsolute) return rawImage
          if (rawImage.startsWith('/api')) return rawImage
          if (apiRoot) return `${apiRoot}${rawImage}`
          return `${API_CONFIG?.BASE_URL || ''}${rawImage}`
        })()
        // Convert UTC time từ backend về GMT+7 (Việt Nam) khi hiển thị
        const convertToVietnamTime = (utcTimeString) => {
          try {
            const date = new Date(utcTimeString)
            // Thêm 7 giờ để convert từ UTC về GMT+7
            const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
            return dayjs(vietnamTime).format('HH:mm')
          } catch {
            // Fallback: thử parse như local time
            try {
              return dayjs(utcTimeString).format('HH:mm')
            } catch {
              return '--:--'
            }
          }
        }

        // Convert UTC date về GMT+7 để lấy đúng ngày
        const convertToVietnamDate = (utcTimeString) => {
          try {
            const date = new Date(utcTimeString)
            // Thêm 7 giờ để convert từ UTC về GMT+7
            const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
            return dayjs(vietnamTime).format('YYYY-MM-DD')
          } catch {
            // Fallback: lấy 10 ký tự đầu nếu không parse được
            return utcTimeString?.substring(0, 10) || ''
          }
        }

        return {
          id: ev.id,
          title: ev.name,
          description: ev.description || '',
          date: convertToVietnamDate(ev.startTime),
          startTime: convertToVietnamTime(ev.startTime),
          endTime: convertToVietnamTime(ev.endTime),
          location: ev.location,
          address: '',
          coordinates: ev.latitude && ev.longitude ? { lat: Number(ev.latitude), lng: Number(ev.longitude) } : undefined,
          maxParticipants: ev.maxParticipants || 0,
          registeredCount: ev.registeredCount || 0,
          staffCount: getStaffCount(ev),
          status: ev.status,
          isActive: ev.isActive === true,
          category: ev.category || 'workshop',
          organizer: 'GreenLoop',
          image: normalizedImage,
          tags: [],
          price: ev.price || 0,
        }
      })
      // Cập nhật state
      setEventData(mapped)
      // Filter với data mới ngay lập tức (không phụ thuộc vào state update)
      let filtered = mapped
      if (searchText) {
        filtered = filtered.filter(event =>
          event.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchText.toLowerCase())
        )
      }
      if (filterStatus !== 'all') {
        filtered = filtered.filter(event => event.status === filterStatus)
      }
      setFilteredData(filtered)
      // Trigger refresh để đảm bảo component re-render
      setRefreshTrigger(prev => prev + 1)
      console.log('EventManagement: Event list updated successfully with', mapped.length, 'events')
      console.log('EventManagement: Filtered data count:', filtered.length)
    } catch (error) {
      console.error('EventManagement: Error reloading events:', error)
      const errorMsg = error?.message || 'Không thể tải lại danh sách sự kiện'
      setError(errorMsg)
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (event) => {
    setSelectedEvent(event)
    setDetailModalVisible(true)
  }

  const handleEdit = (event) => {
    setSelectedEvent(event)
    setEditModalVisible(true)
  }

  const handleOpenAssign = async (event) => {
    // Kiểm tra nếu event đã có staff thì mở EventStaffEditor, nếu chưa thì mở EventAssignStaff
    const staffCount = event.totalStaffs || event.staffCount || 0
    if (staffCount > 0) {
      // Event đã có staff, mở EventStaffEditor
      try {
        setSelectedEventForEditor(event)
        // Load danh sách staff đã được phân công
        const res = await getEventStaffs(event.id)
        const staffList = res?.data?.data || res?.data || (Array.isArray(res) ? res : [])
        const mappedStaffs = (Array.isArray(staffList) ? staffList : []).map((staff) => ({
          id: Number(staff.staffId || staff.id || staff.employeeId),
          fullName: staff.fullName || staff.name || staff.email || '',
          email: staff.email || '',
          storeManager: staff.storeManager === true || staff.StoreManager === true || staff.isStoreManager === true
        }))
        // Loại trùng theo id
        const uniqStaffs = Array.from(new Map(mappedStaffs.map(it => [it.id, it])).values())
        setAssignedStaffs(uniqStaffs)
        setEditorModalVisible(true)
      } catch (error) {
        console.error('Error loading assigned staffs:', error)
        message.error('Không thể tải danh sách nhân viên đã phân công')
      }
    } else {
      // Event chưa có staff, mở EventAssignStaff
    setSelectedEventForAssign(event)
    setAssignModalVisible(true)
    }
  }

  const updateStaffCountInLists = (eventId, count) => (list) =>
    list.map((event) => {
      if (event.id === eventId) {
        return { 
          ...event, 
          staffCount: count,
          totalStaffs: count // Cập nhật cả totalStaffs vì đây là field được hiển thị trong bảng
        }
      }
      return event
    })

  const handleStaffSummaryChange = (eventId, count) => {
    if (!eventId || typeof count !== 'number' || Number.isNaN(count)) return
    setEventData((prev) => updateStaffCountInLists(eventId, count)(prev))
    setFilteredData((prev) => updateStaffCountInLists(eventId, count)(prev))
  }

  const handleStaffAssignmentsUpdated = (eventId, count) => {
    if (!eventId || count === undefined || count === null) {
      handleAddEvent()
      return
    }
    handleStaffSummaryChange(eventId, count)
  }

  const handleUpdateEvent = async () => {
    // Đóng modal ngay để phản hồi nhanh
    setEditModalVisible(false)
    setSelectedEvent(null)

    // Tải lại danh sách giống như luồng thêm mới
    try {
      setLoading(true)
      setError('')
      const res = await getEvents({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'DESC' })
      const list = res?.data?.content || []
      const mapped = list.map(ev => {
        const rawImage = ev.imageUrl || ev.thumbnail || ev.thumbnailUrl || ev.image || ev.photo || ''
        const isAbsolute = typeof rawImage === 'string' && /^(http|https):\/\//i.test(rawImage)
        const apiRoot = (API_CONFIG?.BASE_URL || '').replace(/\/api\/v1$/i, '')
        const normalizedImage = (() => {
          if (!rawImage) return ''
          if (isAbsolute) return rawImage
          if (rawImage.startsWith('/api')) return rawImage
          if (apiRoot) return `${apiRoot}${rawImage}`
          return `${API_CONFIG?.BASE_URL || ''}${rawImage}`
        })()
        const convertToVietnamTime = (utcTimeString) => {
          try {
            const date = new Date(utcTimeString)
            const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
            return dayjs(vietnamTime).format('HH:mm')
          } catch {
            try { return dayjs(utcTimeString).format('HH:mm') } catch { return '--:--' }
          }
        }
        const convertToVietnamDate = (utcTimeString) => {
          try {
            const date = new Date(utcTimeString)
            const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
            return dayjs(vietnamTime).format('YYYY-MM-DD')
          } catch {
            return utcTimeString?.substring(0, 10) || ''
          }
        }
        return {
          id: ev.id,
          title: ev.name,
          description: ev.description || '',
          date: convertToVietnamDate(ev.startTime),
          startTime: convertToVietnamTime(ev.startTime),
          endTime: convertToVietnamTime(ev.endTime),
          location: ev.location,
          address: '',
          coordinates: ev.latitude && ev.longitude ? { lat: Number(ev.latitude), lng: Number(ev.longitude) } : undefined,
          maxParticipants: ev.maxParticipants || 0,
          registeredCount: ev.registeredCount || 0,
          status: ev.status,
          isActive: ev.isActive === true,
          category: ev.category || 'workshop',
          organizer: 'GreenLoop',
          image: normalizedImage,
          tags: [],
          price: ev.price || 0,
          staffCount: getStaffCount(ev),
        }
      })
      setEventData(mapped)
      // Áp lại bộ lọc hiện tại
      let filtered = mapped
      if (searchText) {
        filtered = filtered.filter(event =>
          event.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchText.toLowerCase())
        )
      }
      if (filterStatus !== 'all') {
        filtered = filtered.filter(event => event.status === filterStatus)
      }
      setFilteredData(filtered)
      setRefreshTrigger(prev => prev + 1)
    } catch (e) {
      setError(e?.message || 'Không thể tải lại danh sách sự kiện')
      message.error('Không thể tải lại danh sách sự kiện')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    const newData = eventData.filter(event => event.id !== id)
    setEventData(newData)
    filterData(searchText, filterStatus)
    message.success('Xóa sự kiện thành công!')
  }

  const handleCloseDetail = () => {
    setDetailModalVisible(false)
    setSelectedEvent(null)
  }

  const handleCloseAdd = () => {
    setAddModalVisible(false)
  }

  const handleCloseEdit = () => {
    setEditModalVisible(false)
    setSelectedEvent(null)
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sự kiện"
              value={totalEvents}
              prefix={<CalendarOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sắp diễn ra"
              value={upcomingEvents}
              prefix={<ClockCircleOutlined className="text-orange-600" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang diễn ra"
              value={activeEvents}
              prefix={<CalendarOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người tham gia"
              value={totalParticipants}
              prefix={<TeamOutlined className="text-purple-600" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Danh sách sự kiện
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              disabled={isStaffOnly()}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Tạo sự kiện
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo tên, mô tả, địa điểm, ban tổ chức..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1"
          />
          <Select
            placeholder="Lọc theo trạng thái"
            size="large"
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả trạng thái</Option>
            {EVENT_STATUS_OPTIONS.map((status) => (
              <Option key={status.value} value={status.value}>
                {status.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Table */}
        <EventTable
          key={refreshTrigger}
          filteredData={filteredData}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleAssign={handleOpenAssign}
          statusConfig={EVENT_STATUS_CONFIG}
          onActivated={handleAddEvent}
          isStaffOnly={isStaffOnly()}
        />
        {loading && <div className="text-center py-3 text-gray-500">Đang tải dữ liệu...</div>}
        {error && <div className="text-center py-2 text-red-600">{error}</div>}
      </Card>

      {/* Event Detail Modal */}
      <EventDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        event={selectedEvent}
        onStaffCountChange={handleStaffSummaryChange}
      />

      {/* Event Add Modal */}
      <EventAdd
        visible={addModalVisible}
        onClose={handleCloseAdd}
        onAdd={handleAddEvent}
      />

      {/* Event Edit Modal */}
      <EventEdit
        visible={editModalVisible}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateEvent}
        event={selectedEvent}
      />

      {/* Assign Staff Modal - Mở khi event chưa có staff */}
      <EventAssignStaff
        visible={assignModalVisible}
        onClose={() => { setAssignModalVisible(false); setSelectedEventForAssign(null) }}
        eventId={selectedEventForAssign?.id}
        onAssigned={handleStaffAssignmentsUpdated}
      />

      {/* Edit Staff Modal - Mở khi event đã có staff */}
      <EventStaffEditor
        visible={editorModalVisible}
        onClose={() => { 
          setEditorModalVisible(false)
          setSelectedEventForEditor(null)
          setAssignedStaffs([])
        }}
        eventId={selectedEventForEditor?.id}
        assigned={assignedStaffs}
        onSaved={async (updatedList) => {
          const eventId = selectedEventForEditor?.id
          if (!eventId) return
          
          // Tính số lượng nhân viên từ danh sách đã cập nhật
          let newCount = 0
          if (Array.isArray(updatedList) && updatedList.length > 0) {
            newCount = updatedList.length
          } else {
            // Nếu không có danh sách, lấy từ event hiện tại hoặc fetch lại từ API
            newCount = selectedEventForEditor?.totalStaffs || selectedEventForEditor?.staffCount || 0
          }
          
          console.log('EventManagement - onSaved called:', { eventId, newCount, updatedListLength: updatedList?.length })
          
          // Cập nhật số lượng nhân viên trong danh sách
          handleStaffAssignmentsUpdated(eventId, newCount)
          
          // Đóng modal và reset state
          setEditorModalVisible(false)
          setSelectedEventForEditor(null)
          setAssignedStaffs([])
        }}
      />
    </div>
  )
}

export default EventManagement