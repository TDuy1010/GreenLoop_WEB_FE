import React from 'react'
import { motion } from 'framer-motion'

const AddressConfirmModal = ({ modal, onCancel, onConfirm }) => {
  if (!modal) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4"
      >
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{modal.title}</h3>
          <p className="text-sm text-slate-500">{modal.message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50" onClick={onCancel}>
            Hủy
          </button>
          <button className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600" onClick={onConfirm}>
            {modal.actionLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AddressConfirmModal

