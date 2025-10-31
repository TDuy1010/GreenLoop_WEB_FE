import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserOutlined, 
  ShoppingOutlined, 
  EnvironmentOutlined, 
  LockOutlined,
  EditOutlined,
  CameraOutlined,
  TrophyOutlined,
  HeartOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { message } from 'antd'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123 456 789',
    gender: 'male',
    birthday: '1990-01-01',
    ecoPoints: 1250,
    avatar: 'https://i.pravatar.cc/300?img=12'
  })

  const [editedData, setEditedData] = useState(userData)

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
  const [addresses, setAddresses] = useState([
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipping': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingOutlined /> },
    { id: 'addresses', label: 'Địa chỉ', icon: <EnvironmentOutlined /> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <LockOutlined /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <motion.div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.button 
                className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CameraOutlined className="text-lg" />
              </motion.button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <p className="text-gray-600 mb-4">{userData.email}</p>
              
              {/* Eco Points Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <TrophyOutlined className="text-2xl" />
                <div>
                  <p className="text-sm opacity-90">Eco Points</p>
                  <p className="text-2xl font-bold">{userData.ecoPoints}</p>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <ShoppingOutlined className="text-3xl text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-sm text-gray-600">Đơn hàng</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <HeartOutlined className="text-3xl text-pink-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Yêu thích</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <motion.button
                        onClick={handleEdit}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <EditOutlined /> Chỉnh sửa
                      </motion.button>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleSave}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SaveOutlined /> Lưu
                        </motion.button>
                        <motion.button
                          onClick={handleCancel}
                          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CloseOutlined /> Hủy
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={isEditing ? editedData.name : userData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={isEditing ? editedData.email : userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={isEditing ? editedData.phone : userData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={isEditing ? editedData.birthday : userData.birthday}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 transition"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={(isEditing ? editedData.gender : userData.gender) === 'male'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span>Nam</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={(isEditing ? editedData.gender : userData.gender) === 'female'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span>Nữ</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={(isEditing ? editedData.gender : userData.gender) === 'other'}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span>Khác</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đơn hàng</h2>
                  
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.statusText}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Ngày đặt:</span> {new Date(order.date).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">Số sản phẩm:</span> {order.items} món
                            </p>
                          </div>
                          
                          <div className="text-left md:text-right">
                            <p className="text-2xl font-bold text-green-600 mb-2">{order.total}</p>
                            <motion.button
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Xem chi tiết
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Địa chỉ của tôi</h2>
                    <motion.button
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-xl">+</span> Thêm địa chỉ mới
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((addr, index) => (
                      <motion.div
                        key={addr.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition relative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {addr.isDefault && (
                          <span className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Mặc định
                          </span>
                        )}
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{addr.name}</h3>
                        <p className="text-gray-700 mb-2">
                          <EnvironmentOutlined className="mr-2" />
                          {addr.address}
                        </p>
                        <p className="text-gray-700 mb-4">
                          <UserOutlined className="mr-2" />
                          {addr.phone}
                        </p>
                        
                        <div className="flex gap-3">
                          <motion.button
                            className="text-green-600 hover:text-green-700 font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            <EditOutlined /> Chỉnh sửa
                          </motion.button>
                          {!addr.isDefault && (
                            <>
                              <span className="text-gray-300">|</span>
                              <motion.button
                                className="text-red-600 hover:text-red-700 font-medium"
                                whileHover={{ scale: 1.05 }}
                              >
                                Xóa
                              </motion.button>
                              <span className="text-gray-300">|</span>
                              <motion.button
                                className="text-blue-600 hover:text-blue-700 font-medium"
                                whileHover={{ scale: 1.05 }}
                              >
                                Đặt làm mặc định
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
                  
                  <form onSubmit={handleChangePassword} className="max-w-md">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          placeholder="Nhập mật khẩu hiện tại"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          placeholder="Nhập mật khẩu mới"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          placeholder="Nhập lại mật khẩu mới"
                          required
                        />
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LockOutlined /> Đổi mật khẩu
                      </motion.button>
                    </div>
                  </form>

                  {/* Password Tips */}
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-3">Lưu ý khi đổi mật khẩu:</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Mật khẩu phải có ít nhất 8 ký tự</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>Không sử dụng mật khẩu quá đơn giản hoặc dễ đoán</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

