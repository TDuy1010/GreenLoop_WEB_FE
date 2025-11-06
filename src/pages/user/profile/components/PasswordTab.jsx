/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { LockOutlined } from '@ant-design/icons'

const PasswordTab = ({ passwordData, onPasswordChange, onChangePassword }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
      
      <form onSubmit={onChangePassword} className="max-w-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
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
              onChange={(e) => onPasswordChange('newPassword', e.target.value)}
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
              onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
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
  )
}

export default PasswordTab

