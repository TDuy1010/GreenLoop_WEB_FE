import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message, Empty, Divider } from 'antd'
import { GiftOutlined, UserOutlined, ShoppingCartOutlined, InboxOutlined, BarChartOutlined } from '@ant-design/icons'
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getVoucherStatistics } from '../../../../service/api/statisticsApi'
import { kpiCardStyles, cardStyle, cardBodyStyle, chartTooltipStyle, sectionHeaderStyle } from './_uiImprovements'

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng số chiến dịch</span>}
              value={stats?.totalCampaigns || 0}
              prefix={<GiftOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '24px' }} />}
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
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Chiến dịch đang hoạt động</span>}
              value={stats?.activeCampaigns || 0}
              prefix={<GiftOutlined style={{ color: kpiCardStyles[1].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[1].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: kpiCardStyles[2].background,
              border: `1px solid ${kpiCardStyles[2].borderColor}`,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng số voucher</span>}
              value={stats?.totalVouchers || 0}
              prefix={<GiftOutlined style={{ color: kpiCardStyles[2].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[2].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: kpiCardStyles[3].background,
              border: `1px solid ${kpiCardStyles[3].borderColor}`,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng người dùng có voucher</span>}
              value={stats?.totalVoucherUsers || 0}
              prefix={<UserOutlined style={{ color: kpiCardStyles[3].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[3].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
      </div>

      <Divider style={{ margin: '24px 0' }} />

      {/* KPI Row 2 */}
      <div>
        <Row gutter={[24, 24]}>
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
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng lượt đổi</span>}
              value={stats?.totalRedemptions || 0}
              prefix={<ShoppingCartOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '24px' }} />}
              valueStyle={{ color: kpiCardStyles[0].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: kpiCardStyles[5].background,
              border: `1px solid ${kpiCardStyles[5].borderColor}`,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Tổng giá trị giảm giá</span>}
              value={stats?.totalDiscountValue ?? 0}
              prefix={<ShoppingCartOutlined style={{ color: kpiCardStyles[5].iconColor, fontSize: '24px' }} />}
              suffix="đ"
              valueStyle={{ color: kpiCardStyles[5].iconColor, fontSize: '28px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
      </div>

      <Divider style={{ margin: '32px 0' }} />

      {/* Charts Row 1 */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
          Biểu đồ phân tích
        </h3>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố voucher theo loại</span>}
            style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ ...cardBodyStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {vouchersByTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                  <Pie
                    data={vouchersByTypeData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    startAngle={0}
                  >
                    {vouchersByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value, name, props) => {
                      const total = vouchersByTypeData.reduce((sum, d) => sum + d.value, 0)
                      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                      return [`${value} voucher (${percent}%)`, props.payload.name]
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={80}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '24px' }}
                    formatter={(value, entry) => {
                      const item = vouchersByTypeData.find(d => d.name === value)
                      const total = vouchersByTypeData.reduce((sum, d) => sum + d.value, 0)
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
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố voucher theo trạng thái</span>}
            style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ ...cardBodyStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {vouchersByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                  <Pie
                    data={vouchersByStatusData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    startAngle={0}
                  >
                    {vouchersByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value, name, props) => {
                      const total = vouchersByStatusData.reduce((sum, d) => sum + d.value, 0)
                      const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                      return [`${value} voucher (${percent}%)`, props.payload.name]
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={80}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '24px' }}
                    formatter={(value, entry) => {
                      const item = vouchersByStatusData.find(d => d.name === value)
                      const total = vouchersByStatusData.reduce((sum, d) => sum + d.value, 0)
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
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố người dùng voucher theo trạng thái</span>}
            style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ ...cardBodyStyle, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {voucherUsersByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={voucherUsersByStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    style={{ fontSize: '12px' }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} người dùng`, 'Số lượng']}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '16px' }}
                    iconType="square"
                    formatter={(value) => (
                      <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>
                        <strong style={{ color: '#1e293b' }}>{value}</strong>
                      </span>
                    )}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8b5cf6" 
                    name="Số lượng" 
                    radius={[12, 12, 0, 0]}
                    style={{ cursor: 'pointer' }}
                  />
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

      {/* Redemption Trend Chart */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />
          Xu hướng đổi voucher
        </h3>
        <Card
          title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Xu hướng đổi voucher theo ngày</span>}
          style={{ ...cardStyle, marginTop: '16px' }}
          bodyStyle={cardBodyStyle}
        >
        {redemptionTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={redemptionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="redemptionCount" stroke="#16a34a" strokeWidth={3} name="Số lượt đổi" dot={{ fill: '#16a34a', r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="discountValue" stroke="#ef4444" strokeWidth={3} name="Giá trị giảm giá (đ)" dot={{ fill: '#ef4444', r: 4 }} />
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

      {/* Tables Row */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
          Bảng dữ liệu chi tiết
        </h3>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Top voucher còn nhiều số lượng</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {stats?.topAvailableVouchers && stats.topAvailableVouchers.length > 0 ? (
              <Table
                dataSource={stats.topAvailableVouchers}
                columns={topAvailableVouchersColumns}
                rowKey="voucherId"
                pagination={{ pageSize: 5 }}
                size="small"
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
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Top người dùng có nhiều voucher nhất</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {stats?.topUsers && stats.topUsers.length > 0 ? (
              <Table
                dataSource={stats.topUsers}
                columns={topUsersColumns}
                rowKey="userId"
                pagination={{ pageSize: 5 }}
                size="small"
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
        </Col>
      </Row>
      </div>
    </div>
  )
}

export default VoucherStatistics

