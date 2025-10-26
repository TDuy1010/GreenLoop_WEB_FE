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
  UserOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import UserTable from './components/UserTable'
import UserDetail from './components/UserDetail'
import UserAdd from './components/UserAdd'
import UserEdit from './components/UserEdit'

const { Search } = Input
const { Option } = Select

const UserManagement = () => {
  const [userData, setUserData] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@gmail.com',
      phone: '0901234567',
      gender: 'male',
      dateOfBirth: '1990-05-15',
      address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
      joinDate: '2023-01-15',
      status: 'active',
      isVerified: true,
      avatar: null,
      totalOrders: 15,
      totalSpent: 2500000,
      ecoPoints: 1250,
      lastLogin: '2024-01-10',
      accountType: 'premium',
      donationCount: 8,
      eventParticipation: 5
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'binh.tran@gmail.com',
      phone: '0901234568',
      gender: 'female',
      dateOfBirth: '1995-08-20',
      address: '456 Lê Lợi, Quận 3, TP.HCM',
      joinDate: '2023-03-20',
      status: 'active',
      isVerified: true,
      avatar: null,
      totalOrders: 8,
      totalSpent: 1200000,
      ecoPoints: 680,
      lastLogin: '2024-01-09',
      accountType: 'standard',
      donationCount: 3,
      eventParticipation: 2
    },
    {
      id: 3,
      name: 'Lê Văn Cường',
      email: 'cuong.le@gmail.com',
      phone: '0901234569',
      gender: 'male',
      dateOfBirth: '1988-12-10',
      address: '789 Võ Văn Tần, Quận 10, TP.HCM',
      joinDate: '2023-02-10',
      status: 'inactive',
      isVerified: false,
      avatar: null,
      totalOrders: 2,
      totalSpent: 350000,
      ecoPoints: 120,
      lastLogin: '2023-12-15',
      accountType: 'standard',
      donationCount: 1,
      eventParticipation: 0
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      email: 'dung.pham@gmail.com',
      phone: '0901234570',
      gender: 'female',
      dateOfBirth: '1992-07-25',
      address: '321 Hai Bà Trưng, Quận 1, TP.HCM',
      joinDate: '2022-12-05',
      status: 'active',
      isVerified: true,
      avatar: null,
      totalOrders: 25,
      totalSpent: 4200000,
      ecoPoints: 2100,
      lastLogin: '2024-01-11',
      accountType: 'vip',
      donationCount: 15,
      eventParticipation: 12
    },
    {
      id: 5,
      name: 'Hoàng Minh Tuấn',
      email: 'tuan.hoang@gmail.com',
      phone: '0901234571',
      gender: 'male',
      dateOfBirth: '1985-03-18',
      address: '654 Nguyễn Huệ, Quận 1, TP.HCM',
      joinDate: '2023-06-12',
      status: 'inactive',
      isVerified: true,
      avatar: null,
      totalOrders: 0,
      totalSpent: 0,
      ecoPoints: 50,
      lastLogin: '2023-08-20',
      accountType: 'standard',
      donationCount: 0,
      eventParticipation: 1
    }
  ])

  const [filteredData, setFilteredData] = useState(userData)
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAccountType, setFilterAccountType] = useState('all')
  const [filterVerified, setFilterVerified] = useState('all')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Statistics
  const totalUsers = userData.length
  const activeUsers = userData.filter(user => user.status === 'active').length
  const verifiedUsers = userData.filter(user => user.isVerified).length
  const totalRevenue = userData.reduce((sum, user) => sum + user.totalSpent, 0)

  // Status mapping
  const statusConfig = {
    active: { color: 'green', text: 'Active' },
    inactive: { color: 'red', text: 'Inactive' }
  }

  // Account type mapping
  const accountTypeConfig = {
    standard: { color: 'blue', text: 'Tiêu chuẩn' },
    premium: { color: 'purple', text: 'Premium' },
    vip: { color: 'gold', text: 'VIP' }
  }

  // Gender mapping
  const genderConfig = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác'
  }

  // Table columns
  const columns = [
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Badge 
            dot={record.status === 'active'} 
            status={record.status === 'active' ? 'success' : 'default'}
          >
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              src={record.avatar}
              className="bg-green-100 text-green-600"
            />
          </Badge>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{record.name}</span>
              {record.isVerified && (
                <Tooltip title="Đã xác thực">
                  <Tag color="green" size="small">✓</Tag>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-gray-500">{genderConfig[record.gender]}</div>
            <div className="text-xs text-gray-400">
              ID: {record.id} • Tham gia: {new Date(record.joinDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span className="truncate">{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EnvironmentOutlined className="text-gray-400" />
            <span className="truncate text-xs">{record.address}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (accountType) => {
        const config = accountTypeConfig[accountType] || { color: 'default', text: accountType }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Hoạt động',
      key: 'activity',
      render: (_, record) => (
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1 text-sm">
            <ShoppingCartOutlined className="text-blue-500" />
            <span className="font-medium">{record.totalOrders}</span>
            <span className="text-xs text-gray-500">đơn</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <HeartOutlined className="text-red-500" />
            <span className="font-medium">{record.donationCount}</span>
            <span className="text-xs text-gray-500">quyên góp</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-sm">
            <CalendarOutlined className="text-green-500" />
            <span className="font-medium">{record.eventParticipation}</span>
            <span className="text-xs text-gray-500">sự kiện</span>
          </div>
        </div>
      ),
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
      title: 'Lần cuối truy cập',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => (
        <div className="text-sm">
          {new Date(date).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              className="text-green-600 hover:text-green-700"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-700"
              size="small"
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
            <Button
              type="text"
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record)}
              className={record.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa khách hàng"
            description="Bạn có chắc chắn muốn xóa khách hàng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, filterStatus, filterAccountType, filterVerified)
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    filterData(searchText, value, filterAccountType, filterVerified)
  }

  const handleAccountTypeFilter = (value) => {
    setFilterAccountType(value)
    filterData(searchText, filterStatus, value, filterVerified)
  }

  const handleVerifiedFilter = (value) => {
    setFilterVerified(value)
    filterData(searchText, filterStatus, filterAccountType, value)
  }

  const filterData = (search, status, accountType, verified) => {
    let filtered = userData

    if (search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        user.address.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status !== 'all') {
      filtered = filtered.filter(user => user.status === status)
    }

    if (accountType !== 'all') {
      filtered = filtered.filter(user => user.accountType === accountType)
    }

    if (verified !== 'all') {
      const isVerified = verified === 'verified'
      filtered = filtered.filter(user => user.isVerified === isVerified)
    }

    setFilteredData(filtered)
  }

  // Handle CRUD operations
  const handleAdd = () => {
    setAddModalVisible(true)
  }

  const handleAddUser = (newUser) => {
    const updatedData = [...userData, newUser]
    setUserData(updatedData)
    setFilteredData(updatedData)
    message.success("Thêm khách hàng thành công!")
  }

  const handleView = (user) => {
    setSelectedUser(user)
    setDetailModalVisible(true)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditModalVisible(true)
  }

  const handleUpdateUser = (updatedUser) => {
    const updatedData = userData.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    )
    setUserData(updatedData)
    filterData(searchText, filterStatus, filterAccountType, filterVerified)
    message.success("Cập nhật khách hàng thành công!")
  }

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const newData = userData.map(u =>
      u.id === user.id ? { ...u, status: newStatus } : u
    )
    setUserData(newData)
    filterData(searchText, filterStatus, filterAccountType, filterVerified)
    message.success(`Cập nhật trạng thái thành công!`)
  }

  const handleDelete = (id) => {
    const newData = userData.filter(user => user.id !== id)
    setUserData(newData)
    filterData(searchText, filterStatus, filterAccountType, filterVerified)
    message.success('Xóa khách hàng thành công!')
  }

  const handleCloseDetail = () => {
    setDetailModalVisible(false)
    setSelectedUser(null)
  }

  const handleCloseAdd = () => {
    setAddModalVisible(false)
  }

  const handleCloseEdit = () => {
    setEditModalVisible(false)
    setSelectedUser(null)
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
              title="Tổng khách hàng"
              value={totalUsers}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeUsers}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã xác thực"
              value={verifiedUsers}
              prefix={<UserOutlined className="text-purple-600" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix="₫"
              valueStyle={{ color: '#f5222d' }}
              formatter={(value) => `${value.toLocaleString('vi-VN')}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Danh sách khách hàng
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Thêm khách hàng
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col lg:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo tên, email, số điện thoại, địa chỉ..."
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
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <Select
            placeholder="Lọc theo loại tài khoản"
            size="large"
            value={filterAccountType}
            onChange={handleAccountTypeFilter}
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả loại</Option>
            <Option value="standard">Tiêu chuẩn</Option>
            <Option value="premium">Premium</Option>
            <Option value="vip">VIP</Option>
          </Select>
          <Select
            placeholder="Lọc theo xác thực"
            size="large"
            value={filterVerified}
            onChange={handleVerifiedFilter}
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả</Option>
            <Option value="verified">Đã xác thực</Option>
            <Option value="unverified">Chưa xác thực</Option>
          </Select>
        </div>

        {/* Table */}
        <UserTable
          filteredData={filteredData}
          handleView={handleView}
          handleEdit={handleEdit}
          handleToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
          statusConfig={statusConfig}
          accountTypeConfig={accountTypeConfig}
          genderConfig={genderConfig}
        />
      </Card>

      {/* User Detail Modal */}
      <UserDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        user={selectedUser}
      />

      {/* User Add Modal */}
      <UserAdd
        visible={addModalVisible}
        onClose={handleCloseAdd}
        onAdd={handleAddUser}
      />

      {/* User Edit Modal */}
      <UserEdit
        visible={editModalVisible}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateUser}
        user={selectedUser}
      />

    </motion.div>
  )
}

export default UserManagement