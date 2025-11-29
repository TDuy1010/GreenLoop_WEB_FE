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
      const response = await getVoucherStatistics().catch(err => {
        console.error('Error fetching voucher statistics:', err)
        return null
      })

      console.log('Voucher Statistics Response:', response)

      // axiosClient interceptor đã trả về response.data
      // response sẽ là { success: true, data: {...}, ... }
      if (response?.success && response.data) {
        setStats(response.data)
      } else if (response && response.totalCampaigns !== undefined) {
        // Nếu response không có success field nhưng có data trực tiếp
        setStats(response)
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê Voucher')
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
  const voucherTypeMap = {
    'PERCENT': 'Phần trăm',
    'AMOUNT': 'Số tiền',
    'FREE_ITEM': 'Sản phẩm miễn phí',
    'FREESHIP': 'Miễn phí vận chuyển'
  }

  const voucherStatusMap = {
    'ACTIVE': 'Đang hoạt động',
    'EXPIRED': 'Hết hạn',
    'USED': 'Đã sử dụng',
    'REVOKED': 'Đã thu hồi',
    'OUT_OF_STOCK': 'Hết hàng'
  }

  const voucherUserStatusMap = {
    'AVAILABLE': 'Có sẵn',
    'REDEEMED': 'Đã đổi',
    'EXPIRED': 'Hết hạn'
  }

  // Format data for charts
  const vouchersByTypeData = stats?.vouchersByType ? Object.entries(stats.vouchersByType).map(([name, value]) => ({
    name: voucherTypeMap[name] || name,
    value
  })) : []

  const vouchersByStatusData = stats?.vouchersByStatus ? Object.entries(stats.vouchersByStatus).map(([name, value]) => ({
    name: voucherStatusMap[name] || name,
    value
  })) : []

  const voucherUsersByStatusData = stats?.voucherUsersByStatus ? Object.entries(stats.voucherUsersByStatus).map(([name, value]) => ({
    name: voucherUserStatusMap[name] || name,
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
              title="Tổng số chiến dịch"
              value={stats?.totalCampaigns || 0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chiến dịch đang hoạt động"
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
              title="Tổng người dùng có voucher"
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
              title="Tổng lượt đổi"
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
              value={stats?.totalDiscountValue ?? 0}
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
            {vouchersByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vouchersByTypeData}
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
                    {vouchersByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} voucher`, 'Số lượng']} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => {
                      const item = vouchersByTypeData.find(d => d.name === value)
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
          <Card title="Phân bố voucher theo trạng thái">
            {vouchersByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vouchersByStatusData}
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
                    {vouchersByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} voucher`, 'Số lượng']} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => {
                      const item = vouchersByStatusData.find(d => d.name === value)
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
          <Card title="Phân bố người dùng voucher theo trạng thái">
            {voucherUsersByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={voucherUsersByStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} người dùng`, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="value" fill="#8b5cf6" name="Số lượng" />
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

      {/* Redemption Trend Chart */}
          <Card title="Xu hướng đổi voucher theo ngày">
        {redemptionTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={redemptionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="redemptionCount" stroke="#16a34a" strokeWidth={2} name="Số lượt đổi" />
              <Line yAxisId="right" type="monotone" dataKey="discountValue" stroke="#ef4444" strokeWidth={2} name="Giá trị giảm giá (đ)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Chưa có dữ liệu
          </div>
        )}
      </Card>

      {/* Tables Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top voucher còn nhiều số lượng">
            {stats?.topAvailableVouchers && stats.topAvailableVouchers.length > 0 ? (
              <Table
                dataSource={stats.topAvailableVouchers}
                columns={topAvailableVouchersColumns}
                rowKey="voucherId"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top người dùng có nhiều voucher nhất">
            {stats?.topUsers && stats.topUsers.length > 0 ? (
              <Table
                dataSource={stats.topUsers}
                columns={topUsersColumns}
                rowKey="userId"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default VoucherStatistics

