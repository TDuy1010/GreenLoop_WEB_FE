import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message, Empty, Divider } from 'antd'
import { CalendarOutlined, UserOutlined, TeamOutlined, InboxOutlined, BarChartOutlined } from '@ant-design/icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEventStatistics, getEventRegistrationStatistics, getEventStaffStatistics } from '../../../../service/api/statisticsApi'
import { kpiCardStyles, cardStyle, cardBodyStyle, chartTooltipStyle, sectionHeaderStyle } from './_uiImprovements'

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const EventStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [eventStats, setEventStats] = useState(null)
  const [registrationStats, setRegistrationStats] = useState(null)
  const [staffStats, setStaffStats] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const [eventRes, registrationRes, staffRes] = await Promise.all([
        getEventStatistics().catch(err => {
          console.error('Error fetching event statistics:', err)
          return null
        }),
        getEventRegistrationStatistics().catch(err => {
          console.error('Error fetching event registration statistics:', err)
          return null
        }),
        getEventStaffStatistics().catch(err => {
          console.error('Error fetching event staff statistics:', err)
          return null
        })
      ])

      console.log('Event Statistics Response:', eventRes)
      console.log('Event Registration Statistics Response:', registrationRes)
      console.log('Event Staff Statistics Response:', staffRes)

      // axiosClient interceptor đã trả về response.data
      // response sẽ là { success: true, data: {...}, ... }
      if (eventRes?.success && eventRes.data) {
        setEventStats(eventRes.data)
      } else if (eventRes && eventRes.totalEvents !== undefined) {
        setEventStats(eventRes)
      }

      if (registrationRes?.success && registrationRes.data) {
        setRegistrationStats(registrationRes.data)
      } else if (registrationRes && registrationRes.totalRegistrations !== undefined) {
        setRegistrationStats(registrationRes)
      }

      if (staffRes?.success && staffRes.data) {
        setStaffStats(staffRes.data)
      } else if (staffRes && staffRes.totalAssignments !== undefined) {
        setStaffStats(staffRes)
      }
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê sự kiện')
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
  const eventStatusMap = {
    'CREATED': 'Đã tạo',
    'PUBLISHED': 'Đã xuất bản',
    'UPCOMING': 'Sắp diễn ra',
    'ONGOING': 'Đang diễn ra',
    'CLOSED': 'Đã đóng',
    'CANCELED': 'Đã hủy'
  }

  const registrationStatusMap = {
    'BOOKED': 'Đã đặt',
    'ATTENDED': 'Đã tham gia',
    'CANCELED': 'Đã hủy',
    'NO_SHOW': 'Không tham gia',
    'BLOCKED': 'Bị chặn'
  }

  // Format data for charts
  const monthlyCreatedData = eventStats?.monthlyCreated?.map(item => ({
    month: item.month?.substring(5) || item.month,
    count: item.count || 0
  })) || []

  const eventsByStatusData = eventStats?.byStatus ? Object.entries(eventStats.byStatus).map(([name, value]) => ({
    name: eventStatusMap[name] || name,
    value
  })) : []

  const checkinTrendData = registrationStats?.checkinTrend?.map(item => ({
    date: item.date,
    count: item.count || 0
  })) || []

  const registrationsByStatusData = registrationStats?.byStatus ? Object.entries(registrationStats.byStatus).map(([name, value]) => ({
    name: registrationStatusMap[name] || name,
    value
  })) : []

  const topEventsColumns = [
    { title: 'Tên sự kiện', dataIndex: 'eventName', key: 'eventName' },
    { title: 'Số lượt đăng ký', dataIndex: 'registrations', key: 'registrations', align: 'right' }
  ]

  const topUsersColumns = [
    { title: 'ID Người dùng', dataIndex: 'userId', key: 'userId' },
    { title: 'Số lượt đăng ký', dataIndex: 'registrations', key: 'registrations', align: 'right' }
  ]

  const staffByEventColumns = [
    { title: 'ID Sự kiện', dataIndex: 'eventId', key: 'eventId' },
    { title: 'Tổng nhân sự', dataIndex: 'staffCount', key: 'staffCount', align: 'right' },
    { title: 'Quản lý cửa hàng', dataIndex: 'storeManagers', key: 'storeManagers', align: 'right' }
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
                title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng số sự kiện</span>}
                value={eventStats?.totalEvents || 0}
                prefix={<CalendarOutlined style={{ color: kpiCardStyles[0].iconColor, fontSize: '28px' }} />}
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
                title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng lượt đăng ký</span>}
                value={registrationStats?.totalRegistrations || 0}
                prefix={<UserOutlined style={{ color: kpiCardStyles[1].iconColor, fontSize: '28px' }} />}
                valueStyle={{ color: kpiCardStyles[1].iconColor, fontSize: '32px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: kpiCardStyles[2].background,
                border: `2px solid ${kpiCardStyles[2].borderColor}`,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = kpiCardStyles[2].hoverShadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Tổng nhân sự phân công</span>}
                value={staffStats?.totalAssignments || 0}
                prefix={<TeamOutlined style={{ color: kpiCardStyles[2].iconColor, fontSize: '28px' }} />}
                valueStyle={{ color: kpiCardStyles[2].iconColor, fontSize: '32px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: kpiCardStyles[3].background,
                border: `2px solid ${kpiCardStyles[3].borderColor}`,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              hoverable
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = kpiCardStyles[3].hoverShadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>Quản lý cửa hàng</span>}
                value={staffStats?.storeManagers || 0}
                prefix={<TeamOutlined style={{ color: kpiCardStyles[3].iconColor, fontSize: '28px' }} />}
                valueStyle={{ color: kpiCardStyles[3].iconColor, fontSize: '32px', fontWeight: 'bold' }}
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
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Tăng trưởng sự kiện theo tháng</span>}
              style={cardStyle}
              bodyStyle={cardBodyStyle}
            >
              {monthlyCreatedData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={monthlyCreatedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => [`${value} sự kiện`, 'Số lượng']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '16px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#16a34a" 
                      strokeWidth={3} 
                      name="Số sự kiện" 
                      dot={{ fill: '#16a34a', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
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
              title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố sự kiện theo trạng thái</span>}
              style={cardStyle}
              bodyStyle={cardBodyStyle}
            >
              {eventsByStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={eventsByStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      innerRadius={30}
                    >
                      {eventsByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => [`${value} sự kiện`, 'Số lượng']}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '24px' }}
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span style={{ color: '#475569', fontSize: '13px' }}>
                          {value}: {entry.payload.value}
                        </span>
                      )}
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
        </Row>
      </div>

      <Divider style={{ margin: '32px 0' }} />

      {/* Charts Row 2 */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />
          Xu hướng và phân bố
        </h3>
        <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Xu hướng điểm danh theo ngày</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {checkinTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={checkinTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} lượt điểm danh`, 'Số lượng']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    name="Số lượt điểm danh" 
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
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
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố đăng ký theo trạng thái</span>}
            style={cardStyle}
            bodyStyle={cardBodyStyle}
          >
            {registrationsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={registrationsByStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => [`${value} lượt đăng ký`, 'Số lượng']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '16px' }} />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    name="Số lượt đăng ký" 
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

      {/* Tables Row */}
      <div>
        <h3 style={sectionHeaderStyle}>
          <BarChartOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />
          Bảng dữ liệu chi tiết
        </h3>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Top sự kiện có nhiều đăng ký nhất</span>}
              style={cardStyle}
              bodyStyle={cardBodyStyle}
            >
              {eventStats?.topEventsByRegistration && eventStats.topEventsByRegistration.length > 0 ? (
                <Table
                  dataSource={eventStats.topEventsByRegistration}
                  columns={topEventsColumns}
                  rowKey="eventId"
                  pagination={{ pageSize: 5 }}
                  size="middle"
                  style={{ borderRadius: '8px' }}
                />
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
              title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Top người dùng đăng ký nhiều nhất</span>}
              style={cardStyle}
              bodyStyle={cardBodyStyle}
            >
              {registrationStats?.topUsers && registrationStats.topUsers.length > 0 ? (
                <Table
                  dataSource={registrationStats.topUsers}
                  columns={topUsersColumns}
                  rowKey="userId"
                  pagination={{ pageSize: 5 }}
                  size="middle"
                  style={{ borderRadius: '8px' }}
                />
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

      {/* Staff by Event Table */}
      <Card
        title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>Phân bố nhân sự theo sự kiện</span>}
        style={cardStyle}
        bodyStyle={cardBodyStyle}
      >
        {staffStats?.byEvent && staffStats.byEvent.length > 0 ? (
          <Table
            dataSource={staffStats.byEvent}
            columns={staffByEventColumns}
            rowKey="eventId"
            pagination={{ pageSize: 10 }}
            size="middle"
            style={{ borderRadius: '8px' }}
          />
        ) : (
          <Empty
            image={<InboxOutlined style={{ fontSize: '48px', color: '#cbd5e1' }} />}
            description={<span style={{ color: '#94a3b8' }}>Chưa có dữ liệu phân bố nhân sự</span>}
            style={{ padding: '60px 0' }}
          />
        )}
      </Card>
    </div>
  )
}

export default EventStatistics

