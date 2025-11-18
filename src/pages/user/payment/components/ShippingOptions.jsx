import React from 'react'

const ShippingOptions = ({
  selectedAddress,
  options,
  selectedOption,
  loading,
  error,
  onSelectOption,
  onRetry,
  formatCurrency
}) => {
  if (!selectedAddress) {
    return (
      <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-sm text-slate-500 bg-white">
        Vui lòng chọn địa chỉ trước để hệ thống ước tính phí vận chuyển.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-white">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        <p className="mt-3 text-sm text-slate-500">Đang ước tính phí vận chuyển...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-2xl p-6 bg-red-50 text-red-600 text-sm">
        {error}
        <button
          className="mt-3 inline-flex items-center px-4 py-2 rounded-full border border-red-200 hover:bg-red-100"
          onClick={onRetry}
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (!options.length) {
    return (
      <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-sm text-slate-500 bg-white">
        Không tìm thấy gói vận chuyển phù hợp cho địa chỉ này. Vui lòng thử địa chỉ khác.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.rateId}
          className={`flex gap-4 items-start rounded-2xl border p-4 cursor-pointer transition ${
            selectedOption?.rateId === option.rateId ? 'border-emerald-500 bg-emerald-50/70' : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <input
            type="radio"
            name="shipping"
            className="mt-1"
            value={option.rateId}
            checked={selectedOption?.rateId === option.rateId}
            onChange={() => onSelectOption(option)}
          />
          <div className="flex justify-between gap-4 w-full flex-wrap">
            <div>
              <p className="font-semibold text-slate-900">{option.carrierName}</p>
              <p className="text-sm text-slate-600">
                {option.service} • {option.estimatedDelivery}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(option.fee)}</p>
              <p className="text-xs text-slate-400">Mã gói: {option.rateId}</p>
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}

export default ShippingOptions

