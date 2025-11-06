/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMyRegisteredEvents } from '../../../../service/api/eventApi'
import { API_CONFIG } from '../../../../service/instance'
import Loading from '../../../../components/Loading'

const MyEventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const res = await getMyRegisteredEvents({ page: 0, size: 12, sortBy: 'createdAt', sortDir: 'DESC' })
        let list = res?.data?.content
        if (!Array.isArray(list)) {
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
            isRegistered: true,
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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
    <motion.div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" variants={fadeIn} whileHover={{ y: -8 }}>
      <div className="relative h-48 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">{event.category}</span>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
          {event.attendees}/{event.maxAttendees} người
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-green-600 mb-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="font-semibold text-sm">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-sm">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-sm">{event.location}</span>
        </div>
        <Link to={`/events/${event.id}`}>
          <motion.button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Xem chi tiết
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      <motion.div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1 className="text-5xl font-bold mb-4" variants={fadeIn} initial="hidden" animate="visible">Sự kiện của tôi</motion.h1>
          <motion.p className="text-green-100 text-xl max-w-3xl" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            Tất cả sự kiện bạn đã đăng ký tham gia trên GreenLoop.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && <Loading message="Đang tải sự kiện của bạn..." />}

        {/* Tabs điều hướng */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            <Link to="/events" className="px-4 py-2 rounded-lg text-gray-700">Tất cả sự kiện</Link>
            <span className="px-4 py-2 rounded-lg bg-white shadow text-green-700">Sự kiện của tôi</span>
          </div>
          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-600">Hiển thị <span className="font-semibold text-green-600">{events.length}</span> sự kiện bạn đã đăng ký</p>
          </div>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer} initial="hidden" animate="visible">
          {events.map((event) => (<EventCard key={event.id} event={event} />))}
        </motion.div>

        {events.length === 0 && (
          <motion.div className="text-center py-16" initial="hidden" animate="visible" variants={fadeIn}>
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Bạn chưa đăng ký sự kiện nào</h3>
            <p className="text-gray-600 mb-6">Khám phá các sự kiện hấp dẫn đang diễn ra.</p>
            <Link to="/events" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Xem tất cả sự kiện</Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MyEventsPage


