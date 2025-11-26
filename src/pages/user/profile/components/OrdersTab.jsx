import React, { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Spin, Image, Timeline, message } from 'antd'
import { getMyOrderDetail, getOrderHistory, cancelMyOrder } from '../../../../service/api/orderApi'

const statusConfig = {
  PENDING: { label: 'Đang xử lý', className: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-700' },
  SHIPPING: { label: 'Đang vận chuyển', className: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { label: 'Đã giao hàng', className: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-rose-100 text-rose-700' },
  COMPLETED: { label: 'Hoàn tất', className: 'bg-green-100 text-green-700' },
  RETURNED: { label: 'Đã trả hàng', className: 'bg-gray-200 text-gray-700' }
}

const paymentStatusConfig = {
  UNPAID: { label: 'Chưa thanh toán', className: 'text-amber-600' },
  PAID: { label: 'Đã thanh toán', className: 'text-emerald-600' },
  REFUNDED: { label: 'Đã hoàn tiền', className: 'text-blue-600' }
}

const eventColorMap = {
  ORDER_CREATED: 'green',
  ORDER_STATUS_CHANGED: 'blue',
  SHIPPING_STATUS_CHANGED: 'cyan',
  PAYMENT_STATUS_CHANGED: 'purple'
}

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`

const OrdersTab = ({ orders = [], loading, error, onReload, pagination }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [detailError, setDetailError] = useState(null)
  const [detailOrderId, setDetailOrderId] = useState(null)
  const [historyData, setHistoryData] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState(null)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)

  const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString('vi-VN') : '-'

  const loadOrderHistory = async (orderId) => {
    if (!orderId) return
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const response = await getOrderHistory(orderId)
      const payload = response?.data ?? response ?? {}
      const historyList = payload.data ?? payload
      setHistoryData(Array.isArray(historyList) ? historyList : [])
    } catch (err) {
      console.error('Không thể tải lịch sử đơn hàng:', err)
      setHistoryError(err?.response?.data?.message || 'Không thể tải lịch sử đơn hàng.')
      setHistoryData([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleViewDetail = async (orderId) => {
    if (!orderId) return
    setDetailVisible(true)
    setDetailOrderId(orderId)
    setDetailLoading(true)
    setDetailError(null)
    setHistoryData([])
    setHistoryError(null)
    setCancelError(null)
    try {
      const response = await getMyOrderDetail(orderId)
      const payload = response?.data ?? response ?? {}
      setDetailData(payload.data ?? payload)
      await loadOrderHistory(orderId)
    } catch (err) {
      console.error('Không thể tải chi tiết đơn hàng:', err)
      setDetailError(err?.message || 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại.')
      setDetailData(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const timelineItems = Array.isArray(historyData)
    ? historyData.map((event) => ({
        key: event.id,
        color: eventColorMap[event.eventType] || 'gray',
        children: (
          <div>
            <p className="font-medium text-gray-900">{event.description || event.eventType}</p>
            <p className="text-xs text-gray-500">
              {formatDateTime(event.createdAt)}{' '}
              {event.changedByRole ? `• ${event.changedByRole}` : ''}
            </p>
            {(event.oldValue || event.newValue) && (
              <p className="text-xs text-gray-400">
                {event.oldValue ? `Từ ${event.oldValue}` : ''}{' '}
                {event.newValue ? `→ ${event.newValue}` : ''}
              </p>
            )}
          </div>
        )
      }))
    : []

  const closeDetailModal = () => {
    setDetailVisible(false)
    setDetailData(null)
    setDetailError(null)
    setDetailOrderId(null)
    setHistoryData([])
    setHistoryError(null)
    setHistoryLoading(false)
    setCancelReason('')
    setCancelError(null)
    setCancelModalVisible(false)
  }

  const openCancelModal = () => {
    setCancelError(null)
    setCancelModalVisible(true)
  }

  const closeCancelModal = () => {
    if (cancelLoading) return
    setCancelModalVisible(false)
    setCancelReason('')
    setCancelError(null)
  }

  const handleCancelOrder = async () => {
    if (!detailOrderId || cancelLoading) return
    setCancelLoading(true)
    setCancelError(null)
    try {
      await cancelMyOrder(detailOrderId, cancelReason.trim())
      message.success('Đã gửi yêu cầu hủy đơn hàng.')
      setCancelReason('')
      setCancelModalVisible(false)
      await handleViewDetail(detailOrderId)
      onReload?.()
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Không thể hủy đơn hàng.'
      setCancelError(errMsg)
      message.error(errMsg)
    } finally {
      setCancelLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-10">
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-rose-500 font-medium mb-4">{error}</p>
          <button
            type="button"
            onClick={onReload}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Thử lại
          </button>
        </div>
      )
    }

    if (!orders.length) {
      return (
        <div className="text-center py-10 text-gray-500">
          <p>Chưa có đơn hàng nào. Hãy tiếp tục mua sắm nhé!</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {orders.map((order, index) => {
          const status = statusConfig[order.orderStatus] || {
            label: order.orderStatus || 'Không xác định',
            className: 'bg-gray-100 text-gray-700'
          }
          const payment = paymentStatusConfig[order.paymentStatus] || {
            label: order.paymentStatus || 'Không rõ',
            className: 'text-gray-500'
          }
          const totalItems = Array.isArray(order.orderItems)
            ? order.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0
          return (
            <Motion.div
              key={order.orderId || order.orderCode || index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      #{order.orderCode || order.orderId}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                    <span className={`text-xs font-semibold ${payment.className}`}>
                      {payment.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Ngày đặt:</span>{' '}
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Số sản phẩm:</span> {totalItems} món
                  </p>
                  {order.shippingAddress?.receiverName && (
                    <p className="text-gray-500 text-sm">
                      <span className="font-medium">Người nhận:</span> {order.shippingAddress.receiverName}
                    </p>
                  )}
                </div>

                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(order.totalPrice)}</p>
                  <p className="text-sm text-gray-500 mb-3">Đã gồm phí ship: {formatCurrency(order.shippingFee)}</p>
                  <Motion.button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleViewDetail(order.orderId)}
                  >
                    Xem chi tiết
                  </Motion.button>
                </div>
              </div>
            </Motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
        {pagination?.total ? (
          <p className="text-sm text-gray-500">
            Tổng cộng {pagination.total} đơn | Trang {pagination.page + 1}/{Math.max(pagination.totalPages, 1)}
          </p>
        ) : null}
      </div>
      {renderContent()}
      {detailVisible && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onMouseDown={closeDetailModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeDetailModal}
            >
              ✕
            </button>
            {detailLoading ? (
              <div className="flex justify-center py-10">
                <Spin size="large" tip="Đang tải chi tiết..." />
              </div>
            ) : detailError ? (
              <div className="text-center py-10">
                <p className="text-rose-500 font-medium mb-4">{detailError}</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => handleViewDetail(detailOrderId)}
                >
                  Thử lại
                </button>
              </div>
            ) : detailData ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-500 font-semibold mb-2">
                    Chi tiết đơn hàng
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    #{detailData.orderCode || detailData.orderId}
                  </h3>
                  {detailData.orderStatus === 'CANCELLED' && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
                        </svg>
                        ĐÃ HỦY
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Trạng thái</h4>
                    <p className="text-gray-700">
                      <span className="font-medium">Đơn hàng:</span> {statusConfig[detailData.orderStatus]?.label || detailData.orderStatus}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Thanh toán:</span>{' '}
                      {paymentStatusConfig[detailData.paymentStatus]?.label || detailData.paymentStatus}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phương thức:</span> {detailData.paymentMethod || '—'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Chi phí</h4>
                    <p className="flex justify-between text-gray-700">
                      <span>Tổng sản phẩm:</span>
                      <span>{formatCurrency(detailData.totalPrice - detailData.shippingFee)}</span>
                    </p>
                    <p className="flex justify-between text-gray-700">
                      <span>Phí vận chuyển:</span>
                      <span>{formatCurrency(detailData.shippingFee)}</span>
                    </p>
                    <p className="flex justify-between text-gray-900 font-semibold text-lg border-t border-gray-200 pt-2 mt-2">
                      <span>Tổng cộng:</span>
                      <span>{formatCurrency(detailData.totalPrice)}</span>
                    </p>
                  </div>
                </div>

                {detailData.orderStatus === 'PENDING' && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-2">
                    <h4 className="text-lg font-semibold text-rose-800">Hủy đơn hàng</h4>
                    <p className="text-sm text-rose-600">
                      Bạn chỉ có thể hủy khi đơn hàng đang chờ xử lý. Sau khi hủy, trạng thái sẽ cập nhật ngay.
                    </p>
                    <Motion.button
                      type="button"
                      className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openCancelModal}
                    >
                      Xác nhận hủy
                    </Motion.button>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h4>
                  <p className="text-gray-700 font-medium">{detailData.shippingAddress?.receiverName}</p>
                  <p className="text-gray-600">{detailData.shippingAddress?.receiverPhone}</p>
                  <p className="text-gray-600">
                    {detailData.shippingAddress?.receiverAddress}, {detailData.shippingAddress?.receiverWardName},{' '}
                    {detailData.shippingAddress?.receiverDistrictName}, {detailData.shippingAddress?.receiverCityName}
                  </p>
                  {detailData.shippingAddress?.note && (
                    <p className="text-gray-500 italic mt-2">Ghi chú: {detailData.shippingAddress.note}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">Lịch sử đơn hàng</h4>
                    {historyLoading && <Spin size="small" />}
                  </div>
                  {historyError ? (
                    <p className="text-rose-500 text-sm">{historyError}</p>
                  ) : timelineItems.length ? (
                    <Timeline
                      items={timelineItems}
                      className="mt-2"
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">Chưa có lịch sử cho đơn hàng này.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Sản phẩm</h4>
                  <div className="space-y-3">
                    {detailData.orderItems?.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center"
                      >
                        <Image
                          width={80}
                          height={80}
                          src={item.productImage}
                          alt={item.productName || 'Sản phẩm'}
                          className="object-cover rounded-lg"
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {item.productName || `Sản phẩm #${item.productId}`}
                          </p>
                          <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                          {item.productId && (
                            <p className="text-gray-500 text-xs mt-1">ID: {item.productId}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-semibold text-lg">{formatCurrency(item.price)}</p>
                          <p className="text-gray-500 text-sm">
                            Tổng: {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">Không có dữ liệu đơn hàng.</p>
            )}
          </div>
        </div>
      )}
      {cancelModalVisible && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          onMouseDown={closeCancelModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>
          <div
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center transition-all duration-200 scale-100"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={closeCancelModal}
            >
              ✕
            </button>
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M21 12.79A9 9 0 1111.21 3 9 9 0 0121 12.79z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-1">Xác nhận hủy đơn</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc muốn hủy đơn #{detailData?.orderCode || detailOrderId}? Vui lòng cho chúng tôi biết lý do (tùy chọn).
            </p>
            <textarea
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
              rows={4}
              maxLength={255}
              placeholder="Lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            {cancelError && <p className="text-rose-600 text-sm mt-2">{cancelError}</p>}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                className="flex-1 border border-gray-300 text-gray-700 rounded-2xl py-3 font-medium hover:border-gray-400"
                onClick={closeCancelModal}
                disabled={cancelLoading}
              >
                Hủy
              </button>
              <button
                type="button"
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl py-3 font-semibold shadow-lg shadow-rose-500/30 disabled:opacity-60"
                onClick={handleCancelOrder}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Motion.div>
  )
}

export default OrdersTab
