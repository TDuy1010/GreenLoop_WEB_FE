import React, { useState, useEffect, useCallback } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getPublishedBlogs } from '../../../service/api/blogApi'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'

const stripHtml = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const estimateReadTime = (text = '') => {
  const words = text.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} phút đọc`
}

const BlogPage = () => {
  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchBlogs = useCallback(async ({ reset = false, targetPage = 0, searchText = activeSearch } = {}) => {
    setLoading(true)
    setError('')
    try {
      const response = await getPublishedBlogs({
        page: targetPage,
        size: pageSize,
        search: searchText || undefined,
        sortBy: 'publishedAt',
        sortDir: 'DESC'
      })

      const payload = response?.data || response
      const data = payload?.data || payload
      const content = Array.isArray(data?.content) ? data.content : []

      const normalized = content.map(item => {
        const plainText = stripHtml(item.content)
        return {
          id: item.id,
          title: item.title,
          excerpt: plainText.length > 200 ? `${plainText.slice(0, 200)}…` : plainText,
          category: item.category || 'blog',
          author: item.authorName || 'GreenLoop',
          publishedAt: item.publishedAt,
          readTime: estimateReadTime(plainText),
          image: item.thumbnailUrl || FALLBACK_IMAGE,
          slug: item.slug || item.id
        }
      })

      setBlogs(prev => (reset ? normalized : [...prev, ...normalized]))
      setPage(data?.pageNumber ?? targetPage)
      setTotalPages(data?.totalPages ?? (data?.totalElements ? Math.ceil(data.totalElements / pageSize) : targetPage + 1))
    } catch (err) {
      console.error('Failed to fetch blogs:', err)
      setError(err?.message || 'Không thể tải danh sách blog')
      if (reset) setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [activeSearch, pageSize])

  useEffect(() => {
    fetchBlogs({ reset: true, targetPage: 0, searchText: activeSearch })
  }, [activeSearch, fetchBlogs])

  const filteredPosts = blogs

  const hasMore = page + 1 < totalPages
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchBlogs({ targetPage: page + 1 })
    }
  }

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    setPage(0)
    setActiveSearch(searchInput.trim())
    fetchBlogs({ reset: true, targetPage: 0, searchText: searchInput.trim() })
  }

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
      <Motion.div 
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <Motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Blog GreenLoop</h1>
            <p className="text-green-100 text-xl max-w-2xl mx-auto">
              Khám phá những câu chuyện, kiến thức và cảm hứng về lối sống bền vững
            </p>
          </Motion.div>

          {/* Search Bar */}
          <Motion.div
            className="mt-8 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                </button>
              </form>
            </div>
          </Motion.div>
        </div>
      </Motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Count */}
        <Motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600">
            {loading
              ? 'Đang tải bài viết...'
              : (
                <>
                  Hiển thị <span className="font-semibold text-green-600">{filteredPosts.length}</span> bài viết
                </>
                )
            }
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </Motion.div>

        {/* Blog Grid */}
        <Motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.map(post => (
            <Motion.article
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
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{post.author}</span>
                  </div>
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
            </Motion.article>
          ))}
        </Motion.div>

        {/* No Results */}
        {!loading && filteredPosts.length === 0 && (
          <Motion.div
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
                setSearchInput('')
                setActiveSearch('')
                fetchBlogs({ reset: true, targetPage: 0, searchText: '' })
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Xóa bộ lọc
            </button>
          </Motion.div>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition disabled:opacity-70"
            >
              {loading ? 'Đang tải...' : 'Xem thêm'}
              {!loading && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage

