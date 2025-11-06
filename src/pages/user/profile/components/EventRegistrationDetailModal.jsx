/* eslint-disable no-unused-vars */
import React from 'react'
import { Modal } from 'antd'
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  CalendarOutlined,
  QrcodeOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'

const EventRegistrationDetailModal = ({ visible, onClose, eventData }) => {
  if (!eventData) return null

  const formatDateTime = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return '—'
    try {
      return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return dateString?.slice(11, 16) || '—'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusConfig = () => {
    if (eventData.registrationStatus === 'CANCELED') {
      return {
        color: 'red',
        text: 'Đã hủy',
        icon: <CloseCircleOutlined />
      }
    }
    if (eventData.checkInTime) {
      return {
        color: 'green',
        text: 'Đã check-in',
        icon: <CheckCircleOutlined />
      }
    }
    return {
      color: 'blue',
      text: 'Đã đặt',
      icon: <ClockCircleOutlined />
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <QrcodeOutlined className="text-green-600" />
          <span className="text-lg font-semibold">Chi tiết đăng ký sự kiện</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="event-registration-detail-modal"
    >
      <div className="space-y-6">
        {/* Header với tên sự kiện và trạng thái */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{eventData.title || eventData.eventName}</h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusConfig.color === 'red' 
                ? 'bg-red-100 text-red-700' 
                : statusConfig.color === 'green'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
            }`}>
              {statusConfig.icon} {statusConfig.text}
            </span>
            {!eventData.active && eventData.registrationStatus !== 'CANCELED' && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                Không hoạt động
              </span>
            )}
          </div>
        </div>

        {/* Thông tin mã vé và mã sự kiện */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventData.ticketCode && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Mã vé</div>
              <div className="font-mono text-lg font-bold text-green-600">{eventData.ticketCode}</div>
            </div>
          )}
          {eventData.eventCode && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Mã sự kiện</div>
              <div className="font-mono text-sm font-semibold text-gray-700">{eventData.eventCode}</div>
            </div>
          )}
        </div>

        {/* Thông tin thời gian và địa điểm */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CalendarOutlined className="text-blue-500 text-lg mt-1" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Ngày tổ chức</div>
              <div className="text-sm font-medium text-gray-900">{formatDate(eventData.startTime || eventData.date)}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClockCircleOutlined className="text-purple-500 text-lg mt-1" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Thời gian</div>
              <div className="text-sm font-medium text-gray-900">
                {formatTime(eventData.startTime)} - {formatTime(eventData.endTime)}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <EnvironmentOutlined className="text-red-500 text-lg mt-1" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Địa điểm</div>
              <div className="text-sm font-medium text-gray-900">{eventData.location || '—'}</div>
            </div>
          </div>
        </div>

        {/* Thông tin check-in */}
        {eventData.checkInTime ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleOutlined className="text-green-600 text-lg" />
              <span className="font-semibold text-green-900">Đã check-in</span>
            </div>
            <div className="text-sm text-green-700">
              Thời gian check-in: {formatDateTime(eventData.checkInTime)}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClockCircleOutlined className="text-gray-400 text-lg" />
              <span className="font-semibold text-gray-700">Chưa check-in</span>
            </div>
            <div className="text-sm text-gray-600">
              Bạn sẽ có thể check-in khi đến địa điểm sự kiện
            </div>
          </div>
        )}

        {/* Thông tin bổ sung */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {eventData.registrationId && (
              <div>
                <div className="text-gray-500 mb-1">ID Đăng ký</div>
                <div className="font-mono text-gray-700">{eventData.registrationId}</div>
              </div>
            )}
            {eventData.eventId && (
              <div>
                <div className="text-gray-500 mb-1">ID Sự kiện</div>
                <div className="font-mono text-gray-700">{eventData.eventId}</div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <a 
            href={`/events/${eventData.id || eventData.eventId}`} 
            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Xem chi tiết sự kiện
          </a>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EventRegistrationDetailModal

