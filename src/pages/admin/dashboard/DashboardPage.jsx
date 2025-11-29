import React from 'react'
import { motion } from 'framer-motion'
import { Card, Tabs } from 'antd'
import { 
  CalendarOutlined,
  ShoppingOutlined,
  DollarOutlined,
  GiftOutlined,
  HeartOutlined,
  LinkOutlined
} from '@ant-design/icons'
import EventStatistics from './components/EventStatistics'
import ProductStatistics from './components/ProductStatistics'
import EcoPointStatistics from './components/EcoPointStatistics'
import VoucherStatistics from './components/VoucherStatistics'
import DonationStatistics from './components/DonationStatistics'
import EventProductMappingStatistics from './components/EventProductMappingStatistics'

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

  const tabItems = [
    {
      key: 'events',
      label: (
        <span>
          <CalendarOutlined /> Sự kiện
        </span>
      ),
      children: <EventStatistics />
    },
    {
      key: 'products',
      label: (
        <span>
          <ShoppingOutlined /> Sản phẩm
        </span>
      ),
      children: <ProductStatistics />
    },
    {
      key: 'ecopoints',
      label: (
        <span>
          <DollarOutlined /> Điểm Sinh Thái
        </span>
      ),
      children: <EcoPointStatistics />
    },
    {
      key: 'vouchers',
      label: (
        <span>
          <GiftOutlined /> Phiếu Giảm Giá
        </span>
      ),
      children: <VoucherStatistics />
    },
    {
      key: 'donations',
      label: (
        <span>
          <HeartOutlined /> Quyên góp
        </span>
      ),
      children: <DonationStatistics />
    },
    {
      key: 'mappings',
      label: (
        <span>
          <LinkOutlined /> Liên kết Sản phẩm-Sự kiện
        </span>
      ),
      children: <EventProductMappingStatistics />
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
              Dashboard thống kê toàn diện hệ thống GreenLoop
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Statistics Tabs */}
      <motion.div variants={fadeInUp}>
        <Card>
          <Tabs
            defaultActiveKey="events"
            items={tabItems}
            size="large"
            type="card"
          />
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage
