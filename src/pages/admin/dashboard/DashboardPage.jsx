import React from 'react'
import { motion } from 'framer-motion'
import { Card, Row, Col, Statistic, Badge, Timeline, Button } from 'antd'
import { 
  UserOutlined, 
  HeartOutlined, 
  CalendarOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons'

const DashboardPage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Mock data
  const stats = [
    {
      title: 'Tổng người dùng',
      value: 12345,
      change: 12,
      icon: <UserOutlined style={{ color: '#16a34a' }} />
    },
    {
      title: 'Sản phẩm đã quyên góp',
      value: 8967,
      change: 8,
      icon: <HeartOutlined style={{ color: '#16a34a' }} />
    },
    {
      title: 'Sự kiện đang diễn ra',
      value: 23,
      change: 5,
      icon: <CalendarOutlined style={{ color: '#16a34a' }} />
    },
    {
      title: 'Điểm sinh thái đã trao',
      value: 156789,
      change: 15,
      icon: <DollarOutlined style={{ color: '#16a34a' }} />
    }
  ]

  const recentActivities = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      action: 'đã quyên góp áo khoác',
      time: '2 phút trước',
      type: 'donation'
    },
    {
      id: 2,
      user: 'Trần Thị B',
      action: 'đã đăng ký sự kiện "Trao đổi quần áo"',
      time: '5 phút trước',
      type: 'event'
    },
    {
      id: 3,
      user: 'Lê Văn C',
      action: 'đã mua sản phẩm từ cửa hàng',
      time: '10 phút trước',
      type: 'purchase'
    },
    {
      id: 4,
      user: 'Phạm Thị D',
      action: 'đã tham gia cộng đồng',
      time: '15 phút trước',
      type: 'join'
    }
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp}>
        <Card 
          style={{ 
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            border: 'none',
            borderRadius: '12px'
          }}
        >
          <div style={{ color: 'white' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>
              Chào mừng trở lại, Admin!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
              Hôm nay có {recentActivities.length} hoạt động mới trong hệ thống GreenLoop
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={staggerContainer}>
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div variants={fadeInUp}>
                <Card hoverable>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    suffix={
                      <div style={{ fontSize: '14px', color: '#16a34a', fontWeight: 500 }}>
                        <ArrowUpOutlined /> +{stat.change}%
                      </div>
                    }
                    valueStyle={{ color: '#111827' }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    so với tháng trước
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* Charts and Recent Activities */}
      <Row gutter={[16, 16]}>
        {/* Chart Placeholder */}
        <Col xs={24} lg={12}>
          <motion.div variants={fadeInUp}>
            <Card title="Thống kê hoạt động" hoverable>
              <div style={{ 
                height: '256px', 
                background: '#f9fafb', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <FileTextOutlined style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '16px' }} />
                  <p style={{ color: '#6b7280', margin: 0 }}>Biểu đồ thống kê sẽ được hiển thị tại đây</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <motion.div variants={fadeInUp}>
            <Card 
              title="Hoạt động gần đây" 
              hoverable
              extra={
                <Button type="link" style={{ color: '#16a34a' }}>
                  Xem tất cả
                </Button>
              }
            >
              <Timeline
                items={recentActivities.map((activity) => ({
                  color: activity.type === 'donation' ? 'green' :
                         activity.type === 'event' ? 'blue' :
                         activity.type === 'purchase' ? 'purple' : 'orange',
                  children: (
                    <div>
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        <strong>{activity.user}</strong> {activity.action}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                        {activity.time}
                      </p>
                    </div>
                  )
                }))}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp}>
        <Card title="Thao tác nhanh" hoverable>
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <Button 
                type="dashed" 
                block 
                style={{ 
                  height: '80px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <PlusOutlined style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '12px' }}>Thêm người dùng</span>
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button 
                type="dashed" 
                block 
                style={{ 
                  height: '80px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <CalendarOutlined style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '12px' }}>Tạo sự kiện</span>
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button 
                type="dashed" 
                block 
                style={{ 
                  height: '80px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FileTextOutlined style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '12px' }}>Xuất báo cáo</span>
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button 
                type="dashed" 
                block 
                style={{ 
                  height: '80px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <SettingOutlined style={{ fontSize: '24px' }} />
                <span style={{ fontSize: '12px' }}>Cài đặt</span>
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage
