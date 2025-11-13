import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LockOutlined, SafetyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

// Component PasswordInput nội bộ
const PasswordInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error,
  required = true,
  minLength
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
          error ? 'text-red-400' : 'text-gray-400'
        }`}>
          <LockOutlined />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg transition ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : value && !error
              ? 'border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent'
          }`}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

const ChangePasswordTab = ({ 
  passwordData,
  passwordErrors,
  changingPassword,
  onPasswordChange,
  onSubmit
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
      
      <form onSubmit={onSubmit} className="max-w-md">
        <div className="space-y-6">
          <PasswordInput
            label="Mật khẩu hiện tại"
            value={passwordData.currentPassword}
            onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            error={passwordErrors.currentPassword}
            required
          />

          <PasswordInput
            label="Mật khẩu mới"
            value={passwordData.newPassword}
            onChange={(e) => onPasswordChange('newPassword', e.target.value)}
            placeholder="Nhập mật khẩu mới"
            error={passwordErrors.newPassword}
            required
            minLength={6}
          />

          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={passwordData.confirmPassword}
            onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            error={passwordErrors.confirmPassword}
            required
          />

          <motion.button
            type="submit"
            disabled={changingPassword}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LockOutlined /> {changingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </motion.button>
        </div>
      </form>

      {/* Password Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <SafetyOutlined /> Lưu ý khi đổi mật khẩu:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Mật khẩu phải có ít nhất 6 ký tự</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Không sử dụng mật khẩu quá đơn giản hoặc dễ đoán</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Đổi mật khẩu định kỳ để bảo mật tài khoản</span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

export default ChangePasswordTab

