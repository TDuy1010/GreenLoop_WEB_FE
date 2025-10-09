import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Form, 
  DatePicker, 
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Image,
  TimePicker,
  InputNumber,
  Upload
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  EyeOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker

const EventManagement = () => {
  const [eventData, setEventData] = useState([
    {
      id: 1,
      title: 'Hội thảo Tái chế Thông minh',
      description: 'Tìm hiểu về các công nghệ tái chế hiện đại và cách áp dụng vào cuộc sống hàng ngày',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
      address: '1 Thăng Long, Ba Đình, Hà Nội',
      coordinates: { lat: 21.0285, lng: 105.8542 },
      maxParticipants: 200,
      registeredCount: 156,
      status: 'upcoming',
      category: 'workshop',
      organizer: 'GreenLoop Team',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      tags: ['Tái chế', 'Công nghệ', 'Môi trường'],
      price: 0,
      requirements: 'Mang theo laptop cá nhân',
      benefits: 'Chứng chỉ tham dự, tài liệu học tập'
    },
    {
      id: 2,
      title: 'Ngày hội Thu gom Rác thải Điện tử',
      description: 'Sự kiện thu gom và tái chế các thiết bị điện tử cũ từ cộng đồng',
      date: '2024-01-20',
      startTime: '08:00',
      endTime: '16:00',
      location: 'Công viên Thống Nhất, TP.HCM',
      address: 'Công viên Thống Nhất, Quận 1, TP.HCM',
      coordinates: { lat: 10.7769, lng: 106.6951 },
      maxParticipants: 500,
      registeredCount: 423,
      status: 'active',
      category: 'collection',
      organizer: 'GreenLoop & Sở TN&MT TP.HCM',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      tags: ['Thu gom', 'Điện tử', 'Cộng đồng'],
      price: 0,
      requirements: 'Mang theo rác thải điện tử',
      benefits: 'Quà tặng, voucher giảm giá'
    },
    {
      id: 3,
      title: 'Workshop Làm đồ handmade từ Vật liệu tái chế',
      description: 'Học cách tạo ra những món đồ hữu ích từ các vật liệu tái chế',
      date: '2024-01-25',
      startTime: '14:00',
      endTime: '18:00',
      location: 'Trung tâm Văn hóa Đông Đa, Hà Nội',
      address: '2 Hồ Tùng Mậu, Đống Đa, Hà Nội',
      coordinates: { lat: 21.0227, lng: 105.8194 },
      maxParticipants: 50,
      registeredCount: 45,
      status: 'full',
      category: 'workshop',
      organizer: 'GreenLoop Creative Team',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
      tags: ['Handmade', 'Sáng tạo', 'DIY'],
      price: 150000,
      requirements: 'Không yêu cầu kinh nghiệm',
      benefits: 'Sản phẩm handmade, tài liệu hướng dẫn'
    },
    {
      id: 4,
      title: 'Hội thảo Kinh tế Tuần hoàn',
      description: 'Thảo luận về mô hình kinh tế tuần hoàn và ứng dụng trong doanh nghiệp',
      date: '2024-02-01',
      startTime: '09:30',
      endTime: '16:30',
      location: 'Khách sạn Lotte, Hà Nội',
      address: '54 Liễu Giai, Ba Đình, Hà Nội',
      coordinates: { lat: 21.0245, lng: 105.8412 },
      maxParticipants: 150,
      registeredCount: 89,
      status: 'upcoming',
      category: 'seminar',
      organizer: 'GreenLoop & Hiệp hội Doanh nghiệp',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
      tags: ['Kinh tế', 'Doanh nghiệp', 'Bền vững'],
      price: 500000,
      requirements: 'Dành cho doanh nghiệp và startup',
      benefits: 'Networking, chứng chỉ, tài liệu'
    },
    {
      id: 5,
      title: 'Ngày hội Thời trang Bền vững',
      description: 'Triển lãm và workshop về thời trang từ vật liệu tái chế',
      date: '2024-01-10',
      startTime: '10:00',
      endTime: '20:00',
      location: 'Trung tâm Thương mại Vincom, TP.HCM',
      address: 'Vincom Center, Quận 1, TP.HCM',
      coordinates: { lat: 10.7796, lng: 106.6999 },
      maxParticipants: 1000,
      registeredCount: 1000,
      status: 'completed',
      category: 'exhibition',
      organizer: 'GreenLoop Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      tags: ['Thời trang', 'Bền vững', 'Triển lãm'],
      price: 0,
      requirements: 'Mở cửa cho mọi người',
      benefits: 'Trải nghiệm, mua sắm, giải trí'
    }
  ])

  const [filteredData, setFilteredData] = useState(eventData)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Statistics
  const totalEvents = eventData.length
  const upcomingEvents = eventData.filter(event => event.status === 'upcoming').length
  const activeEvents = eventData.filter(event => event.status === 'active').length
  const completedEvents = eventData.filter(event => event.status === 'completed').length
  const totalParticipants = eventData.reduce((sum, event) => sum + event.registeredCount, 0)

  // Status mapping
  const statusConfig = {
    upcoming: { color: 'blue', text: 'Sắp diễn ra' },
    active: { color: 'green', text: 'Đang diễn ra' },
    completed: { color: 'default', text: 'Đã kết thúc' },
    cancelled: { color: 'red', text: 'Đã hủy' },
    full: { color: 'orange', text: 'Đã đầy' }
  }

  // Category mapping
  const categoryConfig = {
    workshop: { color: 'purple', text: 'Workshop' },
    seminar: { color: 'blue', text: 'Hội thảo' },
    collection: { color: 'green', text: 'Thu gom' },
    exhibition: { color: 'orange', text: 'Triển lãm' },
    conference: { color: 'red', text: 'Hội nghị' }
  }

  // Table columns
  const columns = [
    {
      title: 'Sự kiện',
      key: 'event',
      width: 300,
      render: (_, record) => (
        <div className="flex gap-3">
          <Image
            width={60}
            height={60}
            src={record.image}
            alt={record.title}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.title}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{record.description}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {record.tags.slice(0, 2).map(tag => (
                <Tag key={tag} size="small" color="blue">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian & Địa điểm',
      key: 'datetime',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <CalendarOutlined className="text-gray-400" />
            <span>{dayjs(record.date).format('DD/MM/YYYY')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ClockCircleOutlined className="text-gray-400" />
            <span>{record.startTime} - {record.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EnvironmentOutlined className="text-gray-400" />
            <span className="truncate">{record.location}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const config = categoryConfig[category] || { color: 'default', text: category }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status] || { color: 'default', text: status }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            className="text-green-600 hover:text-green-700"
            size="small"
          >
            Xem
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sự kiện"
            description="Bạn có chắc chắn muốn xóa sự kiện này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, filterCategory, filterStatus)
  }

  const handleCategoryFilter = (value) => {
    setFilterCategory(value)
    filterData(searchText, value, filterStatus)
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    filterData(searchText, filterCategory, value)
  }

  const filterData = (search, category, status) => {
    let filtered = eventData

    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category)
    }

    if (status !== 'all') {
      filtered = filtered.filter(event => event.status === status)
    }

    setFilteredData(filtered)
  }

  // Handle CRUD operations
  const handleAdd = () => {
    setEditingEvent(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (event) => {
    // Navigate to event detail page or show detail modal
    message.info(`Xem chi tiết sự kiện: ${event.title}`)
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    form.setFieldsValue({
      ...event,
      date: event.date ? dayjs(event.date) : null,
      timeRange: [
        event.startTime ? dayjs(event.startTime, 'HH:mm') : null,
        event.endTime ? dayjs(event.endTime, 'HH:mm') : null
      ],
      tags: event.tags
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    const newData = eventData.filter(event => event.id !== id)
    setEventData(newData)
    filterData(searchText, filterCategory, filterStatus)
    message.success('Xóa sự kiện thành công!')
  }

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : null,
        startTime: values.timeRange ? values.timeRange[0].format('HH:mm') : null,
        endTime: values.timeRange ? values.timeRange[1].format('HH:mm') : null,
        id: editingEvent ? editingEvent.id : Date.now(),
        registeredCount: editingEvent ? editingEvent.registeredCount : 0,
        image: editingEvent ? editingEvent.image : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        coordinates: editingEvent ? editingEvent.coordinates : { lat: 21.0285, lng: 105.8542 }
      }

      // Remove timeRange from final object
      delete formattedValues.timeRange

      if (editingEvent) {
        // Update existing event
        const newData = eventData.map(event =>
          event.id === editingEvent.id ? { ...event, ...formattedValues } : event
        )
        setEventData(newData)
        message.success('Cập nhật sự kiện thành công!')
      } else {
        // Add new event
        setEventData([...eventData, formattedValues])
        message.success('Thêm sự kiện thành công!')
      }

      setIsModalVisible(false)
      form.resetFields()
      filterData(searchText, filterCategory, filterStatus)
    } catch (error) {
      message.error('Có lỗi xảy ra!')
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
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
            placeholder="Lọc theo loại sự kiện"
            size="large"
            value={filterCategory}
            onChange={handleCategoryFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả loại</Option>
            <Option value="workshop">Workshop</Option>
            <Option value="seminar">Hội thảo</Option>
            <Option value="collection">Thu gom</Option>
            <Option value="exhibition">Triển lãm</Option>
            <Option value="conference">Hội nghị</Option>
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            size="large"
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="upcoming">Sắp diễn ra</Option>
            <Option value="active">Đang diễn ra</Option>
            <Option value="completed">Đã kết thúc</Option>
            <Option value="cancelled">Đã hủy</Option>
            <Option value="full">Đã đầy</Option>
          </Select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sự kiện`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingEvent ? 'Sửa thông tin sự kiện' : 'Tạo sự kiện mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Tên sự kiện"
                rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
              >
                <Input placeholder="Nhập tên sự kiện" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả sự kiện"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="Nhập mô tả chi tiết về sự kiện" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày tổ chức"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker 
                  placeholder="Chọn ngày tổ chức" 
                  className="w-full"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="timeRange"
                label="Thời gian"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
              >
                <TimePicker.RangePicker 
                  placeholder={['Giờ bắt đầu', 'Giờ kết thúc']}
                  className="w-full"
                  format="HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Địa điểm"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <Input placeholder="Nhập địa điểm tổ chức" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ chi tiết"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input placeholder="Nhập địa chỉ chi tiết" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Loại sự kiện"
                rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}
              >
                <Select placeholder="Chọn loại sự kiện">
                  <Option value="workshop">Workshop</Option>
                  <Option value="seminar">Hội thảo</Option>
                  <Option value="collection">Thu gom</Option>
                  <Option value="exhibition">Triển lãm</Option>
                  <Option value="conference">Hội nghị</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="upcoming">Sắp diễn ra</Option>
                  <Option value="active">Đang diễn ra</Option>
                  <Option value="completed">Đã kết thúc</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="full">Đã đầy</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxParticipants"
                label="Số người tối đa"
                rules={[{ required: true, message: 'Vui lòng nhập số người!' }]}
              >
                <InputNumber 
                  placeholder="Số người tối đa" 
                  className="w-full"
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="organizer"
                label="Ban tổ chức"
                rules={[{ required: true, message: 'Vui lòng nhập ban tổ chức!' }]}
              >
                <Input placeholder="Nhập tên ban tổ chức" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Phí tham gia (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập phí tham gia!' }]}
              >
                <InputNumber 
                  placeholder="Nhập phí tham gia (0 = miễn phí)" 
                  className="w-full"
                  min={0}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="requirements"
                label="Yêu cầu tham gia"
              >
                <TextArea 
                  rows={2} 
                  placeholder="Nhập yêu cầu tham gia (nếu có)" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="benefits"
                label="Quyền lợi"
              >
                <TextArea 
                  rows={2} 
                  placeholder="Nhập quyền lợi khi tham gia" 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="tags"
                label="Tags"
              >
                <Select
                  mode="tags"
                  placeholder="Nhập các tag cho sự kiện"
                  className="w-full"
                >
                  <Option value="Tái chế">Tái chế</Option>
                  <Option value="Môi trường">Môi trường</Option>
                  <Option value="Bền vững">Bền vững</Option>
                  <Option value="Công nghệ">Công nghệ</Option>
                  <Option value="Cộng đồng">Cộng đồng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                {editingEvent ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  )
}

export default EventManagement