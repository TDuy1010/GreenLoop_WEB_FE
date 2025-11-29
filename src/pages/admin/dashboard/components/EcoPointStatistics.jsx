import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd'
import { DollarOutlined, UserOutlined, TransactionOutlined } from '@ant-design/icons'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEcoPointStatistics } from '../../../../service/api/statisticsApi'

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
      const response = await getEcoPointStatistics()
      if (response?.success) setStats(response.data)
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê EcoPoint')
      console.error(error)
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

  // Format data for charts
  const usersByStatusData = stats?.usersByStatus ? Object.entries(stats.usersByStatus).map(([name, value]) => ({
    name,
    value
  })) : []

  const transactionsByTypeData = stats?.transactionsByType ? Object.entries(stats.transactionsByType).map(([name, value]) => ({
    name,
    value
  })) : []

  const transactionsBySourceData = stats?.transactionsBySource ? Object.entries(stats.transactionsBySource).map(([name, value]) => ({
    name,
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
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số user EcoPoint"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số giao dịch"
              value={stats?.totalTransactions || 0}
              prefix={<TransactionOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Phân bố user theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {usersByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố giao dịch theo loại">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transactionsByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố giao dịch theo nguồn">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionsBySourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f59e0b" name="Số giao dịch" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Transaction Trend Chart */}
      <Card title="Xu hướng giao dịch theo ngày">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transactionTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="earned" stroke="#16a34a" strokeWidth={2} name="Điểm cộng" />
            <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} name="Điểm trừ" />
            <Line type="monotone" dataKey="adjust" stroke="#3b82f6" strokeWidth={2} name="Điều chỉnh" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Users Table */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <Card title="Top người dùng có nhiều điểm nhất">
          <Table
            dataSource={stats.topUsers}
            columns={topUsersColumns}
            rowKey="userId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  )
}

export default EcoPointStatistics

