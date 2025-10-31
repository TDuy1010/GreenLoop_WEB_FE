import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchText, setSearchText] = useState('')

  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: '5 Cách Đơn Giản Để Sống Bền Vững Hơn Mỗi Ngày',
      excerpt: 'Khám phá những thay đổi nhỏ trong cuộc sống hàng ngày có thể tạo ra tác động lớn đến môi trường...',
      category: 'lifestyle',
      author: 'Nguyễn Thanh Hà',
      date: '2024-01-15',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      tags: ['Lối sống xanh', 'Môi trường', 'Tips']
    },
    {
      id: 2,
      title: 'Thời Trang Tuần Hoàn: Xu Hướng Của Tương Lai',
      excerpt: 'Tìm hiểu về phong trào thời trang bền vững và cách chúng ta có thể góp phần vào nền kinh tế tuần hoàn...',
      category: 'fashion',
      author: 'Trần Minh Anh',
      date: '2024-01-12',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
      tags: ['Thời trang', 'Tuần hoàn', 'Xu hướng']
    },
    {
      id: 3,
      title: 'Tác Động Của Rác Thải Nhựa Đến Đại Dương',
      excerpt: 'Những con số đáng báo động về ô nhiễm nhựa và những giải pháp chúng ta có thể áp dụng ngay hôm nay...',
      category: 'environment',
      author: 'Lê Văn Nam',
      date: '2024-01-10',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
      tags: ['Đại dương', 'Ô nhiễm', 'Hành động']
    },
    {
      id: 4,
      title: 'Hành Trình Quyên Góp Đồ Cũ: Từ Nhà Bạn Đến Người Cần',
      excerpt: 'Khám phá quy trình xử lý và phân phối đồ quyên góp tại GreenLoop, nơi mỗi món đồ đều có ý nghĩa...',
      category: 'greenloop',
      author: 'Phạm Thị Lan',
      date: '2024-01-08',
      readTime: '7 phút đọc',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
      tags: ['Quyên góp', 'GreenLoop', 'Cộng đồng']
    },
    {
      id: 5,
      title: 'DIY: Biến Đồ Cũ Thành Đồ Mới Với Upcycling',
      excerpt: 'Hướng dẫn chi tiết các dự án upcycling sáng tạo để biến những món đồ cũ thành những sản phẩm độc đáo...',
      category: 'diy',
      author: 'Hoàng Minh Tuấn',
      date: '2024-01-05',
      readTime: '10 phút đọc',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
      tags: ['DIY', 'Upcycling', 'Sáng tạo']
    },
    {
      id: 6,
      title: 'Câu Chuyện Thành Công: Khách Hàng GreenLoop',
      excerpt: 'Những câu chuyện truyền cảm hứng từ cộng đồng GreenLoop về hành trình sống xanh và đóng góp cho xã hội...',
      category: 'stories',
      author: 'Võ Thị Mai',
      date: '2024-01-03',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800',
      tags: ['Câu chuyện', 'Thành công', 'Cảm hứng']
    }
  ]

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '📚' },
    { id: 'lifestyle', name: 'Lối sống xanh', icon: '🌱' },
    { id: 'fashion', name: 'Thời trang', icon: '👕' },
    { id: 'environment', name: 'Môi trường', icon: '🌍' },
    { id: 'greenloop', name: 'GreenLoop', icon: '♻️' },
    { id: 'diy', name: 'DIY & Sáng tạo', icon: '✂️' },
    { id: 'stories', name: 'Câu chuyện', icon: '💚' }
  ]

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
    return matchesCategory && matchesSearch
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
      {/* Hero Banner */}
      <motion.div 
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Blog GreenLoop</h1>
            <p className="text-green-100 text-xl max-w-2xl mx-auto">
              Khám phá những câu chuyện, kiến thức và cảm hứng về lối sống bền vững
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="mt-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories */}
        <motion.div
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold text-green-600">{filteredPosts.length}</span> bài viết
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.map(post => (
            <motion.article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-green-600">
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{post.author}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <Link
                  to={`/blogs/${post.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition"
                >
                  Đọc tiếp
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-500 mb-6">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchText('')
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Xóa bộ lọc
            </button>
          </motion.div>
        )}

        {/* Newsletter Section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">📬 Đăng ký nhận tin</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Nhận các bài viết mới nhất, tips hữu ích và ưu đãi đặc biệt từ GreenLoop
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition">
              Đăng ký
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BlogPage

