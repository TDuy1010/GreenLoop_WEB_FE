import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const code = searchParams.get('code')
  const id = searchParams.get('id')
  const cancel = searchParams.get('cancel')
  const status = searchParams.get('status')
  const orderCode = searchParams.get('orderCode')

  const isSuccess = code === '00' && status === 'PAID' && cancel === 'false'

  useEffect(() => {
    // Log thông tin để debug
    console.log('Payment Success Params:', {
      code,
      id,
      cancel,
      status,
      orderCode
    })
  }, [code, id, cancel, status, orderCode])

  if (!isSuccess) {
    // Điều hướng sang trang thanh toán không thành công với đầy đủ query params
    const failUrl = `/payments/fail?code=${code ?? ''}&id=${id ?? ''}&cancel=${cancel ?? ''}&status=${status ?? ''}&orderCode=${orderCode ?? ''}`
    navigate(failUrl, { replace: true })
    return null
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm">
          {/* Success Icon */}
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
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Thanh toán thành công!</h1>
            <p className="text-lg text-slate-600">
              Cảm ơn bạn đã mua sắm tại GreenLoop. Đơn hàng của bạn đã được xử lý thành công.
            </p>
          </div>

          {/* Order Information */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Thông tin đơn hàng</h2>
            <div className="space-y-3">
              {orderCode && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Mã đơn hàng:</span>
                  <span className="text-slate-900 font-bold text-lg">{orderCode}</span>
                </div>
              )}
              {id && (
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Mã giao dịch:</span>
                  <span className="text-slate-900 font-mono text-sm">{id}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Trạng thái:</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                  Đã thanh toán
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Bước tiếp theo</h3>
            <ul className="space-y-2 text-emerald-800">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Bạn sẽ nhận được email xác nhận đơn hàng trong vài phút tới.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Chúng tôi sẽ gửi thông báo cập nhật về tình trạng đơn hàng của bạn.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Bạn có thể theo dõi đơn hàng trong phần "Đơn hàng của tôi" tại trang hồ sơ.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
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

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Cần hỗ trợ?{' '}
              <Link to="/chat" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Liên hệ với chúng tôi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentSuccessPage

