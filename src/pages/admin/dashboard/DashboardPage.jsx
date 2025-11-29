import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Tabs, Row, Col, Statistic, Badge } from 'antd'
import { 
  CalendarOutlined,
  ShoppingOutlined,
  DollarOutlined,
  GiftOutlined,
  HeartOutlined,
  LinkOutlined,
  DashboardOutlined,
  ArrowRightOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import EventStatistics from './components/EventStatistics'
import ProductStatistics from './components/ProductStatistics'
import EcoPointStatistics from './components/EcoPointStatistics'
import VoucherStatistics from './components/VoucherStatistics'
import DonationStatistics from './components/DonationStatistics'
import EventProductMappingStatistics from './components/EventProductMappingStatistics'

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

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

  const moduleCards = [
    {
      key: 'events',
      title: 'Sự kiện',
      icon: CalendarOutlined,
      color: '#16a34a',
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      borderColor: '#86efac',
      description: 'Quản lý và theo dõi sự kiện'
    },
    {
      key: 'products',
      title: 'Sản phẩm',
      icon: ShoppingOutlined,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      borderColor: '#93c5fd',
      description: 'Thống kê sản phẩm và danh mục'
    },
    {
      key: 'ecopoints',
      title: 'Điểm Sinh Thái',
      icon: DollarOutlined,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderColor: '#fcd34d',
      description: 'Theo dõi điểm tích lũy và giao dịch'
    },
    {
      key: 'vouchers',
      title: 'Phiếu Giảm Giá',
      icon: GiftOutlined,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%)',
      borderColor: '#c4b5fd',
      description: 'Quản lý voucher và chiến dịch'
    },
    {
      key: 'donations',
      title: 'Quyên góp',
      icon: HeartOutlined,
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
      borderColor: '#f9a8d4',
      description: 'Thống kê quyên góp và sản phẩm'
    },
    {
      key: 'mappings',
      title: 'Liên kết Sản phẩm-Sự kiện',
      icon: LinkOutlined,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      borderColor: '#fca5a5',
      description: 'Quản lý liên kết sản phẩm và sự kiện'
    }
  ]

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DashboardOutlined style={{ fontSize: '16px' }} /> Tổng quan
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Quick Stats Grid */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#1e293b' }}>
              Truy cập nhanh
            </h3>
            <Row gutter={[20, 20]}>
              {moduleCards.map((module, index) => {
                const IconComponent = module.icon
                return (
                  <Col xs={24} sm={12} lg={8} xl={8} key={module.key}>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        hoverable
                        onClick={() => setActiveTab(module.key)}
                        style={{
                          background: module.gradient,
                          border: `2px solid ${module.borderColor}`,
                          borderRadius: '16px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          height: '100%'
                        }}
                        bodyStyle={{ padding: '24px' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '12px',
                              background: 'rgba(255, 255, 255, 0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '28px',
                              color: module.color
                            }}>
                              <IconComponent />
                            </div>
                            <ArrowRightOutlined style={{ fontSize: '20px', color: module.color, opacity: 0.7 }} />
                          </div>
                          <div>
                            <h4 style={{ 
                              fontSize: '18px', 
                              fontWeight: 600, 
                              marginBottom: '8px', 
                              color: '#1e293b' 
                            }}>
                              {module.title}
                            </h4>
                            <p style={{ 
                              fontSize: '14px', 
                              color: '#64748b', 
                              margin: 0,
                              lineHeight: '1.5'
                            }}>
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                )
              })}
            </Row>
          </div>

          {/* Statistics Overview */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#1e293b' }}>
              Thống kê tổng quan
            </h3>
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CalendarOutlined style={{ fontSize: '32px', color: '#16a34a', marginBottom: '12px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                      Sự kiện
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      Quản lý sự kiện và đăng ký
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <ShoppingOutlined style={{ fontSize: '32px', color: '#3b82f6', marginBottom: '12px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                      Sản phẩm
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      Thống kê sản phẩm và danh mục
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <DollarOutlined style={{ fontSize: '32px', color: '#f59e0b', marginBottom: '12px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                      EcoPoint
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      Điểm tích lũy và giao dịch
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <GiftOutlined style={{ fontSize: '32px', color: '#8b5cf6', marginBottom: '12px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                      Voucher
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      Quản lý voucher và chiến dịch
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      )
    },
    {
      key: 'events',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined style={{ fontSize: '16px' }} /> Sự kiện
        </span>
      ),
      children: <EventStatistics />
    },
    {
      key: 'products',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingOutlined style={{ fontSize: '16px' }} /> Sản phẩm
        </span>
      ),
      children: <ProductStatistics />
    },
    {
      key: 'ecopoints',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarOutlined style={{ fontSize: '16px' }} /> Điểm Sinh Thái
        </span>
      ),
      children: <EcoPointStatistics />
    },
    {
      key: 'vouchers',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GiftOutlined style={{ fontSize: '16px' }} /> Phiếu Giảm Giá
        </span>
      ),
      children: <VoucherStatistics />
    },
    {
      key: 'donations',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartOutlined style={{ fontSize: '16px' }} /> Quyên góp
        </span>
      ),
      children: <DonationStatistics />
    },
    {
      key: 'mappings',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LinkOutlined style={{ fontSize: '16px' }} /> Liên kết Sản phẩm-Sự kiện
        </span>
      ),
      children: <EventProductMappingStatistics />
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1800px', margin: '0 auto' }}
      >
        {/* Welcome Section */}
        <motion.div variants={fadeInUp}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.25)',
              overflow: 'hidden',
              position: 'relative'
            }}
            bodyStyle={{ padding: '40px' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '300px', 
              height: '300px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '50%', 
              transform: 'translate(30%, -30%)',
              filter: 'blur(40px)'
            }} />
            <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <DashboardOutlined />
              </div>
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: 'white', margin: 0 }}>
                  Chào mừng trở lại, Admin!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.95)', margin: 0, fontSize: '17px', fontWeight: 400 }}>
                  Dashboard thống kê toàn diện hệ thống GreenLoop
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Statistics Tabs */}
        <motion.div variants={fadeInUp}>
          <Card
            style={{
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: 'none',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '0' }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
              type="line"
              style={{
                padding: '0 24px'
              }}
              tabBarStyle={{
                marginBottom: '0',
                paddingTop: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}
            />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
