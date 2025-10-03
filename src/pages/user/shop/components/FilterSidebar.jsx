import React from 'react'
import { motion } from 'framer-motion'

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  onClearFilters
}) => {
  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🛍️' },
    { id: 'ao-so-mi', name: 'Áo sơ mi', icon: '👔' },
    { id: 'ao-thun', name: 'Áo thun', icon: '👕' },
    { id: 'quan', name: 'Quần', icon: '👖' },
    { id: 'dam', name: 'Đầm', icon: '👗' },
    { id: 'vay', name: 'Váy', icon: '👗' },
    { id: 'ao-khoac', name: 'Áo khoác', icon: '🧥' },
    { id: 'phu-kien', name: 'Phụ kiện', icon: '👜' },
    { id: 'giay', name: 'Giày', icon: '👟' }
  ]

  const conditions = [
    { value: 'all', label: 'Tất cả tình trạng' },
    { value: 'new', label: 'Như mới' },
    { value: 'used', label: 'Đã qua sử dụng' },
    { value: 'vintage', label: 'Vintage' }
  ]

  const priceRanges = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: '0-100', label: 'Dưới 100k' },
    { value: '100-300', label: '100k - 300k' },
    { value: '300-500', label: '300k - 500k' },
    { value: '500+', label: 'Trên 500k' }
  ]

  return (
    <motion.aside
      className="lg:col-span-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Bộ lọc
        </h2>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-700">Danh mục</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-700">Tình trạng</h3>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition"
          >
            {conditions.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-700">Khoảng giá</h3>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Eco-Friendly Only */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
            />
            <span className="text-gray-700 flex items-center gap-1 group-hover:text-green-600 transition">
              🌿 Chỉ sản phẩm bền vững
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        <motion.button
          onClick={onClearFilters}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Xóa bộ lọc
        </motion.button>
      </div>
    </motion.aside>
  )
}

export default FilterSidebar
