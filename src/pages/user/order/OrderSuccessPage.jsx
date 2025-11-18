import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccessPage = () => {
  const location = useLocation()
  const state = location.state || {}

  const orderId = state.orderId
  const orderCode = state.orderCode

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg
                className="w-16 h-16 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Đặt hàng thành công!</h1>
            <p className="text-lg text-slate-600">
              Cảm ơn bạn đã đặt hàng tại GreenLoop. Đơn hàng của bạn đã được tạo với phương thức thanh toán COD.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3">
              {orderCode && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Mã đơn hàng:</span>
                  <span className="text-slate-900 font-bold text-lg">{orderCode}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Mã hệ thống:</span>
                  <span className="text-slate-900 font-mono text-sm">{orderId}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Trạng thái thanh toán:</span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                  Thanh toán khi nhận hàng (COD)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Bước tiếp theo</h3>
            <ul className="space-y-2 text-emerald-800">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Bạn sẽ nhận được cuộc gọi/xác nhận từ nhân viên trước khi giao hàng.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Vui lòng chuẩn bị tiền mặt để thanh toán khi nhận hàng.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Bạn có thể theo dõi đơn hàng trong phần "Đơn hàng của tôi" tại trang hồ sơ.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/profile"
              className="flex-1 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              to="/shop"
              className="flex-1 px-6 py-3 rounded-full border border-slate-200 text-slate-600 text-center hover:bg-slate-50 transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderSuccessPage


