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
 

import EventTable from './components/EventTable'
import EventDetail from './components/EventDetail'
import EventAdd from './components/EventAdd'
import EventEdit from './components/EventEdit'
import { getEvents } from '../../../service/api/eventApi'
import heroImg from '../../../assets/images/herosection.jpg'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input


const EventManagement = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [eventData, setEventData] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Load danh sách sự kiện từ API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await getEvents({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'DESC' })
        const list = res?.data?.content || []
        const mapped = list.map(ev => ({
          id: ev.id,
          title: ev.name,
          description: '',
          date: ev.startTime?.substring(0, 10) || '',
          startTime: new Date(ev.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(ev.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          location: ev.location,
          address: '',
          coordinates: ev.latitude && ev.longitude ? { lat: Number(ev.latitude), lng: Number(ev.longitude) } : undefined,
          maxParticipants: ev.maxParticipants || 0,
          registeredCount: ev.registeredCount || 0,
          status: ev.status, // CREATED | PUBLISHED | ...
          category: ev.category || 'workshop',
          organizer: 'GreenLoop',
          image: heroImg,
          tags: [],
          price: ev.price || 0,
        }))
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
  const upcomingEvents = eventData.filter(event => event.status === 'CREATED').length
  const activeEvents = eventData.filter(event => event.status === 'PUBLISHED').length
  // Có thể thêm thống kê 'Đã kết thúc' nếu cần hiển thị
  // const completedEvents = eventData.filter(event => event.status === 'COMPLETED').length
  const totalParticipants = eventData.reduce((sum, event) => sum + (event.registeredCount || 0), 0)

  // Status mapping
  const statusConfig = {
    CREATED: { color: 'blue', text: 'Đã tạo' },
    PUBLISHED: { color: 'green', text: 'Công khai' },
    COMPLETED: { color: 'default', text: 'Đã kết thúc' },
    CANCELLED: { color: 'red', text: 'Đã hủy' }
  }

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

  const filterData = (search, status) => {
    let filtered = eventData

    if (search) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase()) ||
        event.location?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(event => event.status === status)
    }

    setFilteredData(filtered)
  }

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true)
  }

  const handleAddEvent = (newEvent) => {
    const updatedData = [...eventData, newEvent]
    setEventData(updatedData)
    filterData(searchText, filterStatus)
  }

  const handleView = (event) => {
    setSelectedEvent(event)
    setDetailModalVisible(true)
  }

  const handleEdit = (event) => {
    setSelectedEvent(event)
    setEditModalVisible(true)
  }

  const handleUpdateEvent = (updatedEvent) => {
    const updatedData = eventData.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    )
    setEventData(updatedData)
    filterData(searchText, filterStatus)
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
            <Option value="CREATED">Đã tạo</Option>
            <Option value="PUBLISHED">Công khai</Option>
            <Option value="COMPLETED">Đã kết thúc</Option>
            <Option value="CANCELLED">Đã hủy</Option>
          </Select>
        </div>

        {/* Table */}
        <EventTable
          filteredData={filteredData}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          statusConfig={statusConfig}
        />
        {loading && <div className="text-center py-3 text-gray-500">Đang tải dữ liệu...</div>}
        {error && <div className="text-center py-2 text-red-600">{error}</div>}
      </Card>

      {/* Event Detail Modal */}
      <EventDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        event={selectedEvent}
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
    </div>
  )
}

export default EventManagement