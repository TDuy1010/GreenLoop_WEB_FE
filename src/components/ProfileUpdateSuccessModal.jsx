import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons'

const ProfileUpdateSuccessModal = ({ show, onClose }) => {
  if (!show) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
        onClick={onClose}
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
          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </button>

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
            Cập nhật thành công!
          </motion.h2>

          {/* Mô tả */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-center mb-6"
          >
            Thông tin cá nhân của bạn đã được cập nhật thành công. Các thay đổi đã có hiệu lực ngay lập tức.
          </motion.p>

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg shadow-green-600/30"
          >
            <CheckCircleOutlined />
            Đã hiểu
          </motion.button>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-t-2xl"></div>
        </motion.div>
      </div>
    </>
  )
}

export default ProfileUpdateSuccessModal

