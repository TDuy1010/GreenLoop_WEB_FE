import React from 'react'

const CheckoutSummary = ({
  selectedAddress,
  selectedShippingOption,
  selectedPaymentMethod,
  totals,
  paymentOptions,
  currentStep,
  processing,
  onBack,
  onConfirm,
  canConfirm,
  formatCurrency,
  checkoutResult,
  checkoutError
}) => {
  const paymentLabel = paymentOptions.find((option) => option.id === selectedPaymentMethod)?.title

  // Ưu tiên sử dụng dữ liệu từ API response nếu có (backend đã tính toán)
  const displayTotals = checkoutResult
    ? {
        productTotal: checkoutResult.productTotal ?? 0,
        shippingFee: checkoutResult.shippingFee ?? 0,
        total: checkoutResult.totalPrice ?? 0
      }
    : totals

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm h-fit">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Địa chỉ giao hàng</p>
        {selectedAddress ? (
          <div className="mt-3 text-sm text-slate-700">
            <p className="font-medium text-slate-900">{selectedAddress.recipientName}</p>
            <p>{selectedAddress.addressLine}</p>
            <p className="text-slate-500 mt-1">{selectedAddress.recipientPhone}</p>
          </div>
        ) : (
          <p className="mt-2 text-slate-400">Chưa chọn địa chỉ.</p>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Gói vận chuyển</p>
        {checkoutResult?.selectedCarrier ? (
          <div className="mt-3 text-sm text-slate-700 space-y-1">
            <p className="font-medium text-slate-900">{checkoutResult.selectedCarrier}</p>
            {checkoutResult.estimatedDelivery && (
              <p className="text-slate-500">Dự kiến giao: {checkoutResult.estimatedDelivery}</p>
            )}
            <p className="text-emerald-600 font-semibold">{formatCurrency(displayTotals.shippingFee)}</p>
          </div>
        ) : currentStep >= 2 && selectedShippingOption ? (
          <div className="mt-3 text-sm text-slate-700 space-y-1">
            <p className="font-medium text-slate-900">{selectedShippingOption.carrierName}</p>
            <p className="text-slate-500">
              {selectedShippingOption.service} • {selectedShippingOption.estimatedDelivery}
            </p>
            <p className="text-emerald-600 font-semibold">{formatCurrency(selectedShippingOption.fee)}</p>
          </div>
        ) : (
          <p className="mt-2 text-slate-400">Chọn địa chỉ và gói vận chuyển ở bước 2 để xem thông tin.</p>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Phương thức thanh toán</p>
        {paymentLabel ? (
          <p className="mt-3 text-slate-900 font-medium">{paymentLabel}</p>
        ) : (
          <p className="mt-2 text-slate-400">Chưa chọn phương thức.</p>
        )}
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Tạm tính</span>
          <span className="font-semibold text-slate-900">{formatCurrency(displayTotals.productTotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Phí vận chuyển</span>
          <span className="font-semibold text-slate-900">
            {checkoutResult || (currentStep >= 2 && selectedShippingOption)
              ? formatCurrency(displayTotals.shippingFee)
              : '—'}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
          <span>Tổng cộng</span>
          <span className="text-emerald-600">{formatCurrency(displayTotals.total)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-3">
        <p className="text-sm text-slate-500">Xem lại thông tin trước khi hoàn tất, bạn vẫn có thể chỉnh sửa ở bước trước.</p>
        {checkoutError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3">{checkoutError}</p>}
        {checkoutResult?.message && (
          <div className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50 text-sm text-emerald-700">
            <p className="font-semibold text-emerald-800">Thông báo</p>
            {checkoutResult.totalPrice ? (
              <p>Vui lòng thanh toán {formatCurrency(checkoutResult.totalPrice)} để hoàn tất đơn hàng.</p>
            ) : (
              <p>{checkoutResult.message}</p>
            )}
            {checkoutResult.paymentUrl && (
              <a
                href={checkoutResult.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-700 underline mt-2"
              >
                Mở liên kết thanh toán
              </a>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            className="w-full py-3 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-50"
            disabled={!canConfirm || processing}
            onClick={onConfirm}
          >
            {processing ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
          </button>
          <button
            className="w-full py-3 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            onClick={onBack}
            disabled={currentStep === 1}
          >
            Quay lại bước trước
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary

