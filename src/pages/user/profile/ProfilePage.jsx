/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserOutlined, 
  ShoppingOutlined, 
  EnvironmentOutlined, 
  LockOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { message } from 'antd'
import { getCurrentUserProfile } from '../../../service/api/userApi'
import { getMyRegisteredEvents } from '../../../service/api/eventApi'
import { API_CONFIG } from '../../../service/instance'
import Loading from '../../../components/Loading'
import ProfileHeader from './components/ProfileHeader'
import PersonalInfoTab from './components/PersonalInfoTab'
import OrdersTab from './components/OrdersTab'
import AddressesTab from './components/AddressesTab'
import MyEventsTab from './components/MyEventsTab'
import PasswordTab from './components/PasswordTab'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingMyEvents, setLoadingMyEvents] = useState(false)

  // Dữ liệu người dùng (sẽ được nạp từ API)
  const [userData, setUserData] = useState({
    name: '—',
    email: '—',
    phone: '',
    gender: 'other',
    birthday: '',
    ecoPoints: 0,
    avatar: 'https://i.pravatar.cc/300?img=12'
  })

  const [editedData, setEditedData] = useState(userData)
  const [myEvents, setMyEvents] = useState([])

  // Nạp hồ sơ người dùng từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        const res = await getCurrentUserProfile()
        const data = res?.data || res?.profile || res
        if (!data) return
        setUserData(prev => ({
          ...prev,
          name: data.fullName || data.name || prev.name,
          email: data.email || prev.email,
          phone: data.phoneNumber || prev.phone,
          gender: data.gender || prev.gender,
          birthday: data.dateOfBirth || prev.birthday,
          avatar: data.avatarUrl || prev.avatar,
        }))
        setEditedData(prev => ({
          ...prev,
          name: data.fullName || data.name || prev.name,
          email: data.email || prev.email,
          phone: data.phoneNumber || prev.phone,
          gender: data.gender || prev.gender,
          birthday: data.dateOfBirth || prev.birthday,
          avatar: data.avatarUrl || prev.avatar,
        }))
      } catch {
        message.error('Không tải được hồ sơ người dùng')
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  // Nạp danh sách sự kiện đã đăng ký khi mở tab Sự kiện của tôi
  useEffect(() => {
    const fetchMyEvents = async () => {
      if (activeTab !== 'myEvents') return
      try {
        setLoadingMyEvents(true)
        const res = await getMyRegisteredEvents({ page: 0, size: 12, sortBy: 'createdAt', sortDir: 'DESC' })
        let list = res?.data?.content
        if (!Array.isArray(list)) {
          const possible = res?.data?.data || res?.data || []
          list = Array.isArray(possible) ? possible : []
        }
        const apiRoot = (API_CONFIG?.BASE_URL || '').replace(/\/api\/v1$/i, '')
        const mapped = list.map(ev => {
          const rawImage = ev.imageUrl || ev.thumbnail || ev.thumbnailUrl || ev.image || ''
          const isAbsolute = typeof rawImage === 'string' && /^(http|https):\/\//i.test(rawImage)
          const normalizedImage = (() => {
            if (!rawImage) return ''
            if (isAbsolute) return rawImage
            if (rawImage.startsWith('/api')) return rawImage
            if (apiRoot) return `${apiRoot}${rawImage}`
            return `${API_CONFIG?.BASE_URL || ''}${rawImage}`
          })()
          const isRegistrationModel = ev.eventId && ev.eventName
          return {
            id: isRegistrationModel ? ev.eventId : ev.id,
            title: isRegistrationModel ? ev.eventName : ev.name,
            description: ev.description || '',
            date: ev.startTime || ev.date,
            startTime: ev.startTime || ev.start,
            endTime: ev.endTime || ev.end,
            location: ev.location || '',
            image: normalizedImage,
            attendees: ev.registeredCount || 0,
            maxAttendees: ev.maxParticipants || 0,
            registrationStatus: ev.registrationStatus || 'BOOKED',
            // Thông tin chi tiết từ API
            registrationId: ev.registrationId,
            ticketCode: ev.ticketCode,
            eventCode: ev.eventCode,
            checkInTime: ev.checkInTime,
            active: ev.active
          }
        })
        setMyEvents(mapped)
      } catch {
        setMyEvents([])
      } finally {
        setLoadingMyEvents(false)
      }
    }
    fetchMyEvents()
  }, [activeTab])

  // Mock order history
  const orders = [
    {
      id: '#GL001234',
      date: '2024-11-01',
      items: 3,
      total: '450,000₫',
      status: 'delivered',
      statusText: 'Đã giao hàng'
    },
    {
      id: '#GL001235',
      date: '2024-10-28',
      items: 2,
      total: '320,000₫',
      status: 'shipping',
      statusText: 'Đang vận chuyển'
    },
    {
      id: '#GL001236',
      date: '2024-10-15',
      items: 1,
      total: '180,000₫',
      status: 'processing',
      statusText: 'Đang xử lý'
    }
  ]

  // Mock addresses
  const [addresses] = useState([
    {
      id: 1,
      name: 'Nhà riêng',
      address: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
      phone: '0123 456 789',
      isDefault: true
    },
    {
      id: 2,
      name: 'Văn phòng',
      address: '456 Đường DEF, Phường GHI, Quận 3, TP.HCM',
      phone: '0987 654 321',
      isDefault: false
    }
  ])

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleEdit = () => {
    setIsEditing(true)
    setEditedData(userData)
  }

  const handleSave = () => {
    setUserData(editedData)
    setIsEditing(false)
    message.success('Cập nhật thông tin thành công!')
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    })
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    })
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!')
      return
    }
    message.success('Đổi mật khẩu thành công!')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }


  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingOutlined /> },
    { id: 'addresses', label: 'Địa chỉ', icon: <EnvironmentOutlined /> },
    { id: 'myEvents', label: 'Sự kiện của tôi', icon: <CalendarOutlined /> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <LockOutlined /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Loading profile */}
        {loadingProfile && (
          <Loading message="Đang tải hồ sơ người dùng..." />
        )}

        {/* Profile Header */}
        <ProfileHeader userData={userData} ordersCount={orders.length} />

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <PersonalInfoTab
                  userData={userData}
                  editedData={editedData}
                  isEditing={isEditing}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onInputChange={handleInputChange}
                />
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <OrdersTab orders={orders} />
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <AddressesTab addresses={addresses} />
              )}

              {/* My Events Tab */}
              {activeTab === 'myEvents' && (
                <MyEventsTab myEvents={myEvents} loadingMyEvents={loadingMyEvents} />
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <PasswordTab
                  passwordData={passwordData}
                  onPasswordChange={handlePasswordChange}
                  onChangePassword={handleChangePassword}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

