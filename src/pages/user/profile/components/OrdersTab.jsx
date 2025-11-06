/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion'

const OrdersTab = ({ orders }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipping': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
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
  )
}

export default OrdersTab

