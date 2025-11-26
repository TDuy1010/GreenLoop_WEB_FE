import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ItemsCard from './components/ItemsCard'
import FilterSidebar from './components/FilterSidebar'
import { sortOptions } from '../../../data/mockData'
import { getProducts } from '../../../service/api/productApi'
import { getAllCategories } from '../../../service/api/categoryApi'

const ShopPage = () => {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')

  // Data states
  const [products, setProducts] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(12)

  const normalizeCategoryResponse = (response) => {
    const candidate = Array.isArray(response?.data?.data)
      ? response.data.data
      : Array.isArray(response?.data?.content)
        ? response.data.content
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

    return candidate.map((item, index) => {
      const rawId = item.id ?? item.categoryId ?? item.code ?? index
      return {
        id: String(rawId),
        value: rawId,
        name: item.name || item.categoryName || `Danh mục ${index + 1}`,
        description: item.description || ''
      }
    })
  }

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true)
      const response = await getAllCategories()

      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể tải danh mục')
      }

      const parsed = normalizeCategoryResponse(response)
      setCategoryOptions(parsed)
    } catch (err) {
      console.error('❌ Error fetching categories:', err)
    } finally {
      setCategoryLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build API params
      const params = {
        page: currentPage,
        size: pageSize,
        status: 'AVAILABLE' // Chỉ lấy sản phẩm đang có sẵn
      }

      // Apply filters
      if (searchTerm) {
        params.search = searchTerm
      }

      if (selectedCategory !== 'all') {
        const matchedCategory = categoryOptions.find(
          (cat) => String(cat.id) === String(selectedCategory)
        )
        const categoryId = matchedCategory?.value ?? matchedCategory?.id ?? selectedCategory
        params.categoryId = categoryId
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          params.sortBy = 'createdAt'
          params.sortDir = 'DESC'
          break
        case 'price-low':
          params.sortBy = 'price'
          params.sortDir = 'ASC'
          break
        case 'price-high':
          params.sortBy = 'price'
          params.sortDir = 'DESC'
          break
        case 'popular':
          params.sortBy = 'name'
          params.sortDir = 'ASC'
          break
        default:
          params.sortBy = 'createdAt'
          params.sortDir = 'DESC'
      }

      console.log('🔍 Fetching products with params:', params)

      const response = await getProducts(params)
      
      console.log('✅ Products response:', response)

      if (response.success && response.data) {
        const filteredContent = (response.data.content || []).filter(
          (product) => product.status !== 'SOLD'
        )
        setProducts(filteredContent)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err)
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch products when filters or pagination change
  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, searchTerm, selectedCategory])

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('all')
    setSelectedCondition('all')
    setPriceRange('all')
    setSearchTerm('')
    setCurrentPage(0)
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Transform API data to match ItemsCard component format
  const items = products.map((product) => {
    const imageUrl =
      Array.isArray(product.imageUrls) && product.imageUrls.length > 0
        ? product.imageUrls[0]?.productAssetUrl ||
          product.imageUrls[0]?.url ||
          product.imageUrls[0]
        : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'

    let conditionLabel = 'Đã qua sử dụng'
    if (product.conditionGrade === 'LIKE_NEW') conditionLabel = 'Như mới'
    else if (product.conditionGrade === 'GOOD') conditionLabel = 'Tốt'
    else if (product.conditionGrade === 'FAIR') conditionLabel = 'Khá'
    else if (product.conditionGrade === 'NEW') conditionLabel = 'Mới 100%'

    return {
      id: product.id,
      name: product.name,
      category: product.categoryName,
      price: product.price,
      image: imageUrl,
      condition: conditionLabel,
      isEcoFriendly: true,
      ecoPoints: product.ecoPointValue,
      rating: 4.5, // Default rating
      sold: 0 // Default sold count
    }
  })

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
            categories={categoryOptions}
            categoryLoading={categoryLoading}
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
                <span className="font-semibold text-green-600">{totalElements}</span> sản phẩm
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

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-semibold mb-2">Đã có lỗi xảy ra</p>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && items.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600 font-semibold text-lg mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && items.length > 0 && (
              <>
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
                {totalPages > 1 && (
                  <motion.div 
                    className="mt-8 space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Page Info */}
                    <div className="text-center text-sm text-gray-600">
                      Trang <span className="font-semibold text-green-600">{currentPage + 1}</span> / {totalPages}
                      <span className="mx-2">•</span>
                      Hiển thị {items.length} trên {totalElements} sản phẩm
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      {/* First Page Button */}
                      <button
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
                        className={`px-3 py-2 border rounded-lg transition hidden sm:flex items-center gap-1 ${
                          currentPage === 0
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Trang đầu"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        <span className="hidden md:inline">Đầu</span>
                      </button>

                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 border rounded-lg transition flex items-center gap-2 ${
                          currentPage === 0
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Trước</span>
                      </button>

                      {/* Page Numbers with Smart Display */}
                      {(() => {
                        const pages = [];
                        const showEllipsisStart = currentPage > 2;
                        const showEllipsisEnd = currentPage < totalPages - 3;

                        // Always show first page
                        if (totalPages > 0) {
                          pages.push(
                            <button
                              key={0}
                              onClick={() => handlePageChange(0)}
                              className={`px-4 py-2 rounded-lg font-semibold transition hidden sm:block ${
                                currentPage === 0
                                  ? 'bg-green-600 text-white shadow-lg'
                                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              1
                            </button>
                          );
                        }

                        // Show ellipsis after first page
                        if (showEllipsisStart) {
                          pages.push(
                            <span key="ellipsis-start" className="px-2 text-gray-400 hidden sm:inline">
                              ...
                            </span>
                          );
                        }

                        // Show pages around current page
                        const startPage = Math.max(1, currentPage - 1);
                        const endPage = Math.min(totalPages - 2, currentPage + 1);

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`px-4 py-2 rounded-lg font-semibold transition ${
                                currentPage === i
                                  ? 'bg-green-600 text-white shadow-lg'
                                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {i + 1}
                            </button>
                          );
                        }

                        // Show ellipsis before last page
                        if (showEllipsisEnd) {
                          pages.push(
                            <span key="ellipsis-end" className="px-2 text-gray-400 hidden sm:inline">
                              ...
                            </span>
                          );
                        }

                        // Always show last page
                        if (totalPages > 1) {
                          pages.push(
                            <button
                              key={totalPages - 1}
                              onClick={() => handlePageChange(totalPages - 1)}
                              className={`px-4 py-2 rounded-lg font-semibold transition hidden sm:block ${
                                currentPage === totalPages - 1
                                  ? 'bg-green-600 text-white shadow-lg'
                                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {totalPages}
                            </button>
                          );
                        }

                        return pages;
                      })()}

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`px-4 py-2 border rounded-lg transition flex items-center gap-2 ${
                          currentPage === totalPages - 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>Sau</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Last Page Button */}
                      <button
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage === totalPages - 1}
                        className={`px-3 py-2 border rounded-lg transition hidden sm:flex items-center gap-1 ${
                          currentPage === totalPages - 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Trang cuối"
                      >
                        <span className="hidden md:inline">Cuối</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Mobile: Simple page selector */}
                    <div className="sm:hidden">
                      <select
                        value={currentPage}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      >
                        {Array.from({ length: totalPages }, (_, i) => (
                          <option key={i} value={i}>
                            Trang {i + 1} / {totalPages}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage