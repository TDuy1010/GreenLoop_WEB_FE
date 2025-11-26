import React, { useState, useEffect, useCallback } from 'react'
import { 
  Button, 
  Input, 
  Select, 
  message,
  Card,
  Row,
  Col,
  Statistic,
  Spin
} from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import UserTable from './components/UserTable'
import UserDetail from './components/UserDetail'
import { getCustomerList, updateCustomerStatus } from '../../../service/api/customerApi'

const { Search } = Input
const { Option } = Select

const UserManagement = () => {
  const [userData, setUserData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAccountType, setFilterAccountType] = useState('all')
  const [filterVerified, setFilterVerified] = useState('all')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.current - 1, // API sử dụng page bắt đầu từ 0
        size: pagination.pageSize,
        search: searchText,
        status: filterStatus === 'all' ? null : filterStatus === 'active',
        sortBy: 'createdAt',
        sortDir: 'DESC'
      }

      const response = await getCustomerList(params)
      
      if (response.success && response.data) {
        // Map API data to component format
        const mappedData = response.data.content.map((customer) => {
          const normalizedGender =
            typeof customer.gender === 'string'
              ? customer.gender.trim().toLowerCase()
              : 'other'
          const genderValue = ['male', 'female', 'other'].includes(normalizedGender)
            ? normalizedGender
            : 'other'

          return {
            id: customer.id,
            name: customer.fullName,
            email: customer.email,
            phone: customer.phoneNumber || 'Chưa có',
            gender: genderValue,
            dateOfBirth: customer.dateOfBirth,
            address: 'Chưa cập nhật', // API chưa trả về địa chỉ
            joinDate: customer.createdAt,
            status: customer.isActive ? 'active' : 'inactive',
            isVerified: customer.isEmailVerified,
            avatar: customer.avatarUrl,
            totalOrders: 0, // Cần API khác để lấy thông tin này
            totalSpent: 0,
            ecoPoints: 0,
            lastLogin: customer.updatedAt,
            accountType: 'standard', // Cần thêm field này từ API
            donationCount: 0,
            eventParticipation: 0
          }
        })

        setUserData(mappedData)
        setFilteredData(mappedData)
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements
        }))
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      message.error('Không thể tải danh sách khách hàng!')
    } finally {
      setLoading(false)
    }
  }, [pagination.current, pagination.pageSize, searchText, filterStatus])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

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

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value)
    setPagination({ ...pagination, current: 1 }) // Reset về trang 1 khi search
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    setPagination({ ...pagination, current: 1 }) // Reset về trang 1 khi filter
  }

  const handleAccountTypeFilter = (value) => {
    setFilterAccountType(value)
    // Filter local data theo account type (vì API chưa hỗ trợ)
    if (value === 'all') {
      setFilteredData(userData)
    } else {
      const filtered = userData.filter(user => user.accountType === value)
      setFilteredData(filtered)
    }
  }

  const handleVerifiedFilter = (value) => {
    setFilterVerified(value)
    // Filter local data theo verified status (vì API chưa hỗ trợ)
    if (value === 'all') {
      setFilteredData(userData)
    } else {
      const isVerified = value === 'verified'
      const filtered = userData.filter(user => user.isVerified === isVerified)
      setFilteredData(filtered)
    }
  }

  const handleTableChange = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
      total: pagination.total
    })
  }

  // Handle CRUD operations
  const handleView = (user) => {
    setSelectedUser(user)
    setDetailModalVisible(true)
  }

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'active' ? false : true
      await updateCustomerStatus(user.id, newStatus)
      
      // Cập nhật lại danh sách
      await fetchCustomers()
      message.success(`Cập nhật trạng thái thành công!`)
    } catch (error) {
      console.error('Error updating customer status:', error)
      message.error('Không thể cập nhật trạng thái khách hàng!')
    }
  }

  const handleCloseDetail = () => {
    setDetailModalVisible(false)
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
          <h2 className="text-xl font-semibold text-gray-900 m-0">
            Danh sách khách hàng
          </h2>
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
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <UserTable
            filteredData={filteredData}
            handleView={handleView}
            handleToggleStatus={handleToggleStatus}
            accountTypeConfig={accountTypeConfig}
            genderConfig={genderConfig}
            pagination={pagination}
            handleTableChange={handleTableChange}
          />
        </Spin>
      </Card>

      {/* User Detail Modal */}
      <UserDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        user={selectedUser}
      />

    </motion.div>
  )
}

export default UserManagement