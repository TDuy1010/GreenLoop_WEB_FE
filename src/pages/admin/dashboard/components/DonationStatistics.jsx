import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Spin, message, Empty, Divider } from 'antd'
import { HeartOutlined, InboxOutlined, BarChartOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getDonationStatistics } from '../../../../service/api/statisticsApi'
import { kpiCardStyles, cardStyle, cardBodyStyle, chartTooltipStyle, sectionHeaderStyle } from './_uiImprovements'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const DonationStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await getDonationStatistics().catch(err => {
        console.error('Error fetching donation statistics:', err)
        return null
      })

      console.log('Donation Statistics Response:', response)

      // axiosClient interceptor đã trả về response.data
      // response sẽ là { success: true, data: {...}, ... }
      if (response?.success && response.data) {
        setStats(response.data)
      } else if (response && response.totalDonations !== undefined) {
        // Nếu response không có success field nhưng có data trực tiếp
        setStats(response)
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê quyên góp')
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
    'AT_EVENT': 'Tại sự kiện',
    'IN_WAREHOUSE': 'Trong kho',
    'RECYCLED': 'Đã tái chế'
  }

  const conditionMap = {
    'NEW': 'Mới',
    'LIKE_NEW': 'Như mới',
    'GOOD': 'Tốt',
    'FAIR': 'Khá',
    'POOR': 'Kém'
  }

  // Format data for charts
  const itemsByStatusData = stats?.itemsByStatus ? Object.entries(stats.itemsByStatus).map(([name, value]) => ({
    name: statusMap[name] || name,
    value
  })) : []

  const itemsByConditionData = stats?.itemsByCondition ? Object.entries(stats.itemsByCondition).map(([name, value]) => ({
    name: conditionMap[name] || name,
    value
  })) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px 0' }}>
      {/* KPI Cards */}
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
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng số lượt quyên góp</span>}
              value={stats?.totalDonations || 0}
              prefix={<HeartOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[0].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: kpiCardStyles[1].background,
              border: `1px solid ${kpiCardStyles[1].borderColor}`,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng số sản phẩm quyên góp</span>}
              value={stats?.totalDonationItems || 0}
              prefix={<HeartOutlined style={{ color: kpiCardStyles[1].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[1].iconColor, fontSize: '28px', fontWeight: 'bold' }}
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
            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Phân bố sản phẩm quyên góp theo trạng thái</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {itemsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={itemsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {itemsByStatusData.map((entry, index) => (
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
                style={{ padding: '40px 0' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Phân bố sản phẩm quyên góp theo tình trạng</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {itemsByConditionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={itemsByConditionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#f59e0b" name="Số lượng" radius={[8, 8, 0, 0]} />
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
    </div>
  )
}

export default DonationStatistics

