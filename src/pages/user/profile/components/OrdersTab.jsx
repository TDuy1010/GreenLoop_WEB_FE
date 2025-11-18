import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Spin } from 'antd'
import { getMyOrderDetail } from '../../../../service/api/orderApi'

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

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`

const OrdersTab = ({ orders = [], loading, error, onReload, pagination }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [detailError, setDetailError] = useState(null)
  const [detailOrderId, setDetailOrderId] = useState(null)

  const handleViewDetail = async (orderId) => {
    if (!orderId) return
    setDetailVisible(true)
    setDetailOrderId(orderId)
    setDetailLoading(true)
    setDetailError(null)
    try {
      const response = await getMyOrderDetail(orderId)
      const payload = response?.data ?? response ?? {}
      setDetailData(payload.data ?? payload)
    } catch (err) {
      console.error('Không thể tải chi tiết đơn hàng:', err)
      setDetailError(err?.message || 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại.')
      setDetailData(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetailModal = () => {
    setDetailVisible(false)
    setDetailData(null)
    setDetailError(null)
    setDetailOrderId(null)
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
            <motion.div
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
                  <motion.button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleViewDetail(order.orderId)}
                  >
                    Xem chi tiết
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
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
                  <p className="text-gray-500">
                    Tạo lúc: {detailData.createdAt ? new Date(detailData.createdAt).toLocaleString('vi-VN') : '—'}
                  </p>
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

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Sản phẩm</h4>
                  <div className="space-y-3">
                    {detailData.orderItems?.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="border border-gray-200 rounded-xl p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">Sản phẩm #{item.productId}</p>
                          <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-semibold">{formatCurrency(item.price)}</p>
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
    </motion.div>
  )
}

export default OrdersTab

