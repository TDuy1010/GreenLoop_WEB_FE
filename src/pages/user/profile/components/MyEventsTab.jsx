/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Loading from '../../../../components/Loading'
import EventRegistrationDetailModal from './EventRegistrationDetailModal'
import { formatDateShort, formatTime } from '../../../../utils/dateHelper'

const MyEventsTab = ({ myEvents, loadingMyEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const totalPages = Math.max(1, Math.ceil((myEvents?.length || 0) / pageSize))
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return (myEvents || []).slice(start, start + pageSize)
  }, [myEvents, currentPage, pageSize])

  const handleViewDetail = (event) => {
    setSelectedEvent(event)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sự kiện của tôi</h2>
        </div>
        {loadingMyEvents && <Loading message="Đang tải sự kiện của bạn..." />}
        {/* Danh sách với phân trang (không dùng scroll) */}
        <div className="divide-y">
          {paginatedEvents.map(ev => (
            <div key={ev.id} className="py-4 flex items-start gap-4">
              <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {ev.image ? (
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 truncate">{ev.title}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
                    ev.registrationStatus === 'CANCELED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {ev.registrationStatus === 'CANCELED' ? 'Đã hủy' : 'Đã đặt'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {(() => {
                    const dateStr = formatDateShort(ev.date || ev.startTime)
                    const startTimeStr = formatTime(ev.startTime)
                    const endTimeStr = formatTime(ev.endTime)
                    return `${dateStr} • ${startTimeStr} - ${endTimeStr} • ${ev.location || ''}`
                  })()}
                </div>
                <div className="mt-2">
                  <button 
                    onClick={() => handleViewDetail(ev)}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination controls */}
        {myEvents.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select
                className="border rounded-md px-2 py-1"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
              >
                {[5,10,15].map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
              <span>/ trang</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              <span>Trang {currentPage} / {totalPages}</span>
              <button
                className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        )}
        {(!loadingMyEvents && myEvents.length === 0) && (
          <div className="text-center py-10 text-gray-600">Bạn chưa đăng ký sự kiện nào.</div>
        )}
      </motion.div>

      <EventRegistrationDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        eventData={selectedEvent}
      />
    </>
  )
}

export default MyEventsTab

