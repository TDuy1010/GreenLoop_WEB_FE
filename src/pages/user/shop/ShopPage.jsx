import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ItemsCard from './components/ItemsCard'
import FilterSidebar from './components/FilterSidebar'

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('all')
    setSelectedCondition('all')
    setPriceRange('all')
  }

  // Mock data - replace with API call
  const items = [
    {
      id: 1,
      name: 'Áo sơ mi trắng công sở',
      category: 'Áo sơ mi',
      price: 150000,
      originalPrice: 300000,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      condition: 'Như mới',
      size: 'M',
      isNew: true,
      discount: 50,
      isEcoFriendly: true,
      ecoPoints: 50,
      rating: 4.8,
      sold: 45
    },
    {
      id: 2,
      name: 'Áo thun basic cotton',
      category: 'Áo thun',
      price: 89000,
      originalPrice: 150000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      condition: 'Đã qua sử dụng',
      size: 'L',
      isEcoFriendly: true,
      ecoPoints: 30,
      rating: 4.9,
      sold: 120
    },
    {
      id: 3,
      name: 'Quần jean slim fit',
      category: 'Quần',
      price: 250000,
      originalPrice: 500000,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      condition: 'Như mới',
      size: '30',
      discount: 50,
      isEcoFriendly: true,
      ecoPoints: 70,
      rating: 4.7,
      sold: 78
    },
    {
      id: 4,
      name: 'Đầm dạ hội sang trọng',
      category: 'Đầm',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400',
      condition: 'Như mới',
      size: 'S',
      isNew: true,
      isEcoFriendly: true,
      ecoPoints: 100,
      rating: 5.0,
      sold: 23
    },
    {
      id: 5,
      name: 'Áo khoác hoodie unisex',
      category: 'Áo khoác',
      price: 180000,
      originalPrice: 350000,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      condition: 'Đã qua sử dụng',
      size: 'XL',
      discount: 48,
      isEcoFriendly: true,
      ecoPoints: 60,
      rating: 4.6,
      sold: 95
    },
    {
      id: 6,
      name: 'Váy midi hoa nhí',
      category: 'Váy',
      price: 220000,
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
      condition: 'Như mới',
      size: 'M',
      isEcoFriendly: true,
      ecoPoints: 55,
      rating: 4.8,
      sold: 67
    },
    {
      id: 7,
      name: 'Túi xách tote vải canvas',
      category: 'Phụ kiện',
      price: 120000,
      originalPrice: 200000,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
      condition: 'Như mới',
      discount: 40,
      isNew: true,
      isEcoFriendly: true,
      ecoPoints: 40,
      rating: 4.9,
      sold: 156
    },
    {
      id: 8,
      name: 'Giày sneaker trắng',
      category: 'Giày',
      price: 350000,
      originalPrice: 700000,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      condition: 'Đã qua sử dụng',
      size: '42',
      discount: 50,
      isEcoFriendly: true,
      ecoPoints: 80,
      rating: 4.7,
      sold: 89
    }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-low', label: 'Giá thấp đến cao' },
    { value: 'price-high', label: 'Giá cao đến thấp' },
    { value: 'popular', label: 'Phổ biến nhất' }
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <motion.div 
        className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 
            className="text-4xl font-bold mb-2"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            Cửa hàng đồ cũ bền vững
          </motion.h1>
          <motion.p 
            className="text-green-100 text-lg"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Mua sắm thông minh, bảo vệ môi trường - Hơn 1000+ sản phẩm chất lượng
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onClearFilters={handleClearFilters}
          />

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold text-green-600">{items.length}</span> sản phẩm
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <button className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {items.map((item) => (
                <ItemsCard key={item.id} item={item} />
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div 
              className="mt-8 flex justify-center items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Trước
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">3</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Sau
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage