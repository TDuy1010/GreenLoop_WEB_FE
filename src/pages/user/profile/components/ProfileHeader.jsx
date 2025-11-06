/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { 
  CameraOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  HeartOutlined
} from '@ant-design/icons'

const ProfileHeader = ({ userData, ordersCount }) => {
  return (
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
            <p className="text-2xl font-bold text-gray-900">{ordersCount}</p>
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
  )
}

export default ProfileHeader

