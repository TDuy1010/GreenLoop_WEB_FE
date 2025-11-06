/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'
import { EnvironmentOutlined, UserOutlined, EditOutlined } from '@ant-design/icons'

const AddressesTab = ({ addresses }) => {
  return (
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
  )
}

export default AddressesTab

