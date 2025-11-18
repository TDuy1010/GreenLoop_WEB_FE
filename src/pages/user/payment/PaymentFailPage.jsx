import React from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

const PaymentFailPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const code = searchParams.get('code')
  const id = searchParams.get('id')
  const cancel = searchParams.get('cancel')
  const status = searchParams.get('status')
  const orderCode = searchParams.get('orderCode')

  return (
    <section className="min-h-screen bg-slate-50 py-10 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Thanh toán không thành công</h1>
          <p className="text-slate-600 mb-6">
            Có vẻ như quá trình thanh toán của bạn đã bị hủy hoặc gặp lỗi. Vui lòng thử lại.
          </p>

          {/* Thông tin giao dịch (nếu có) */}
          {(orderCode || id || status) && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left text-sm text-slate-700">
              {orderCode && (
                <p className="mb-1">
                  <span className="font-semibold">Mã đơn hàng:</span> {orderCode}
                </p>
              )}
              {id && (
                <p className="mb-1">
                  <span className="font-semibold">Mã giao dịch:</span> {id}
                </p>
              )}
              {status && (
                <p className="mb-1">
                  <span className="font-semibold">Trạng thái:</span> {status}
                </p>
              )}
              {code && (
                <p className="mb-1">
                  <span className="font-semibold">Mã phản hồi:</span> {code}
                </p>
              )}
              {cancel && (
                <p className="mb-1">
                  <span className="font-semibold">Hủy:</span> {cancel}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/payment')}
              className="px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              Thử lại thanh toán
            </button>
            <Link
              to="/cart"
              className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Về giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentFailPage


