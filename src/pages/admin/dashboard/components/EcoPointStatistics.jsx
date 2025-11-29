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
      <div className="flex justify-center items-center h-64">
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
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng EcoPoint"
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
          <Card title="Phân bố người dùng theo trạng thái">
            {usersByStatusData.length > 0 ? (
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
                  <Tooltip formatter={(value) => [`${value} người dùng`, 'Số lượng']} />
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
          <Card title="Phân bố giao dịch theo loại">
            {transactionsByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transactionsByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent, value }) => 
                      percent > 0.05 ? `${name}\n${(percent * 100).toFixed(0)}%` : ''
                    }
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} giao dịch`, 'Số lượng']} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => {
                      const item = transactionsByTypeData.find(d => d.name === value)
                      return item ? `${value}: ${item.value}` : value
                    }}
                  />
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
          <Card title="Phân bố giao dịch theo nguồn">
            {transactionsBySourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transactionsBySourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} giao dịch`, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="value" fill="#f59e0b" name="Số giao dịch" />
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

      {/* Transaction Trend Chart */}
      <Card title="Xu hướng giao dịch theo ngày">
        {transactionTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transactionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => {
                const labels = {
                  'earned': 'Điểm cộng',
                  'spend': 'Điểm trừ',
                  'adjust': 'Điều chỉnh'
                }
                return [`${value} điểm`, labels[name] || name]
              }} />
              <Legend />
              <Line type="monotone" dataKey="earned" stroke="#16a34a" strokeWidth={2} name="Điểm cộng" />
              <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} name="Điểm trừ" />
              <Line type="monotone" dataKey="adjust" stroke="#3b82f6" strokeWidth={2} name="Điều chỉnh" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Chưa có dữ liệu
          </div>
        )}
      </Card>

      {/* Top Users Table */}
      {stats?.topUsers && stats.topUsers.length > 0 ? (
        <Card title="Top người dùng có nhiều điểm nhất">
          <Table
            dataSource={stats.topUsers}
            columns={topUsersColumns}
            rowKey="userId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ) : (
        <Card title="Top người dùng có nhiều điểm nhất">
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Chưa có dữ liệu
          </div>
        </Card>
      )}
    </div>
  )
}

export default EcoPointStatistics

