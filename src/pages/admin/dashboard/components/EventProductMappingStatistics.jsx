import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message, Empty, Divider } from 'antd'
import { LinkOutlined, InboxOutlined, BarChartOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEventProductMappingStatistics } from '../../../../service/api/statisticsApi'
import { kpiCardStyles, cardStyle, cardBodyStyle, chartTooltipStyle, sectionHeaderStyle } from './_uiImprovements'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const EventProductMappingStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await getEventProductMappingStatistics().catch(err => {
        console.error('Error fetching event product mapping statistics:', err)
        return null
      })

      console.log('Event Product Mapping Statistics Response:', response)

      // axiosClient interceptor đã trả về response.data
      // response sẽ là { success: true, data: {...}, ... }
      if (response?.success && response.data) {
        setStats(response.data)
      } else if (response && response.totalMappings !== undefined) {
        // Nếu response không có success field nhưng có data trực tiếp
        setStats(response)
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê mapping sản phẩm-sự kiện')
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

  // Mapping tiếng Việt cho status
  const statusMap = {
    'ONLINE': 'Trực tuyến',
    'DISPLAYED': 'Đang hiển thị',
    'SOLD_OUT': 'Đã bán hết',
    'RETURNED': 'Đã trả lại'
  }

  // Format data for charts
  const mappingsByStatusData = stats?.mappingsByStatus ? Object.entries(stats.mappingsByStatus).map(([name, value]) => ({
    name: statusMap[name] || name,
    value
  })) : []

  const eventProductCountsData = stats?.eventProductCounts || []

  const eventProductColumns = [
    { title: 'ID Sự kiện', dataIndex: 'eventId', key: 'eventId' },
    { title: 'Số lượng sản phẩm', dataIndex: 'productCount', key: 'productCount', align: 'right' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px 0' }}>
      {/* KPI Card */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#16a34a' }} />
          Tổng quan thống kê
        </h3>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: kpiCardStyles[0].background,
              border: `1px solid ${kpiCardStyles[0].borderColor}`,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng số liên kết</span>}
              value={stats?.totalMappings || 0}
              prefix={<LinkOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[0].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
      </div>

      <Divider style={{ margin: '24px 0' }} />

      {/* Charts Row */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
          Biểu đồ phân tích
        </h3>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Phân bố liên kết theo trạng thái</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {mappingsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mappingsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mappingsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} liên kết`, 'Số lượng']}
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
                style={{ padding: '40px 0' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Số lượng sản phẩm theo sự kiện</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {eventProductCountsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventProductCountsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="eventId" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
                  />
                  <Legend />
                  <Bar dataKey="productCount" fill="#3b82f6" name="Số lượng sản phẩm" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty
                image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
                description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
                style={{ padding: '40px 0' }}
              />
            )}
          </Card>
        </Col>
      </Row>
      </div>

      <Divider style={{ margin: '32px 0' }} />

      {/* Event Product Counts Table */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
          Bảng dữ liệu chi tiết
        </h3>
        <Card
          style={{ marginTop: '16px' }}
        title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Chi tiết số lượng sản phẩm theo sự kiện</span>}
        style={cardStyle}
        bodyStyle={cardBodyStyle}
      >
        {eventProductCountsData.length > 0 ? (
          <Table
            dataSource={eventProductCountsData}
            columns={eventProductColumns}
            rowKey="eventId"
            pagination={{ pageSize: 10 }}
            style={{ borderRadius: '8px' }}
          />
        ) : (
          <Empty
            image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
            description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu liên kết sản phẩm-sự kiện</span>}
            style={{ padding: '40px 0' }}
          />
        )}
        </Card>
      </div>
    </div>
  )
}

export default EventProductMappingStatistics

