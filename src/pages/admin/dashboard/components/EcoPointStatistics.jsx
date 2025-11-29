import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message, Empty, Divider } from 'antd'
import { DollarOutlined, UserOutlined, TransactionOutlined, InboxOutlined, BarChartOutlined } from '@ant-design/icons'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEcoPointStatistics } from '../../../../service/api/statisticsApi'
import { kpiCardStyles, cardStyle, cardBodyStyle, chartTooltipStyle, sectionHeaderStyle } from './_uiImprovements'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const EcoPointStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await getEcoPointStatistics().catch(err => {
        console.error('Error fetching eco point statistics:', err)
        return null
      })

      console.log('EcoPoint Statistics Response:', response)

      // axiosClient interceptor đã trả về response.data
      // response sẽ là { success: true, data: {...}, ... }
      if (response?.success && response.data) {
        setStats(response.data)
      } else if (response && response.totalUsers !== undefined) {
        // Nếu response không có success field nhưng có data trực tiếp
        setStats(response)
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê EcoPoint')
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
  const userStatusMap = {
    'ACTIVE': 'Đang hoạt động',
    'SUSPENDED': 'Đã tạm khóa'
  }

  const transactionTypeMap = {
    'EARNED': 'Điểm cộng',
    'SPEND': 'Điểm trừ',
    'ADJUST': 'Điều chỉnh'
  }

  const transactionSourceMap = {
    'DONATION': 'Quyên góp',
    'ORDER': 'Đơn hàng',
    'EVENT': 'Sự kiện',
    'ADMIN': 'Quản trị viên',
    'VOUCHER_EXCHANGE': 'Đổi voucher'
  }

  // Format data for charts
  const usersByStatusData = stats?.usersByStatus ? Object.entries(stats.usersByStatus).map(([name, value]) => ({
    name: userStatusMap[name] || name,
    value
  })) : []

  const transactionsByTypeData = stats?.transactionsByType ? Object.entries(stats.transactionsByType).map(([name, value]) => ({
    name: transactionTypeMap[name] || name,
    value
  })) : []

  const transactionsBySourceData = stats?.transactionsBySource ? Object.entries(stats.transactionsBySource).map(([name, value]) => ({
    name: transactionSourceMap[name] || name,
    value
  })) : []

  const transactionTrendData = stats?.transactionTrend?.map(item => ({
    date: item.date,
    earned: item.earned || 0,
    spend: item.spend || 0,
    adjust: item.adjust || 0
  })) || []

  const topUsersColumns = [
    { title: 'ID Người dùng', dataIndex: 'userId', key: 'userId' },
    { title: 'Điểm hiện tại', dataIndex: 'totalPoints', key: 'totalPoints', align: 'right' },
    { title: 'Tổng điểm tích lũy', dataIndex: 'lifetimePoints', key: 'lifetimePoints', align: 'right' }
  ]

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
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng số người dùng EcoPoint</span>}
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '28px' }} />}
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
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng số giao dịch</span>}
              value={stats?.totalTransactions || 0}
              prefix={<TransactionOutlined style={{ color: kpiCardStyles[1].iconColor, fontSize: '28px' }} />}
              valueStyle={{ color: kpiCardStyles[1].iconColor, fontSize: '32px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
      </div>

      <Divider style={{ margin: '24px 0' }} />

      {/* Charts Row 1 */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
          Biểu đồ phân tích
        </h3>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố người dùng theo trạng thái</span>}
            style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ ...cardBodyStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {usersByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={usersByStatusData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {usersByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value, name, props) => {
                      const total = usersByStatusData.reduce((sum, d) => sum + d.value, 0)
                      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                      return [`${value} người dùng (${percent}%)`, props.payload.name]
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={80}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '24px' }}
                    formatter={(value, entry) => {
                      const item = usersByStatusData.find(d => d.name === value)
                      const total = usersByStatusData.reduce((sum, d) => sum + d.value, 0)
                      const percent = item ? ((item.value / total) * 100).toFixed(1) : '0'
                      return (
                        <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                          {value}: <strong style={{ color: '#1e293b' }}>{item?.value || 0}</strong> ({percent}%)
                        </span>
                      )
                    }}
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
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố giao dịch theo loại</span>}
            style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ ...cardBodyStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {transactionsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={transactionsByTypeData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {transactionsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value, name, props) => {
                      const total = transactionsByTypeData.reduce((sum, d) => sum + d.value, 0)
                      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                      return [`${value} giao dịch (${percent}%)`, props.payload.name]
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={80}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '24px' }}
                    formatter={(value, entry) => {
                      const item = transactionsByTypeData.find(d => d.name === value)
                      const total = transactionsByTypeData.reduce((sum, d) => sum + d.value, 0)
                      const percent = item ? ((item.value / total) * 100).toFixed(1) : '0'
                      return (
                        <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                          {value}: <strong style={{ color: '#1e293b' }}>{item?.value || 0}</strong> ({percent}%)
                        </span>
                      )
                    }}
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
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố giao dịch theo nguồn</span>}
            style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ ...cardBodyStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {transactionsBySourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={transactionsBySourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} giao dịch`, 'Số lượng']}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                        <strong style={{ color: '#1e293b' }}>{value}</strong>
                      </span>
                    )}
                  />
                  <Bar dataKey="value" fill="#f59e0b" name="Số giao dịch" radius={[8, 8, 0, 0]} />
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

      <Divider style={{ margin: '32px 0' }} />

      {/* Transaction Trend Chart */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />
          Xu hướng giao dịch
        </h3>
        <Card
          title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Xu hướng giao dịch theo ngày</span>}
          style={{ ...cardStyle, marginTop: '16px' }}
          bodyStyle={cardBodyStyle}
        >
        {transactionTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transactionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value, name) => {
                  const labels = {
                    'earned': 'Điểm cộng',
                    'spend': 'Điểm trừ',
                    'adjust': 'Điều chỉnh'
                  }
                  return [`${value} điểm`, labels[name] || name]
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="earned" stroke="#16a34a" strokeWidth={3} name="Điểm cộng" dot={{ fill: '#16a34a', r: 4 }} />
              <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={3} name="Điểm trừ" dot={{ fill: '#ef4444', r: 4 }} />
              <Line type="monotone" dataKey="adjust" stroke="#3b82f6" strokeWidth={3} name="Điều chỉnh" dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty
            image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
            description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
            style={{ padding: '40px 0' }}
          />
        )}
        </Card>
      </div>

      <Divider style={{ margin: '32px 0' }} />

      {/* Top Users Table */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
          Bảng dữ liệu chi tiết
        </h3>
        <Card
          title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Top người dùng có nhiều điểm nhất</span>}
          style={{ ...cardStyle, marginTop: '16px' }}
          bodyStyle={cardBodyStyle}
        >
        {stats?.topUsers && stats.topUsers.length > 0 ? (
          <Table
            dataSource={stats.topUsers}
            columns={topUsersColumns}
            rowKey="userId"
            pagination={{ pageSize: 10 }}
            style={{ borderRadius: '8px' }}
          />
        ) : (
          <Empty
            image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
            description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu</span>}
            style={{ padding: '40px 0' }}
          />
        )}
        </Card>
      </div>
    </div>
  )
}

export default EcoPointStatistics

