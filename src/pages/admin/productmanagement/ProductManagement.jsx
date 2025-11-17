import React, { useState, useEffect } from 'react'
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
  ShoppingOutlined,
  CheckCircleOutlined,
  GiftOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import ProductTable from './components/ProductTable'
import ProductDetail from './components/ProductDetail'
import ProductAdd from './components/ProductAdd'
import ProductEdit from './components/ProductEdit'
import { getProducts, getProductById } from '../../../service/api/productApi'

const { Search } = Input
const { Option } = Select
const MotionDiv = motion.div

const ProductManagement = () => {
  const [productData, setProductData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCondition, setFilterCondition] = useState('all')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Map API response to UI data
  const mapApiProductToComponent = (apiProduct) => {
    const conditionMap = {
      LIKE_NEW: 'Rất tốt',
      GOOD: 'Tốt',
      FAIR: 'Khá',
      POOR: 'Cần sửa chữa'
    }

    const statusMap = {
      AVAILABLE: 'available',
      SOLD: 'sold',
      PENDING: 'pending',
      REJECTED: 'rejected',
      RESERVED: 'reserved'
    }

    return {
      id: apiProduct.id,
      code: apiProduct.code,
      name: apiProduct.name,
      description: apiProduct.description || '',
      category: apiProduct.categoryName || 'Chưa phân loại',
      condition: conditionMap[apiProduct.conditionGrade] || 'Tốt',
      status: statusMap[apiProduct.status] || 'available',
      isApproved: apiProduct.status === 'AVAILABLE' || apiProduct.status === 'SOLD',
      price: apiProduct.price || 0,
      images:
        apiProduct.imageUrls && apiProduct.imageUrls.length > 0
          ? apiProduct.imageUrls
          : ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'],
      ecoPoints: apiProduct.ecoPointValue || 0,
      categoryId: apiProduct.categoryId,
      type: apiProduct.type,
      donationItemId: apiProduct.donationItemId,
      createdAt: apiProduct.createdAt,
      updatedAt: apiProduct.updatedAt
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts({ page: 0, size: 100 })

        if (response.success && response.data) {
          const products = response.data.content.map(mapApiProductToComponent)
          setProductData(products)
          setFilteredData(products)
        } else {
          message.error(response.message || 'Không thể tải danh sách sản phẩm')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        message.error(error.message || 'Có lỗi xảy ra khi tải danh sách sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Statistics
  const totalProducts = productData.length
  const availableProducts = productData.filter(product => product.status === 'available').length
  const soldProducts = productData.filter(product => product.status === 'sold').length
  const totalEcoPoints = productData.reduce((sum, product) => sum + (product.ecoPoints || 0), 0)

  // Condition mapping
  const conditionConfig = {
    'Rất tốt': { color: 'green', text: 'Rất tốt' },
    'Tốt': { color: 'blue', text: 'Tốt' },
    'Khá': { color: 'orange', text: 'Khá' },
    'Cần sửa chữa': { color: 'red', text: 'Cần sửa chữa' }
  }

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
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        product.code?.toLowerCase().includes(search.toLowerCase())
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
    setAddModalVisible(true)
  }

  const handleAddProduct = (newProduct) => {
    const updatedData = [...productData, newProduct]
    setProductData(updatedData)
    setFilteredData(updatedData)
    message.success("Thêm sản phẩm thành công!")
  }

  const handleView = async (product) => {
    try {
      setLoading(true)
      const response = await getProductById(product.id)

      if (response.success && response.data) {
        const mappedProduct = mapApiProductToComponent(response.data)
        setSelectedProduct(mappedProduct)
        setDetailModalVisible(true)
      } else {
        message.error(response.message || 'Không thể tải chi tiết sản phẩm')
        setSelectedProduct(product)
        setDetailModalVisible(true)
      }
    } catch (error) {
      console.error('Error fetching product detail:', error)
      message.error(error.message || 'Có lỗi xảy ra khi tải chi tiết sản phẩm')
      setSelectedProduct(product)
      setDetailModalVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditModalVisible(true)
  }

  const handleUpdateProduct = (updatedProduct) => {
    const updatedData = productData.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    )
    setProductData(updatedData)
    filterData(searchText, filterCategory, filterStatus, filterCondition)
    message.success("Cập nhật sản phẩm thành công!")
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

  const handleCloseDetail = () => {
    setDetailModalVisible(false)
    setSelectedProduct(null)
  }

  const handleCloseAdd = () => {
    setAddModalVisible(false)
  }

  const handleCloseEdit = () => {
    setEditModalVisible(false)
    setSelectedProduct(null)
  }

  return (
    <MotionDiv
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
              title="Tổng Eco Points"
              value={totalEcoPoints}
              prefix={<GiftOutlined className="text-orange-600" />}
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
            placeholder="Tìm kiếm theo tên, mô tả, mã sản phẩm..."
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
        <Spin spinning={loading}>
          <ProductTable
            filteredData={filteredData}
            handleView={handleView}
            handleEdit={handleEdit}
            handleApprove={handleApprove}
            handleDelete={handleDelete}
            conditionConfig={conditionConfig}
          />
        </Spin>
      </Card>

      {/* Product Detail Modal */}
      <ProductDetail
        visible={detailModalVisible}
        onClose={handleCloseDetail}
        product={selectedProduct}
      />

      {/* Product Add Modal */}
      <ProductAdd
        visible={addModalVisible}
        onClose={handleCloseAdd}
        onAdd={handleAddProduct}
      />

      {/* Product Edit Modal */}
      <ProductEdit
        visible={editModalVisible}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateProduct}
        product={selectedProduct}
      />

    </MotionDiv>
  )
}

export default ProductManagement