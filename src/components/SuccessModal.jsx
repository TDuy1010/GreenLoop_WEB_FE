import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Success Modal - Hiển thị thông báo thành công đẹp
 * @param {boolean} isOpen - Trạng thái hiển thị
 * @param {string} title - Tiêu đề
 * @param {string} message - Nội dung
 * @param {function} onClose - Callback khi đóng (optional)
 */
const SuccessModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null

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
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Icon with Animation */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                  }}
                  className="mx-auto w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-600 text-base"
                >
                  {message}
                </motion.p>
              </div>

              {/* Decorative particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0,
                      scale: 0,
                      x: '50%',
                      y: '50%'
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 1.5],
                      x: `${50 + Math.cos(i * 60 * Math.PI / 180) * 100}%`,
                      y: `${50 + Math.sin(i * 60 * Math.PI / 180) * 100}%`
                    }}
                    transition={{ 
                      duration: 1,
                      delay: 0.3 + i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{ left: 0, top: 0 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SuccessModal

