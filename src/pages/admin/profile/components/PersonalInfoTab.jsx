import React from 'react'
import { motion } from 'framer-motion'
import { 
  UserOutlined, 
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons'

const PersonalInfoTab = ({ 
  userData, 
  editedData, 
  isEditing, 
  savingProfile,
  onEdit,
  onSave,
  onCancel,
  onInputChange 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        {!isEditing ? (
          <motion.button
            onClick={onEdit}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EditOutlined /> Chỉnh sửa
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              onClick={onSave}
              disabled={savingProfile}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SaveOutlined /> {savingProfile ? 'Đang lưu...' : 'Lưu'}
            </motion.button>
            <motion.button
              onClick={onCancel}
              disabled={savingProfile}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
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
            Họ và tên *
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <UserOutlined />
            </span>
            <input
              type="text"
              value={isEditing ? editedData.fullName : userData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (không thể thay đổi)
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MailOutlined />
            </span>
            <input
              type="email"
              value={userData.email}
              disabled
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <PhoneOutlined />
            </span>
            <input
              type="tel"
              value={isEditing ? editedData.phoneNumber : userData.phoneNumber}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 transition"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <CalendarOutlined />
            </span>
            <input
              type="date"
              value={isEditing ? (editedData.dateOfBirth || '1980-01-01') : (userData.dateOfBirth || '1980-01-01')}
              onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 transition"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới tính
          </label>
          <div className="inline-flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'male', label: 'Nam' },
              { key: 'female', label: 'Nữ' },
              { key: 'other', label: 'Khác' },
            ].map((g) => {
              const current = isEditing ? editedData.gender : userData.gender
              const active = current === g.key
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => isEditing && onInputChange('gender', g.key)}
                  className={`${active ? 'bg-white shadow text-green-700 font-medium' : 'text-gray-600'} px-6 py-2 rounded-lg transition`}
                  disabled={!isEditing}
                >
                  {g.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PersonalInfoTab

