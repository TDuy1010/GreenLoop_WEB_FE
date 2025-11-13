import React from 'react'
import { motion } from 'framer-motion'
import { UserOutlined, CameraOutlined, CrownOutlined } from '@ant-design/icons'

const ProfileHeader = ({ userData, loading }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-2xl p-8 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserOutlined className="text-6xl text-green-600" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 bg-white text-green-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition">
            <CameraOutlined />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold text-white">
              {loading ? '...' : userData.fullName}
            </h1>
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <CrownOutlined /> Admin
            </span>
          </div>
          <p className="text-green-100 text-lg mb-1">{userData.email}</p>
          {userData.phoneNumber && (
            <p className="text-green-200">{userData.phoneNumber}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">∞</div>
            <div className="text-green-100 text-sm">Quyền hạn</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">✓</div>
            <div className="text-green-100 text-sm">Đã xác thực</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileHeader

