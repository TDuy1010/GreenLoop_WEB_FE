import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd'
import { CalendarOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEventStatistics, getEventRegistrationStatistics, getEventStaffStatistics } from '../../../../service/api/statisticsApi'

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
        getEventStatistics(),
        getEventRegistrationStatistics(),
        getEventStaffStatistics()
      ])

      if (eventRes?.success) setEventStats(eventRes.data)
      if (registrationRes?.success) setRegistrationStats(registrationRes.data)
      if (staffRes?.success) setStaffStats(staffRes.data)
    } catch (error) {
      message.error('Không thể tải dữ liệu thống kê sự kiện')
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
  const monthlyCreatedData = eventStats?.monthlyCreated?.map(item => ({
    month: item.month?.substring(5) || item.month,
    count: item.count || 0
  })) || []

  const eventsByStatusData = eventStats?.byStatus ? Object.entries(eventStats.byStatus).map(([name, value]) => ({
    name,
    value
  })) : []

  const checkinTrendData = registrationStats?.checkinTrend?.map(item => ({
    date: item.date,
    count: item.count || 0
  })) || []

  const registrationsByStatusData = registrationStats?.byStatus ? Object.entries(registrationStats.byStatus).map(([name, value]) => ({
    name,
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
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số sự kiện"
              value={eventStats?.totalEvents || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lượt đăng ký"
              value={registrationStats?.totalRegistrations || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng nhân sự phân công"
              value={staffStats?.totalAssignments || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Quản lý cửa hàng"
              value={staffStats?.storeManagers || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tăng trưởng sự kiện theo tháng">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCreatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} name="Số sự kiện" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bố sự kiện theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventsByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Xu hướng check-in theo ngày">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={checkinTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Số check-in" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân bố đăng ký theo trạng thái">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationsByStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Số lượt đăng ký" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Tables Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top sự kiện có nhiều đăng ký nhất">
            <Table
              dataSource={eventStats?.topEventsByRegistration || []}
              columns={topEventsColumns}
              rowKey="eventId"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top người dùng đăng ký nhiều nhất">
            <Table
              dataSource={registrationStats?.topUsers || []}
              columns={topUsersColumns}
              rowKey="userId"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Staff by Event Table */}
      {staffStats?.byEvent && staffStats.byEvent.length > 0 && (
        <Card title="Phân bố nhân sự theo sự kiện">
          <Table
            dataSource={staffStats.byEvent}
            columns={staffByEventColumns}
            rowKey="eventId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  )
}

export default EventStatistics

