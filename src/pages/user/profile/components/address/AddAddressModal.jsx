import React from 'react'
import { motion } from 'framer-motion'

const AddAddressModal = ({
  open,
  formData,
  cities,
  districts,
  wards,
  submitting,
  error,
  isValid,
  onClose,
  onChange,
  onSubmit,
  onCityChange,
  onDistrictChange,
  onWardChange,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-3xl p-8 space-y-6 border border-emerald-50"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500 font-semibold mb-2">Địa chỉ mới</p>
            <h3 className="text-2xl font-bold text-slate-900">Thêm địa chỉ nhận hàng</h3>
          </div>
          <button className="text-slate-400 hover:text-slate-600 text-xl" onClick={onClose} disabled={submitting}>
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Tên người nhận*</label>
              <input
                name="recipientName"
                value={formData.recipientName}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Số điện thoại*</label>
              <input
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={onChange}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="09xx xxx xxx"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Địa chỉ chi tiết*</label>
            <textarea
              name="addressLine"
              value={formData.addressLine}
              onChange={onChange}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              rows={3}
              placeholder="Số nhà, tên đường..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Tỉnh/Thành phố*</label>
              <select
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                value={formData.city ? `${formData.city}|${formData.cityName}` : ''}
                onChange={onCityChange}
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {cities.map((cityItem) => (
                  <option key={cityItem.id} value={`${cityItem.id}|${cityItem.name}`}>
                    {cityItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Quận/Huyện*</label>
              <select
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                value={formData.district ? `${formData.district}|${formData.districtName}` : ''}
                onChange={onDistrictChange}
                disabled={!districts.length}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((districtItem) => (
                  <option key={districtItem.id} value={`${districtItem.id}|${districtItem.name}`}>
                    {districtItem.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500">Phường/Xã*</label>
              <select
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-white"
                value={formData.wardCode ? `${formData.wardCode}|${formData.ward}` : ''}
                onChange={onWardChange}
                disabled={!wards.length}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((wardItem) => (
                  <option key={wardItem.id} value={`${wardItem.id}|${wardItem.name}`}>
                    {wardItem.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Ghi chú giao hàng</label>
            <input
              name="deliveryNote"
              value={formData.deliveryNote}
              onChange={onChange}
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Ví dụ: giao giờ hành chính"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={onChange}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
            />
            Đặt làm địa chỉ mặc định
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !isValid}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddAddressModal

