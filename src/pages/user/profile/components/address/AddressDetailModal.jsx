import React from 'react'
import { motion } from 'framer-motion'

const AddressDetailModal = ({ modal, onClose }) => {
  if (!modal) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg p-7 space-y-4 border border-slate-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500 font-semibold mb-2">Chi tiết địa chỉ</p>
            <h3 className="text-2xl font-bold text-slate-900">Thông tin đầy đủ</h3>
          </div>
          <button className="text-slate-400 hover:text-slate-600 text-xl" onClick={onClose}>
            ✕
          </button>
        </div>

        {modal.loading ? (
          <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
            <p>Đang tải chi tiết...</p>
          </div>
        ) : modal.error ? (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-2xl border border-red-100">{modal.error}</div>
        ) : (
          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Người nhận</p>
                <p className="text-base font-semibold text-slate-900">{modal.data?.recipientName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Số điện thoại</p>
                <p className="text-base font-semibold text-slate-900">{modal.data?.recipientPhone}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Địa chỉ</p>
              <p className="text-base font-semibold text-slate-900">{modal.data?.addressLine}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Phường/Xã</p>
                <p className="font-medium text-slate-900">{modal.data?.ward}</p>
                <p className="text-xs text-slate-400">Mã: {modal.data?.wardCode}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Quận/Huyện</p>
                <p className="font-medium text-slate-900">{modal.data?.districtName}</p>
                <p className="text-xs text-slate-400">Mã: {modal.data?.district}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Tỉnh/Thành phố</p>
              <p className="font-medium text-slate-900">{modal.data?.cityName}</p>
              <p className="text-xs text-slate-400">Mã: {modal.data?.city}</p>
            </div>
            {modal.data?.deliveryNote && (
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Ghi chú giao hàng</p>
                <p className="text-slate-900">{modal.data.deliveryNote}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-400">Mặc định</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  modal.data?.isDefault ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {modal.data?.isDefault ? 'Có' : 'Không'}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AddressDetailModal

