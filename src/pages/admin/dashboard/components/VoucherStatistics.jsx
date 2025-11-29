import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd'
import { GiftOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getVoucherStatistics } from '../../../../service/api/statisticsApi'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const VoucherStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const response = await getVoucherStatistics()
      if (response?.success) setStats(response.data)
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê Voucher')
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
  const vouchersByTypeData = stats?.vouchersByType ? Object.entries(stats.vouchersByType).map(([name, value]) => ({
    name,
    value
  })) : []

  const vouchersByStatusData = stats?.vouchersByStatus ? Object.entries(stats.vouchersByStatus).map(([name, value]) => ({
    name,
    value
  })) : []

  const voucherUsersByStatusData = stats?.voucherUsersByStatus ? Object.entries(stats.voucherUsersByStatus).map(([name, value]) => ({
    name,
    value
  })) : []

  const redemptionTrendData = stats?.redemptionTrend?.map(item => ({
    date: item.date,
    redemptionCount: item.redemptionCount || 0,
    discountValue: item.discountValue || 0
  })) || []

  const topAvailableVouchersColumns = [
    { title: 'Tên voucher', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng còn lại', dataIndex: 'availableQuantity', key: 'availableQuantity', align: 'right' }
  ]

  const topUsersColumns = [
    { title: 'ID Người dùng', dataIndex: 'userId', key: 'userId' },
    { title: 'Số lượng voucher', dataIndex: 'voucherCount', key: 'voucherCount', align: 'right' }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số campaign"
              value={stats?.totalCampaigns || 0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Campaign đang hoạt động"
              value={stats?.activeCampaigns || 0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số voucher"
              value={stats?.totalVouchers || 0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng user có voucher"
              value={stats?.totalVoucherUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* KPI Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt redeem"
              value={stats?.totalRedemptions || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng giá trị giảm giá"
              value={stats?.totalDiscountValue || 0}
              prefix={<ShoppingCartOutlined />}
              suffix="đ"
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Phân bố voucher theo loại">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vouchersByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vouchersByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố voucher theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vouchersByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vouchersByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Phân bố voucher user theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={voucherUsersByStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Redemption Trend Chart */}
      <Card title="Xu hướng redeem voucher theo ngày">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={redemptionTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="redemptionCount" stroke="#16a34a" strokeWidth={2} name="Số lượt redeem" />
            <Line yAxisId="right" type="monotone" dataKey="discountValue" stroke="#ef4444" strokeWidth={2} name="Giá trị giảm giá (đ)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Tables Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top voucher còn nhiều số lượng">
            <Table
              dataSource={stats?.topAvailableVouchers || []}
              columns={topAvailableVouchersColumns}
              rowKey="voucherId"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top user có nhiều voucher nhất">
            <Table
              dataSource={stats?.topUsers || []}
              columns={topUsersColumns}
              rowKey="userId"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default VoucherStatistics

