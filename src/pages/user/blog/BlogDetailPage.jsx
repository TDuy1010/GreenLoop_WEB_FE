import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { getBlogDetail } from '../../../service/api/blogApi'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200'

const BlogDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      setLoading(true)
      setError('')
      try {
        const response = await getBlogDetail(id)
        const payload = response?.data || response
        const data = payload?.data || payload
        setBlog(data)
      } catch (err) {
        console.error('Failed to load blog detail:', err)
        setError(err?.message || 'Không thể tải chi tiết bài viết')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-24 text-center text-gray-500">Đang tải nội dung bài viết...</div>
      )
    }

    if (error) {
      return (
        <div className="py-24 text-center">
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/blogs')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Quay lại trang Blog
          </button>
        </div>
      )
    }

    if (!blog) {
      return (
        <div className="py-24 text-center text-gray-500">Không tìm thấy bài viết.</div>
      )
    }

    return (
      <>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {blog.authorName || 'GreenLoop'}
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z" />
            </svg>
            {blog.publishedAt ? dayjs(blog.publishedAt).format('DD/MM/YYYY HH:mm') : 'Chưa xuất bản'}
          </span>
        </div>

        <div
          className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600"
          dangerouslySetInnerHTML={{ __html: blog.content || '<p>Không có nội dung</p>' }}
        />
      </>
    )
  }

  const heroImage = blog?.thumbnailUrl || FALLBACK_IMAGE

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="relative bg-gray-900 text-white py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(17,24,39,0.7), rgba(17,24,39,0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-green-200 hover:text-green-100 mb-6 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{blog?.title || 'Đang tải...'}</h1>
          {blog?.excerpt && (
            <p className="mt-6 text-lg text-gray-200 max-w-3xl line-clamp-3">
              {blog.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {renderContent()}

        {!loading && blog && (
          <div className="mt-12 bg-gray-100 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chia sẻ bài viết</h3>
              <p className="text-gray-600">Lan tỏa thông điệp sống xanh của GreenLoop đến bạn bè và cộng đồng.</p>
            </div>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'linkedin'].map(network => (
                <Link
                  key={network}
                  to="#"
                  className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-green-600 transition"
                  aria-label={`Share on ${network}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9h8M8 12h8m-5 3h5M6 9h.01M6 12h.01M6 15h.01" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogDetailPage

