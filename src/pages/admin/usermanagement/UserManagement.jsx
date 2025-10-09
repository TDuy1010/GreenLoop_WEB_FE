import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Avatar, 
  Modal, 
  Form, 
  DatePicker, 
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
  Switch,
  Tooltip,
  Badge
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'

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
      status: 'suspended',
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAccountType, setFilterAccountType] = useState('all')
  const [filterVerified, setFilterVerified] = useState('all')

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
    active: { color: 'green', text: 'Hoạt động' },
    inactive: { color: 'default', text: 'Không hoạt động' },
    suspended: { color: 'red', text: 'Bị khóa' },
    pending: { color: 'orange', text: 'Chờ xác thực' }
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
    setEditingUser(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (user) => {
    message.info(`Xem chi tiết khách hàng: ${user.name}`)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    form.setFieldsValue({
      ...user,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null
    })
    setIsModalVisible(true)
  }

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    const newData = userData.map(u =>
      u.id === user.id ? { ...u, status: newStatus } : u
    )
    setUserData(newData)
    filterData(searchText, filterStatus, filterAccountType, filterVerified)
    message.success(`${newStatus === 'active' ? 'Mở khóa' : 'Khóa'} tài khoản thành công!`)
  }

  const handleDelete = (id) => {
    const newData = userData.filter(user => user.id !== id)
    setUserData(newData)
    filterData(searchText, filterStatus, filterAccountType, filterVerified)
    message.success('Xóa khách hàng thành công!')
  }

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        id: editingUser ? editingUser.id : Date.now(),
        joinDate: editingUser ? editingUser.joinDate : new Date().toISOString().split('T')[0],
        totalOrders: editingUser ? editingUser.totalOrders : 0,
        totalSpent: editingUser ? editingUser.totalSpent : 0,
        ecoPoints: editingUser ? editingUser.ecoPoints : 0,
        lastLogin: editingUser ? editingUser.lastLogin : new Date().toISOString().split('T')[0],
        donationCount: editingUser ? editingUser.donationCount : 0,
        eventParticipation: editingUser ? editingUser.eventParticipation : 0
      }

      if (editingUser) {
        // Update existing user
        const newData = userData.map(user =>
          user.id === editingUser.id ? { ...user, ...formattedValues } : user
        )
        setUserData(newData)
        message.success('Cập nhật khách hàng thành công!')
      } else {
        // Add new user
        setUserData([...userData, formattedValues])
        message.success('Thêm khách hàng thành công!')
      }

      setIsModalVisible(false)
      form.resetFields()
      filterData(searchText, filterStatus, filterAccountType, filterVerified)
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
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
            <Option value="suspended">Bị khóa</Option>
            <Option value="pending">Chờ xác thực</Option>
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
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} khách hàng`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingUser ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
              >
                <DatePicker 
                  placeholder="Chọn ngày sinh" 
                  className="w-full"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="accountType"
                label="Loại tài khoản"
                rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản!' }]}
              >
                <Select placeholder="Chọn loại tài khoản">
                  <Option value="standard">Tiêu chuẩn</Option>
                  <Option value="premium">Premium</Option>
                  <Option value="vip">VIP</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="suspended">Bị khóa</Option>
                  <Option value="pending">Chờ xác thực</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isVerified"
                label="Xác thực tài khoản"
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Đã xác thực" 
                  unCheckedChildren="Chưa xác thực"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input placeholder="Nhập địa chỉ đầy đủ" />
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
                {editingUser ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  )
}

export default UserManagement