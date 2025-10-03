import React from 'react'
import { motion } from 'framer-motion'

const ItemsCard = ({ item }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-64 bg-gray-100">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MỚI
            </span>
          )}
          {item.discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{item.discount}%
            </span>
          )}
          {item.isEcoFriendly && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              🌿 Bền vững
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.button
            className="bg-white p-2 rounded-full shadow-md hover:bg-green-50 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Yêu thích"
          >
            <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.button>
          <motion.button
            className="bg-white p-2 rounded-full shadow-md hover:bg-green-50 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Xem nhanh"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
        </div>

        {/* Eco Points Badge */}
        {item.ecoPoints && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs font-semibold text-green-600">+{item.ecoPoints} điểm</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{item.category}</p>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-green-600 transition cursor-pointer">
          {item.name}
        </h3>

        {/* Condition */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {item.condition}
          </span>
          {item.size && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              Size: {item.size}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {item.originalPrice && (
              <span className="text-sm text-gray-400 line-through mr-2">
                {item.originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
            <span className="text-xl font-bold text-green-600">
              {item.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

    
        {/* Add to Cart Button */}
        <motion.button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Thêm vào giỏ
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ItemsCard
