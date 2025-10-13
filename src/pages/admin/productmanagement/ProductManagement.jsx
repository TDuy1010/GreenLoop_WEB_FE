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
  ShoppingOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import ProductTable from './components/ProductTable'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input

const ProductManagement = () => {
  const [productData, setProductData] = useState([
    {
      id: 1,
      name: 'Áo Khoác Denim Vintage',
      description: 'Áo khoác denim màu xanh vintage, phong cách retro, phù hợp cho cả nam và nữ',
      category: 'Thời trang',
      condition: 'Tốt',
      size: 'M',
      color: 'Xanh denim',
      material: 'Cotton',
      brand: 'Levi\'s',
      donorName: 'Nguyễn Văn An',
      donorEmail: 'an.nguyen@gmail.com',
      donorPhone: '0901234567',
      donationDate: '2024-01-10',
      status: 'available',
      isApproved: true,
      approvedBy: 'Admin',
      approvedDate: '2024-01-11',
      price: 150000,
      originalPrice: 800000,
      images: [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
      ],
      tags: ['Vintage', 'Denim', 'Unisex'],
      weight: 0.5,
      dimensions: '60x50x2 cm',
      ecoPoints: 75,
      views: 156,
      likes: 23,
      location: 'Kho TP.HCM'
    },
    {
      id: 2,
      name: 'Giày Sneaker Nike Air Max',
      description: 'Giày thể thao Nike Air Max màu trắng, ít sử dụng, còn rất mới',
      category: 'Giày dép',
      condition: 'Rất tốt',
      size: '42',
      color: 'Trắng',
      material: 'Da tổng hợp',
      brand: 'Nike',
      donorName: 'Trần Thị Bình',
      donorEmail: 'binh.tran@gmail.com',
      donorPhone: '0901234568',
      donationDate: '2024-01-08',
      status: 'sold',
      isApproved: true,
      approvedBy: 'Admin',
      approvedDate: '2024-01-09',
      price: 300000,
      originalPrice: 1200000,
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
      ],
      tags: ['Nike', 'Thể thao', 'Sneaker'],
      weight: 0.8,
      dimensions: '30x20x12 cm',
      ecoPoints: 150,
      views: 234,
      likes: 45,
      location: 'Kho Hà Nội'
    },
    {
      id: 3,
      name: 'Túi Xách Tote Canvas',
      description: 'Túi xách tote bằng canvas màu be, thiết kế đơn giản, thân thiện môi trường',
      category: 'Phụ kiện',
      condition: 'Tốt',
      size: 'One Size',
      color: 'Be',
      material: 'Canvas',
      brand: 'Handmade',
      donorName: 'Lê Văn Cường',
      donorEmail: 'cuong.le@gmail.com',
      donorPhone: '0901234569',
      donationDate: '2024-01-12',
      status: 'pending',
      isApproved: false,
      approvedBy: null,
      approvedDate: null,
      price: 80000,
      originalPrice: 200000,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
      ],
      tags: ['Canvas', 'Eco-friendly', 'Handmade'],
      weight: 0.3,
      dimensions: '40x35x10 cm',
      ecoPoints: 40,
      views: 89,
      likes: 12,
      location: 'Kho TP.HCM'
    },
    {
      id: 4,
      name: 'Đầm Maxi Hoa Nhí',
      description: 'Đầm maxi họa tiết hoa nhí, chất liệu voan mềm mại, phù hợp mùa hè',
      category: 'Thời trang',
      condition: 'Rất tốt',
      size: 'S',
      color: 'Hoa nhí xanh',
      material: 'Voan',
      brand: 'Zara',
      donorName: 'Phạm Thị Dung',
      donorEmail: 'dung.pham@gmail.com',
      donorPhone: '0901234570',
      donationDate: '2024-01-15',
      status: 'available',
      isApproved: true,
      approvedBy: 'Admin',
      approvedDate: '2024-01-16',
      price: 200000,
      originalPrice: 600000,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'
      ],
      tags: ['Maxi', 'Hoa nhí', 'Mùa hè'],
      weight: 0.4,
      dimensions: '50x120x2 cm',
      ecoPoints: 100,
      views: 178,
      likes: 34,
      location: 'Kho Đà Nẵng'
    },
    {
      id: 5,
      name: 'Sách "Kinh tế Tuần hoàn"',
      description: 'Sách về kinh tế tuần hoàn và phát triển bền vững, tác giả nổi tiếng',
      category: 'Sách & Văn phòng phẩm',
      condition: 'Tốt',
      size: 'Standard',
      color: 'Trắng',
      material: 'Giấy',
      brand: 'NXB Trẻ',
      donorName: 'Hoàng Minh Tuấn',
      donorEmail: 'tuan.hoang@gmail.com',
      donorPhone: '0901234571',
      donationDate: '2024-01-05',
      status: 'rejected',
      isApproved: false,
      approvedBy: 'Admin',
      approvedDate: '2024-01-06',
      price: 50000,
      originalPrice: 150000,
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
      ],
      tags: ['Sách', 'Kinh tế', 'Bền vững'],
      weight: 0.2,
      dimensions: '20x15x2 cm',
      ecoPoints: 25,
      views: 67,
      likes: 8,
      location: 'Kho Hà Nội'
    }
  ])

  const [filteredData, setFilteredData] = useState(productData)
  const [searchText, setSearchText] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCondition, setFilterCondition] = useState('all')

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Statistics
  const totalProducts = productData.length
  const availableProducts = productData.filter(product => product.status === 'available').length
  const soldProducts = productData.filter(product => product.status === 'sold').length
  const pendingProducts = productData.filter(product => product.status === 'pending').length
  const totalViews = productData.reduce((sum, product) => sum + product.views, 0)

  // Status mapping
  const statusConfig = {
    available: { color: 'green', text: 'Có sẵn' },
    sold: { color: 'blue', text: 'Đã bán' },
    pending: { color: 'orange', text: 'Chờ duyệt' },
    rejected: { color: 'red', text: 'Từ chối' },
    reserved: { color: 'purple', text: 'Đã đặt' }
  }

  // Condition mapping
  const conditionConfig = {
    'Rất tốt': { color: 'green', text: 'Rất tốt' },
    'Tốt': { color: 'blue', text: 'Tốt' },
    'Khá': { color: 'orange', text: 'Khá' },
    'Cần sửa chữa': { color: 'red', text: 'Cần sửa chữa' }
  }

  // Table columns
  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 300,
      render: (_, record) => (
        <div className="flex gap-3">
          <Image
            width={60}
            height={60}
            src={record.images[0]}
            alt={record.name}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{record.name}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{record.description}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {record.tags.slice(0, 2).map(tag => (
                <Tag key={tag} size="small" color="blue">{tag}</Tag>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span>👁 {record.views}</span>
              <span>❤️ {record.likes}</span>
              <span>⭐ {record.ecoPoints} EP</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin sản phẩm',
      key: 'info',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-medium">Danh mục:</span> {record.category}
          </div>
          <div className="text-sm">
            <span className="font-medium">Thương hiệu:</span> {record.brand}
          </div>
          <div className="text-sm">
            <span className="font-medium">Size:</span> {record.size} | 
            <span className="font-medium"> Màu:</span> {record.color}
          </div>
          <div className="text-sm">
            <span className="font-medium">Chất liệu:</span> {record.material}
          </div>
        </div>
      ),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition) => {
        const config = conditionConfig[condition] || { color: 'default', text: condition }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: 'Người quyên góp',
      key: 'donor',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="font-medium text-sm">{record.donorName}</div>
          <div className="text-xs text-gray-500">{record.donorEmail}</div>
          <div className="text-xs text-gray-500">{record.donorPhone}</div>
          <div className="text-xs text-gray-400">
            {new Date(record.donationDate).toLocaleDateString('vi-VN')}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            {price.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Tag color="purple">{location}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small" direction="vertical">
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
          </Space>
          <Space size="small">
            {!record.isApproved && (
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record)}
                className="text-green-600 hover:text-green-700"
                size="small"
              >
                Duyệt
              </Button>
            )}
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
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
        </Space>
      ),
    },
  ]

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value)
    filterData(value, filterCategory, filterStatus, filterCondition)
  }

  const handleCategoryFilter = (value) => {
    setFilterCategory(value)
    filterData(searchText, value, filterStatus, filterCondition)
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    filterData(searchText, filterCategory, value, filterCondition)
  }

  const handleConditionFilter = (value) => {
    setFilterCondition(value)
    filterData(searchText, filterCategory, filterStatus, value)
  }

  const filterData = (search, category, status, condition) => {
    let filtered = productData

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase()) ||
        product.donorName.toLowerCase().includes(search.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category)
    }

    if (status !== 'all') {
      filtered = filtered.filter(product => product.status === status)
    }

    if (condition !== 'all') {
      filtered = filtered.filter(product => product.condition === condition)
    }

    setFilteredData(filtered)
  }

  // Handle CRUD operations
  const handleAdd = () => {
    message.info("Tính năng đang phát triển")
  }

  const handleView = (product) => {
    message.info(`Xem chi tiết sản phẩm: ${product.name}`)
  }

  const handleEdit = (product) => {
    message.info(`Chỉnh sửa sản phẩm: ${product.name}`)
  }

  const handleApprove = (product) => {
    const newData = productData.map(p =>
      p.id === product.id ? { 
        ...p, 
        isApproved: true, 
        approvedBy: 'Admin',
        approvedDate: new Date().toISOString().split('T')[0],
        status: 'available'
      } : p
    )
    setProductData(newData)
    filterData(searchText, filterCategory, filterStatus, filterCondition)
    message.success('Duyệt sản phẩm thành công!')
  }

  const handleDelete = (id) => {
    const newData = productData.filter(product => product.id !== id)
    setProductData(newData)
    filterData(searchText, filterCategory, filterStatus, filterCondition)
    message.success('Xóa sản phẩm thành công!')
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
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<ShoppingOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Có sẵn"
              value={availableProducts}
              prefix={<GiftOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã bán"
              value={soldProducts}
              prefix={<CheckCircleOutlined className="text-purple-600" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt xem"
              value={totalViews}
              prefix={<EyeOutlined className="text-orange-600" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Danh sách sản phẩm
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Thêm sản phẩm
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col lg:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo tên, mô tả, thương hiệu, người quyên góp, tags..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1"
          />
          <Select
            placeholder="Lọc theo danh mục"
            size="large"
            value={filterCategory}
            onChange={handleCategoryFilter}
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả danh mục</Option>
            <Option value="Thời trang">Thời trang</Option>
            <Option value="Giày dép">Giày dép</Option>
            <Option value="Phụ kiện">Phụ kiện</Option>
            <Option value="Sách & Văn phòng phẩm">Sách & Văn phòng phẩm</Option>
            <Option value="Đồ gia dụng">Đồ gia dụng</Option>
            <Option value="Điện tử">Điện tử</Option>
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            size="large"
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="available">Có sẵn</Option>
            <Option value="sold">Đã bán</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="rejected">Từ chối</Option>
            <Option value="reserved">Đã đặt</Option>
          </Select>
          <Select
            placeholder="Lọc theo tình trạng"
            size="large"
            value={filterCondition}
            onChange={handleConditionFilter}
            className="w-full lg:w-48"
          >
            <Option value="all">Tất cả tình trạng</Option>
            <Option value="Rất tốt">Rất tốt</Option>
            <Option value="Tốt">Tốt</Option>
            <Option value="Khá">Khá</Option>
            <Option value="Cần sửa chữa">Cần sửa chữa</Option>
          </Select>
        </div>

        {/* Table */}
        <ProductTable
          filteredData={filteredData}
          handleView={handleView}
          handleEdit={handleEdit}
          handleApprove={handleApprove}
          handleDelete={handleDelete}
          conditionConfig={conditionConfig}
        />
      </Card>

    </motion.div>
  )
}

export default ProductManagement