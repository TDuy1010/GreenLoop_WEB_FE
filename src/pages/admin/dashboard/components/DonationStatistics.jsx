import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Spin, message } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getDonationStatistics } from '../../../../service/api/statisticsApi'

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
      <div className="flex justify-center items-center h-64">
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
    <div className="space-y-6">
      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số lượt quyên góp"
              value={stats?.totalDonations || 0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm quyên góp"
              value={stats?.totalDonationItems || 0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bố donation item theo trạng thái">
            {itemsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={itemsByStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {itemsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
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
          <Card title="Phân bố donation item theo tình trạng">
            {itemsByConditionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={itemsByConditionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                  <Legend />
                  <Bar dataKey="value" fill="#f59e0b" name="Số lượng" />
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
    </div>
  )
}

export default DonationStatistics

