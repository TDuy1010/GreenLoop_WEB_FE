import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Custom Confirm Modal - Professional & Beautiful
 * @param {boolean} isOpen - Trạng thái hiển thị modal
 * @param {string} title - Tiêu đề modal
 * @param {string} message - Nội dung thông báo
 * @param {function} onConfirm - Callback khi xác nhận
 * @param {function} onCancel - Callback khi hủy
 * @param {string} confirmText - Text nút xác nhận (default: "Xác nhận")
 * @param {string} cancelText - Text nút hủy (default: "Hủy")
 * @param {string} type - Loại modal: 'danger' | 'warning' | 'info' (default: 'info')
 */
const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "info"
}) => {
  if (!isOpen) return null

  // Icon dựa vào type
  const getIcon = () => {
    switch(type) {
      case 'danger':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  // Button style dựa vào type
  const getConfirmButtonStyle = () => {
    switch(type) {
      case 'danger':
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      case 'warning':
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998] backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-6 pt-6 pb-4">
                  {/* Icon */}
                  <div className="mb-4">
                    {getIcon()}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    {title}
                  </h3>

                  {/* Message */}
                  <p className="text-sm text-gray-600 text-center mb-6">
                    {message}
                  </p>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-1/2 inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className={`w-full sm:w-1/2 inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${getConfirmButtonStyle()}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal

