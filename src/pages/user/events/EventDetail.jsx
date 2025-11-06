import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { getCustomerEventById, registerCustomerToEvent, getMyRegisteredEvents, cancelCustomerRegistration } from '../../../service/api/eventApi'
import { API_CONFIG } from '../../../service/instance'
import Vietmap from '../../../components/Vietmap'
import SuccessModal from '../../../components/SuccessModal'
import ConfirmModal from '../../../components/ConfirmModal'

const EventDetail = () => {
  const { id } = useParams()
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    notes: '',
    itemCount: 1,
    itemTypes: []
  })
  const [donationData, setDonationData] = useState({
    name: '',
    email: '',
    phone: '',
    itemCount: 1,
    itemTypes: [],
    description: '',
    address: ''
  })

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successTitle, setSuccessTitle] = useState('Thành công')
  const [successMessage, setSuccessMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const res = await getCustomerEventById(id)
        const ev = res?.data || res?.data?.data || res?.data?.event || null
        if (!ev) { setEvent(null); return }
        const apiRoot = (API_CONFIG?.BASE_URL || '').replace(/\/api\/v1$/i, '')
        const rawImage = ev.imageUrl || ev.thumbnail || ev.thumbnailUrl || ev.image || ''
        const isAbsolute = typeof rawImage === 'string' && /^(http|https):\/\//i.test(rawImage)
        const normalizedImage = (() => {
          if (!rawImage) return ''
          if (isAbsolute) return rawImage
          if (rawImage.startsWith('/api')) return rawImage
          if (apiRoot) return `${apiRoot}${rawImage}`
          return `${API_CONFIG?.BASE_URL || ''}${rawImage}`
        })()
        const mapped = {
          id: ev.id,
          title: ev.name,
          description: ev.description || '',
          date: ev.startTime,
          time: '',
          startTime: ev.startTime,
          endTime: ev.endTime,
          location: ev.location,
          address: ev.locationDetail || '',
          image: normalizedImage,
          category: ev.category || 'event',
          attendees: (ev.totalRegistrations ?? ev.registeredCount ?? 0),
          maxAttendees: ev.maxParticipants || 0,
          tags: [],
          coordinates: ev.latitude && ev.longitude ? { lat: Number(ev.latitude), lng: Number(ev.longitude) } : null,
          price: ev.price || 0,
          organizer: { name: 'GreenLoop', avatar: normalizedImage }
        }
        setEvent(mapped)
      } catch {
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  // Check if current user registered this event
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const res = await getMyRegisteredEvents({ page: 0, size: 50, status: 'REGISTERED' })
        // axiosClient đã unwrap response.data → res là payload
        const arr = Array.isArray(res?.content)
          ? res.content
          : (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []))

        const isActiveRegistration = (item) => {
          const rawStatus = (item?.status || item?.registrationStatus || item?.state || '').toString().toUpperCase()
          const cancelled = rawStatus.includes('CANCEL') || rawStatus === 'REJECTED' || rawStatus === 'REMOVED' || item?.cancelled === true || item?.canceled === true || item?.isCancelled === true || item?.isCanceled === true
          const inactive = item?.active === false
          return !cancelled && !inactive
        }

        const getEventId = (item) => item?.eventId || item?.id || item?.event?.id

        const found = arr.some(item => String(getEventId(item)) === String(id) && isActiveRegistration(item))
        setIsRegistered(found)
      } catch {
        setIsRegistered(false)
      }
    }
    if (id) checkRegistration()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">Đang tải chi tiết sự kiện...</div>
      </div>
    )
  }

  if (!event && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sự kiện</h2>
          <Link to="/events" className="text-green-600 hover:underline">
            ← Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    )
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    try {
      const parts = []
      parts.push(`Số lượng đồ quyên góp: ${registrationData.itemCount}`)
      if (registrationData.itemTypes?.length) {
        parts.push(`Loại đồ: ${registrationData.itemTypes.join(', ')}`)
      }
      if (registrationData.notes) {
        parts.push(`Ghi chú: ${registrationData.notes}`)
      }
      const note = parts.join('\n')
      await registerCustomerToEvent(event.id, note)
      setSuccessTitle('Đăng ký thành công')
      setSuccessMessage('Bạn đã đăng ký tham gia sự kiện này. Hẹn gặp bạn tại sự kiện!')
      setSuccessOpen(true)
      setShowRegistrationForm(false)
      setRegistrationData({ notes: '', itemCount: 1, itemTypes: [] })
      setIsRegistered(true)
      setEvent(prev => prev ? { ...prev, attendees: (prev.attendees || 0) + 1 } : prev)
    } catch (err) {
      alert('Đăng ký thất bại. Vui lòng thử lại!')
    }
  }

  const handleCancelRegistration = async () => {
    if (!event?.id || actionLoading) return
    try {
      setActionLoading(true)
      await cancelCustomerRegistration(event.id)
      setIsRegistered(false)
      setEvent(prev => prev ? { ...prev, attendees: Math.max(0, (prev.attendees || 0) - 1) } : prev)
      setSuccessTitle('Hủy đăng ký thành công')
      setSuccessMessage('Bạn đã hủy đăng ký tham gia sự kiện này.')
      setSuccessOpen(true)
    } catch (e) {
      const status = e?.response?.status || e?.status
      if (status === 404) {
        // Backend báo không tìm thấy đăng ký: coi như đã hủy/không tồn tại
        setIsRegistered(false)
        alert('Hệ thống không tìm thấy đăng ký của bạn (có thể đã hủy trước đó).')
      } else {
        alert('Hủy đăng ký thất bại, vui lòng thử lại!')
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleDonationSubmit = (e) => {
    e.preventDefault()
    // In real app, this would make an API call
    alert('Đăng ký quyên góp thành công! Chúng tôi sẽ liên hệ để thu gom đồ.')
    setShowDonationForm(false)
    setDonationData({
      name: '',
      email: '',
      phone: '',
      itemCount: 1,
      itemTypes: [],
      description: '',
      address: ''
    })
  }

  const itemTypeOptions = [
    'Áo sơ mi', 'Áo thun', 'Quần jean', 'Đầm/Váy', 'Áo khoác', 
    'Giày dép', 'Túi xách', 'Phụ kiện', 'Khác'
  ]

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-green-600">Trang chủ</Link>
            <span className="text-gray-400">/</span>
            <Link to="/events" className="text-gray-500 hover:text-green-600">Sự kiện</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{event?.title || ''}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <motion.div
              className="relative h-80 rounded-xl overflow-hidden mb-8"
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {event.category}
                </span>
              </div>
            </motion.div>

            {/* Event Info */}
            <motion.div
              className="bg-white rounded-xl p-8 mb-8"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>
              
              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Thời gian</h3>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                    <p className="text-gray-600">{(event.startTime || '').slice(11,16)} - {(event.endTime || '').slice(11,16)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Địa điểm</h3>
                    <p className="text-gray-600">{event.location}</p>
                    <p className="text-gray-500 text-sm">{event.address}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Chi phí</h3>
                    {event.price === 0 ? (
                      <p className="text-green-600 font-semibold">Miễn phí</p>
                    ) : (
                      <p className="text-gray-600">{event.price.toLocaleString('vi-VN')}đ</p>
                    )}
                  </div>
                </div>

                {/* Attendees (không giới hạn) */}
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Số người đã đăng ký</h3>
                    <p className="text-gray-600">{event.attendees} người</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mô tả sự kiện</h3>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              {/* Highlights */}
              {event.highlights && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Điểm nổi bật</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location Map */}
              {event.coordinates && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Vị trí sự kiện</h3>
                  <div className="mb-4">
                    <Vietmap
                      latitude={event.coordinates.lat}
                      longitude={event.coordinates.lng}
                      height="400px"
                      apiKey={import.meta.env.VITE_VIETMAP_API_KEY || '3aa910999593c14303117e42dc0e62171cd42a0daa6c944c'}
                      zoom={16}
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{event.location}</h4>
                        <p className="text-gray-600 text-sm">{event.address}</p>
                        <div className="flex gap-4 mt-3">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Xem trên Google Maps
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${event.coordinates.lat},${event.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Chỉ đường
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              className="bg-white rounded-xl p-8"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin tổ chức</h3>
              <div className="flex items-center gap-4">
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{event.organizer.name}</h4>
                  <p className="text-gray-600">Tổ chức sự kiện</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
              {/* Registration Card (không giới hạn chỗ) */}
            <motion.div
              className="bg-white rounded-xl p-6 mb-6 sticky top-24 md:top-28 lg:top-32"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center mb-6">
                {event.price === 0 ? (
                  <div className="text-3xl font-bold text-green-600 mb-2">Miễn phí</div>
                ) : (
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {event.price.toLocaleString('vi-VN')}đ
                  </div>
                )}
                <p className="text-gray-600">Mỗi người tham gia</p>
              </div>

              <div className="mb-6 text-sm text-gray-600">{event.attendees} người đã đăng ký</div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => !isRegistered && setShowRegistrationForm(true)}
                  disabled={isRegistered}
                  className={`w-full font-bold py-4 rounded-lg transition text-white disabled:opacity-60 ${
                    isRegistered ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                  whileHover={{ scale: isRegistered ? 1 : 1.02 }}
                  whileTap={{ scale: isRegistered ? 1 : 0.98 }}
                >
                  {isRegistered ? 'Bạn đã đăng ký' : 'Đăng ký tham gia'}
                </motion.button>

                {isRegistered && (
                  <button
                    onClick={() => setConfirmOpen(true)}
                    disabled={actionLoading}
                    className="w-full border border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 rounded-lg transition disabled:opacity-60"
                  >
                    {actionLoading ? 'Đang hủy...' : 'Hủy đăng ký'}
                  </button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500">
                  Có thắc mắc? <a href="#" className="text-green-600 hover:underline">Liên hệ với chúng tôi</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10010] p-4">
          <motion.div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl z-[10011]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Đăng ký tham gia</h3>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng đồ quyên góp (tùy chọn)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={registrationData.itemCount}
                    onChange={(e) => setRegistrationData({...registrationData, itemCount: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Số món đồ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại đồ quyên góp (tùy chọn)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {itemTypeOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={registrationData.itemTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRegistrationData({
                                ...registrationData,
                                itemTypes: [...registrationData.itemTypes, type]
                              })
                            } else {
                              setRegistrationData({
                                ...registrationData,
                                itemTypes: registrationData.itemTypes.filter(t => t !== type)
                              })
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={registrationData.notes}
                    onChange={(e) => setRegistrationData({...registrationData, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    rows="3"
                    placeholder="Có điều gì bạn muốn chia sẻ không?"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={successOpen}
        title={successTitle}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
        autoCloseMs={2500}
      />

      {/* Confirm Cancel Registration */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Xác nhận hủy đăng ký"
        message="Bạn có chắc chắn muốn hủy đăng ký tham gia sự kiện này không?"
        confirmText="Hủy đăng ký"
        cancelText="Giữ lại"
        type="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false)
          await handleCancelRegistration()
        }}
      />

      {/* Donation Modal */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Đăng ký quyên góp</h3>
                <button
                  onClick={() => setShowDonationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={donationData.name}
                    onChange={(e) => setDonationData({...donationData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={donationData.email}
                    onChange={(e) => setDonationData({...donationData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={donationData.phone}
                    onChange={(e) => setDonationData({...donationData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng đồ quyên góp *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={donationData.itemCount}
                    onChange={(e) => setDonationData({...donationData, itemCount: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Số món đồ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại đồ quyên góp *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {itemTypeOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={donationData.itemTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDonationData({
                                ...donationData,
                                itemTypes: [...donationData.itemTypes, type]
                              })
                            } else {
                              setDonationData({
                                ...donationData,
                                itemTypes: donationData.itemTypes.filter(t => t !== type)
                              })
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    value={donationData.description}
                    onChange={(e) => setDonationData({...donationData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    rows="3"
                    placeholder="Mô tả tình trạng, màu sắc, size..."
                  />
                </div>

               
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDonationForm(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Đăng ký quyên góp
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default EventDetail
