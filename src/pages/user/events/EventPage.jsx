/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { eventCategories } from '../../../data/mockData'
import { getCustomerEvents } from '../../../service/api/eventApi'
import { API_CONFIG } from '../../../service/instance'
import { isLoggedIn } from '../../../utils/authHelper'
import Loading from '../../../components/Loading'

const EventPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedView, setSelectedView] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await getCustomerEvents({ page: 0, size: 12, sortBy: 'createdAt', sortDir: 'DESC' })
        let list = res?.data?.content
        if (!Array.isArray(list)) {
          // Một số API trả về data dạng { success, data: [...] }
          const possible = res?.data?.data || res?.data || []
          list = Array.isArray(possible) ? possible : []
        }
        const apiRoot = (API_CONFIG?.BASE_URL || '').replace(/\/api\/v1$/i, '')
        const mapped = list.map(ev => {
          const rawImage = ev.imageUrl || ev.thumbnail || ev.thumbnailUrl || ev.image || ''
          const isAbsolute = typeof rawImage === 'string' && /^(http|https):\/\//i.test(rawImage)
          const normalizedImage = (() => {
            if (!rawImage) return ''
            if (isAbsolute) return rawImage
            if (rawImage.startsWith('/api')) return rawImage
            if (apiRoot) return `${apiRoot}${rawImage}`
            return `${API_CONFIG?.BASE_URL || ''}${rawImage}`
          })()
          const isRegistrationModel = ev.eventId && ev.eventName
          return {
            id: isRegistrationModel ? ev.eventId : ev.id,
            title: isRegistrationModel ? ev.eventName : ev.name,
            description: ev.description || '',
            date: ev.startTime || ev.date,
            startTime: ev.startTime || ev.start,
            endTime: ev.endTime || ev.end,
            location: ev.location || '',
            image: normalizedImage,
            category: ev.category || 'event',
            tags: [],
            attendees: ev.registeredCount || 0,
            maxAttendees: ev.maxParticipants || 0,
            organizer: { name: 'GreenLoop', avatar: normalizedImage },
            isRegistered: ev.isRegistered || false,
            registrationStatus: ev.registrationStatus || undefined
          }
        })
        setEvents(mapped)
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Filter events based on current view and category (category kept for future use)
  const filteredEvents = events
    .filter(event => {
      if (selectedCategory === 'all') return true
      return event.category.toLowerCase().replace(' ', '-') === selectedCategory
    })
    // bỏ filter theo đăng ký, vì tab riêng sẽ xử lý

  const fadeIn = {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return '--:--'
    try {
      if (typeof dateString === 'string') {
        const hhmm = dateString.slice(11, 16)
        if (hhmm && hhmm.includes(':')) return hhmm
      }
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '--:--'
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return '--:--'
    }
  }

  const EventCard = ({ event }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      variants={fadeIn}
      whileHover={{ y: -8 }}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            {event.category}
          </span>
        </div>
        {/* Ẩn hiển thị số người đã đăng ký trên thẻ */}
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-green-600 mb-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-sm">{formatDate(event.date)}</span>
        </div>
        {/* Time range */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{event.location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bỏ phần tổ chức bởi theo yêu cầu */}

        {/* Action Button */}
        <Link to={`/events/${event.id}`}>
          <motion.button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {event.attendees >= event.maxAttendees ? 'Xem chi tiết' : 'Xem chi tiết & Đăng ký'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <motion.div
        className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            className="text-5xl font-bold mb-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            Sự kiện GreenLoop
          </motion.h1>
          <motion.p
            className="text-green-100 text-xl max-w-3xl"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Tham gia các sự kiện offline thú vị để kết nối cộng đồng yêu thời trang bền vững,
            học hỏi kiến thức mới và góp phần bảo vệ môi trường.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="bg-white py-12 border-b"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Sự kiện đã tổ chức</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
              <div className="text-gray-600">Người tham gia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Thành phố</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Thân thiện môi trường</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && <Loading message="Đang tải sự kiện..." />}
        {/* Filters */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Tabs điều hướng */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-3">Chế độ hiển thị:</h3>
              <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                <span className="px-4 py-2 rounded-lg bg-white shadow text-green-700">Tất cả sự kiện</span>
              </div>
            </div>

            {/* Location Filter (giữ nguyên nếu cần) */}
            <div className="md:w-64">
              <h3 className="font-semibold text-gray-800 mb-3">Địa điểm:</h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="all">Tất cả địa điểm</option>
                <option value="q1">Quận 1</option>
                <option value="q3">Quận 3</option>
                <option value="q7">Quận 7</option>
                <option value="govap">Quận Gò Vấp</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-600">
              Hiển thị <span className="font-semibold text-green-600">{filteredEvents.length}</span> sự kiện
            </p>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy sự kiện nào
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi bộ lọc để xem thêm sự kiện khác
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedLocation('all')
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Xem tất cả sự kiện
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl p-8 mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4">
            Bạn muốn tổ chức sự kiện cùng GreenLoop?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được hỗ trợ tổ chức các sự kiện thời trang bền vững
            tại địa phương của bạn.
          </p>
          <motion.button
            className="bg-white text-green-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Liên hệ ngay
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default EventPage