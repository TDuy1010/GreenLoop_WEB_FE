import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getEventProductMappingStatistics } from '../../../../service/api/statisticsApi'

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
      <div className="flex justify-center items-center h-64">
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
    <div className="space-y-6">
      {/* KPI Card */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số mapping"
              value={stats?.totalMappings || 0}
              prefix={<LinkOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố mapping theo trạng thái">
            {mappingsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mappingsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mappingsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} mapping`, 'Số lượng']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Chưa có dữ liệu
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Số lượng sản phẩm theo sự kiện">
            {eventProductCountsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventProductCountsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="eventId" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="productCount" fill="#3b82f6" name="Số lượng sản phẩm" />
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

      {/* Event Product Counts Table */}
      {eventProductCountsData.length > 0 ? (
        <Card title="Chi tiết số lượng sản phẩm theo sự kiện">
          <Table
            dataSource={eventProductCountsData}
            columns={eventProductColumns}
            rowKey="eventId"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ) : (
        <Card title="Chi tiết số lượng sản phẩm theo sự kiện">
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Chưa có dữ liệu mapping sản phẩm-sự kiện
          </div>
        </Card>
      )}
    </div>
  )
}

export default EventProductMappingStatistics

