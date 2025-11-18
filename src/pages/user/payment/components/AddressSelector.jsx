import React from 'react'

const AddressSelector = ({
  addresses,
  selectedAddressId,
  loading,
  error,
  onSelect,
  onAddNewAddress,
  onManageAddress
}) => {
  if (loading) {
    return (
      <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-slate-500">Đang tải địa chỉ giao hàng...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-2xl p-6 bg-red-50 text-red-600">
        {error}
        <button
          className="mt-4 inline-flex items-center px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-100"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (!addresses.length) {
    return (
      <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white">
        <div className="text-3xl mb-3">📦</div>
        <p className="text-slate-600">Bạn chưa có địa chỉ giao hàng nào.</p>
        <button className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white font-semibold" onClick={onAddNewAddress}>
          Thêm địa chỉ mới
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <label
          key={addr.id}
          className={`flex gap-4 items-start rounded-2xl border p-4 cursor-pointer transition ${
            selectedAddressId === addr.id ? 'border-emerald-500 bg-emerald-50/70' : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <input
            type="radio"
            className="mt-1"
            name="address"
            value={addr.id}
            checked={selectedAddressId === addr.id}
            onChange={() => onSelect(addr.id)}
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">{addr.recipientName || 'Người nhận'}</p>
              {addr.isDefault && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-600">Mặc định</span>
              )}
            </div>
            <p className="text-sm text-slate-600">{addr.addressLine}</p>
            <p className="text-sm text-slate-500 mt-1">{addr.recipientPhone}</p>
          </div>
        </label>
      ))}
      <button className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 underline" onClick={onManageAddress}>
        Quản lý địa chỉ trong hồ sơ
      </button>
    </div>
  )
}

export default AddressSelector

