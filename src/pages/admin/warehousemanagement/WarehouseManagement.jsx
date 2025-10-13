import React, { useState } from 'react'
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
  HomeOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import WarehouseTable from './components/WarehouseTable'

const { Search } = Input
const { Option } = Select

const WarehouseManagement = () => {
  const [warehouseData, setWarehouseData] = useState([
    {
      id: 1,
      name: 'Kho TP.HCM',
      address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
      manager: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'kho.hcm@greenloop.com',
      capacity: 1000,
      currentStock: 756,
      status: 'active',
      type: 'main',
      establishedDate: '2023-01-15',
      totalProducts: 156,
      categories: ['Thời trang', 'Phụ kiện', 'Giày dép'],
      lastUpdated: '2024-01-10',
      operatingHours: '8:00 - 18:00',
      facilities: ['Điều hòa', 'Camera an ninh', 'Hệ thống báo cháy']
    },
    {
      id: 2,
      name: 'Kho Hà Nội',
      address: '456 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
      manager: 'Trần Thị Bình',
      phone: '0901234568',
      email: 'kho.hn@greenloop.com',
      capacity: 800,
      currentStock: 623,
      status: 'active',
      type: 'main',
      establishedDate: '2023-03-20',
      totalProducts: 134,
      categories: ['Thời trang', 'Sách & Văn phòng phẩm', 'Đồ gia dụng'],
      lastUpdated: '2024-01-09',
      operatingHours: '7:30 - 17:30',
      facilities: ['Điều hòa', 'Camera an ninh', 'Kho lạnh']
    },
    {
      id: 3,
      name: 'Kho Đà Nẵng',
      address: '789 Lê Duẩn, Hải Châu, Đà Nẵng',
      manager: 'Lê Văn Cường',
      phone: '0901234569',
      email: 'kho.dn@greenloop.com',
      capacity: 500,
      currentStock: 234,
      status: 'maintenance',
      type: 'branch',
      establishedDate: '2023-06-10',
      totalProducts: 67,
      categories: ['Thời trang', 'Phụ kiện'],
      lastUpdated: '2024-01-08',
      operatingHours: '8:00 - 17:00',
      facilities: ['Camera an ninh', 'Hệ thống báo cháy']
    },
    {
      id: 4,
      name: 'Kho Cần Thơ',
      address: '321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ',
      manager: 'Phạm Thị Dung',
      phone: '0901234570',
      email: 'kho.ct@greenloop.com',
      capacity: 600,
      currentStock: 445,
      status: 'active',
      type: 'branch',
      establishedDate: '2023-08-15',
      totalProducts: 89,
      categories: ['Thời trang', 'Đồ gia dụng', 'Điện tử'],
      lastUpdated: '2024-01-11',
      operatingHours: '8:00 - 17:30',
      facilities: ['Điều hòa', 'Camera an ninh']
    },
    {
      id: 5,
      name: 'Kho Tạm Bình Dương',
      address: '654 Đại lộ Bình Dương, Thuận An, Bình Dương',
      manager: 'Hoàng Minh Tuấn',
      phone: '0901234571',
      email: 'kho.bd@greenloop.com',
      capacity: 300,
      currentStock: 89,
      status: 'inactive',
      type: 'temporary',
      establishedDate: '2023-11-01',
      totalProducts: 23,
      categories: ['Thời trang'],
      lastUpdated: '2023-12-20',
      operatingHours: '9:00 - 16:00',
      facilities: ['Camera an ninh']
    }
  ])

  const [filteredData, setFilteredData] = useState(warehouseData)
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Statistics
  const totalWarehouses = warehouseData.length
  const activeWarehouses = warehouseData.filter(warehouse => warehouse.status === 'active').length
  const totalCapacity = warehouseData.reduce((sum, warehouse) => sum + warehouse.capacity, 0)
  const totalCurrentStock = warehouseData.reduce((sum, warehouse) => sum + warehouse.currentStock, 0)
  const occupancyRate = Math.round((totalCurrentStock / totalCapacity) * 100)

  // Status mapping
  const statusConfig = {
    active: { color: 'green', text: 'Hoạt động' },
    inactive: { color: 'default', text: 'Không hoạt động' },
    maintenance: { color: 'orange', text: 'Bảo trì' },
    full: { color: 'red', text: 'Đầy' }
  }

  // Type mapping
  const typeConfig = {
    main: { color: 'blue', text: 'Kho chính' },
    branch: { color: 'purple', text: 'Kho chi nhánh' },
    temporary: { color: 'orange', text: 'Kho tạm' }
  }

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, filterStatus, filterType)
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    filterData(searchText, value, filterType)
  }

  const handleTypeFilter = (value) => {
    setFilterType(value)
    filterData(searchText, filterStatus, value)
  }

  const filterData = (search, status, type) => {
    let filtered = warehouseData

    if (search) {
      filtered = filtered.filter(warehouse =>
        warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
        warehouse.address.toLowerCase().includes(search.toLowerCase()) ||
        warehouse.manager.toLowerCase().includes(search.toLowerCase()) ||
        warehouse.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.status === status)
    }

    if (type !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.type === type)
    }

    setFilteredData(filtered)
  }

  // Handle CRUD operations
  const handleAdd = () => {
    message.info("Tính năng đang phát triển")
  }

  const handleView = (warehouse) => {
    message.info(`Xem chi tiết kho: ${warehouse.name}`)
  }

  const handleEdit = (warehouse) => {
    message.info(`Chỉnh sửa kho: ${warehouse.name}`)
  }

  const handleToggleStatus = (warehouse) => {
    const newStatus = warehouse.status === 'active' ? 'inactive' : 'active'
    const newData = warehouseData.map(w =>
      w.id === warehouse.id ? { ...w, status: newStatus } : w
    )
    setWarehouseData(newData)
    filterData(searchText, filterStatus, filterType)
    message.success(`${newStatus === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'} kho thành công!`)
  }

  const handleDelete = (id) => {
    const newData = warehouseData.filter(warehouse => warehouse.id !== id)
    setWarehouseData(newData)
    filterData(searchText, filterStatus, filterType)
    message.success('Xóa kho thành công!')
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
              title="Tổng số kho"
              value={totalWarehouses}
              prefix={<HomeOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Kho hoạt động"
              value={activeWarehouses}
              prefix={<CheckCircleOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng sức chứa"
              value={totalCapacity}
              prefix={<InboxOutlined className="text-purple-600" />}
              valueStyle={{ color: '#722ed1' }}
              suffix="sản phẩm"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tỷ lệ lấp đầy"
              value={occupancyRate}
              prefix={<ExclamationCircleOutlined className="text-orange-600" />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Danh sách kho
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Thêm kho mới
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col lg:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo tên kho, địa chỉ, quản lý, email..."
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
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
            <Option value="maintenance">Bảo trì</Option>
            <Option value="full">Đầy</Option>
          </Select>
          <Select
            placeholder="Lọc theo loại kho"
            size="large"
            value={filterType}
            onChange={handleTypeFilter}
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả loại</Option>
            <Option value="main">Kho chính</Option>
            <Option value="branch">Kho chi nhánh</Option>
            <Option value="temporary">Kho tạm</Option>
          </Select>
        </div>

        {/* Table */}
        <WarehouseTable
          filteredData={filteredData}
          handleView={handleView}
          handleEdit={handleEdit}
          handleToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
          statusConfig={statusConfig}
          typeConfig={typeConfig}
        />
      </Card>
    </motion.div>
  )
}

export default WarehouseManagement
