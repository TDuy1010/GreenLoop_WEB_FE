import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd'
import { ShoppingOutlined, AppstoreOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getProductStatistics, getCategoryStatistics } from '../../../../service/api/statisticsApi'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const ProductStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [productStats, setProductStats] = useState(null)
  const [categoryStats, setCategoryStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const [productRes, categoryRes] = await Promise.all([
        getProductStatistics().catch(err => {
          console.error('Error fetching product statistics:', err)
          return null
        }),
        getCategoryStatistics().catch(err => {
          console.error('Error fetching category statistics:', err)
          return null
        })
      ])

      console.log('Product Statistics Response:', productRes)
      console.log('Category Statistics Response:', categoryRes)

      // axiosClient interceptor đã trả về response.data
      // productRes sẽ là { success: true, data: {...}, ... }
      if (productRes?.success && productRes.data) {
        setProductStats(productRes.data)
      } else if (productRes && productRes.totalProducts !== undefined) {
        // Nếu response không có success field nhưng có data trực tiếp
        setProductStats(productRes)
      }

      if (categoryRes?.success && categoryRes.data) {
        setCategoryStats(categoryRes.data)
      } else if (categoryRes && categoryRes.totalCategories !== undefined) {
        setCategoryStats(categoryRes)
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê sản phẩm')
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    )
  }

  // Mapping tiếng Việt
  const statusMap = {
    'PENDING': 'Chờ duyệt',
    'AVAILABLE': 'Có sẵn',
    'SOLD': 'Đã bán',
    'UNAVAILABLE': 'Không có sẵn'
  }

  const typeMap = {
    'RESALE': 'Bán lại',
    'CHARITY': 'Từ thiện'
  }

  const conditionMap = {
    'NEW': 'Mới',
    'LIKE_NEW': 'Như mới',
    'GOOD': 'Tốt',
    'FAIR': 'Khá',
    'POOR': 'Kém'
  }

  // Format data for charts
  const productsByStatusData = productStats?.productsByStatus ? Object.entries(productStats.productsByStatus).map(([name, value]) => ({
    name: statusMap[name] || name,
    value
  })) : []

  const productsByTypeData = productStats?.productsByType ? Object.entries(productStats.productsByType).map(([name, value]) => ({
    name: typeMap[name] || name,
    value
  })) : []

  const productsByConditionData = productStats?.productsByCondition ? Object.entries(productStats.productsByCondition).map(([name, value]) => ({
    name: conditionMap[name] || name,
    value
  })) : []

  const categoryCountsData = categoryStats?.categoryCounts || []

  const topProductsColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng đã bán', dataIndex: 'soldCount', key: 'soldCount', align: 'right' }
  ]

  const categoryColumns = [
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng sản phẩm', dataIndex: 'productCount', key: 'productCount', align: 'right' }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={productStats?.totalProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số danh mục"
              value={categoryStats?.totalCategories || 0}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Phân bố sản phẩm theo trạng thái">
            {productsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố sản phẩm theo loại">
            {productsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productsByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố sản phẩm theo tình trạng">
            {productsByConditionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productsByConditionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="value" fill="#f59e0b" name="Số lượng" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố sản phẩm theo danh mục">
            {categoryCountsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryCountsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="productCount" fill="#16a34a" name="Số lượng sản phẩm" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top sản phẩm bán chạy">
            {productStats?.topProducts && productStats.topProducts.length > 0 ? (
              <Table
                dataSource={productStats.topProducts}
                columns={topProductsColumns}
                rowKey="productId"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu sản phẩm bán chạy
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Category Table */}
      {categoryCountsData.length > 0 ? (
        <Card title="Chi tiết phân bố theo danh mục">
          <Table
            dataSource={categoryCountsData}
            columns={categoryColumns}
            rowKey="categoryId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ) : (
        <Card title="Chi tiết phân bố theo danh mục">
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Chưa có dữ liệu danh mục
          </div>
        </Card>
      )}
    </div>
  )
}

export default ProductStatistics

