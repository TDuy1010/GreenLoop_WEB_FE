import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message, Empty, Divider } from 'antd'
import { ShoppingOutlined, AppstoreOutlined, InboxOutlined, BarChartOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getProductStatistics, getCategoryStatistics } from '../../../../service/api/statisticsApi'
import { kpiCardStyles, cardStyle, cardBodyStyle, chartTooltipStyle, sectionHeaderStyle } from './_uiImprovements'

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px 0' }}>
      {/* KPI Cards */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#16a34a' }} />
          Tổng quan thống kê
        </h3>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: kpiCardStyles[0].background,
                border: `2px solid ${kpiCardStyles[0].borderColor}`,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = kpiCardStyles[0].hoverShadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng số sản phẩm</span>}
                value={productStats?.totalProducts || 0}
                prefix={<ShoppingOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '28px' }} />}
                valueStyle={{ color: kpiCardStyles[0].iconColor, fontSize: '32px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: kpiCardStyles[1].background,
                border: `2px solid ${kpiCardStyles[1].borderColor}`,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = kpiCardStyles[1].hoverShadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng số danh mục</span>}
                value={categoryStats?.totalCategories || 0}
                prefix={<AppstoreOutlined style={{ color: kpiCardStyles[1].iconColor, fontSize: '28px' }} />}
                valueStyle={{ color: kpiCardStyles[1].iconColor, fontSize: '32px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Charts Row 1 */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
          Biểu đồ phân tích
        </h3>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card
              title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố sản phẩm theo trạng thái</span>}
              style={cardStyle}
              bodyStyle={cardBodyStyle}
            >
            {productsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={productsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={100}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
                description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố sản phẩm theo loại</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {productsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={productsByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={100}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
                description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố sản phẩm theo tình trạng</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {productsByConditionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={productsByConditionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#f59e0b" name="Số lượng" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
                description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Charts Row 2 */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
          Bảng dữ liệu chi tiết
        </h3>
        <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố sản phẩm theo danh mục</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {categoryCountsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categoryCountsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="name" type="category" width={150} stroke="#64748b" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
                  />
                  <Legend />
                  <Bar dataKey="productCount" fill="#16a34a" name="Số lượng sản phẩm" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
                description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Top sản phẩm bán chạy</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {productStats?.topProducts && productStats.topProducts.length > 0 ? (
              <Table
                dataSource={productStats.topProducts}
                columns={topProductsColumns}
                rowKey="productId"
                pagination={{ pageSize: 5 }}
                size="small"
                style={{ borderRadius: '8px' }}
              />
            ) : (
              <Empty
                image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
                description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu sản phẩm bán chạy</span>}
                style={{ padding: '60px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
      </div>

      {/* Category Table */}
      <Card
        title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Chi tiết phân bố theo danh mục</span>}
        style={cardStyle}
        bodyStyle={cardBodyStyle}
      >
        {categoryCountsData.length > 0 ? (
          <Table
            dataSource={categoryCountsData}
            columns={categoryColumns}
            rowKey="categoryId"
            pagination={{ pageSize: 10 }}
            style={{ borderRadius: '8px' }}
          />
        ) : (
          <Empty
            image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
            description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu danh mục</span>}
            style={{ padding: '40px 0' }}
          />
        )}
      </Card>
    </div>
  )
}

export default ProductStatistics

