import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        {/* 404 Header */}
        <h1 className="text-7xl font-bold text-green-600">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">Trang đang được phát triển</h2>

        {/* Description */}
        <p className="text-gray-500 max-w-md mx-auto">
          Chúng tôi đang hoàn thiện chức năng này để mang đến trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4 flex-col sm:flex-row">
          <Link to="/">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Về trang chủ
            </button>
          </Link>
          <Link to="/shop">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-green-400 hover:text-green-700 transition">
              Khám phá cửa hàng
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default ErrorPage
