import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircleOutlined, HomeOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { logoutFromServer, logoutUser } from '../service/api/authApi'

const PasswordChangeSuccessModal = ({ show, onClose, userType = 'customer' }) => {
  const navigate = useNavigate()

  if (!show) return null

  const handleGoHome = () => {
    onClose()
    if (userType === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutFromServer()
      message.success('Đăng xuất thành công!')
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback to client logout
      logoutUser()
      message.warning('Đã đăng xuất khỏi thiết bị này')
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon thành công với animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-green-100 rounded-full p-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <CheckCircleOutlined className="text-6xl text-green-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Tiêu đề */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 text-center mb-3"
          >
            Đổi mật khẩu thành công!
          </motion.h2>

          {/* Mô tả */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-center mb-6"
          >
            Mật khẩu của bạn đã được cập nhật thành công. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.
          </motion.p>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg shadow-green-600/30"
            >
              {userType === 'admin' ? <DashboardOutlined /> : <HomeOutlined />}
              {userType === 'admin' ? 'Về Dashboard' : 'Về trang chủ'}
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg shadow-red-600/30"
            >
              <LogoutOutlined />
              Đăng xuất
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default PasswordChangeSuccessModal

