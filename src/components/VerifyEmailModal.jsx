import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { message } from 'antd'

/**
 * Verify Email Modal - Xác thực email bằng OTP
 * @param {boolean} isOpen - Trạng thái hiển thị modal
 * @param {string} email - Email cần verify
 * @param {function} onVerify - Callback khi verify thành công (otpCode)
 * @param {function} onResend - Callback khi resend OTP
 * @param {function} onClose - Callback khi đóng modal
 * @param {boolean} isLoading - Trạng thái loading khi verify
 * @param {string} title - Tiêu đề modal (optional)
 * @param {string} description - Mô tả modal (optional)
 */
const VerifyEmailModal = ({ 
  isOpen, 
  email,
  onVerify, 
  onResend,
  onClose,
  isLoading = false,
  title = "Xác thực Email",
  description = "Chúng tôi đã gửi mã OTP gồm 6 số đến email của bạn. Vui lòng kiểm tra hộp thư và nhập mã bên dưới."
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  // Countdown timer for resend
  useEffect(() => {
    if (!isOpen) {
      setResendTimer(60)
      setCanResend(false)
      return
    }

    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
  }, [resendTimer, canResend, isOpen])

  // Reset OTP khi mở modal
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }, [isOpen])

  const handleChange = (index, value) => {
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Chỉ lấy 1 ký tự cuối

    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Bỏ auto submit - để user tự bấm nút
    // if (index === 5 && value) {
    //   const otpCode = [...newOtp.slice(0, 5), value].join('')
    //   if (otpCode.length === 6) {
    //     handleVerify(otpCode)
    //   }
    // }
  }

  const handleKeyDown = (index, e) => {
    // Backspace: xóa và focus input trước
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Arrow keys navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) {
      message.warning('Vui lòng paste mã OTP hợp lệ (6 chữ số)')
      return
    }

    const newOtp = pastedData.split('')
    while (newOtp.length < 6) newOtp.push('')
    
    setOtp(newOtp)
    
    // Focus vào ô cuối
    inputRefs.current[pastedData.length - 1]?.focus()

    // Bỏ auto verify khi paste - để user tự bấm nút
    // if (pastedData.length === 6) {
    //   handleVerify(pastedData)
    // }
  }

  const handleVerify = (otpCode = null) => {
    const code = otpCode || otp.join('')
    
    if (code.length !== 6) {
      message.warning('Vui lòng nhập đủ 6 số OTP')
      return
    }

    console.log('🔐 [VerifyEmail] Verifying OTP:', code)
    onVerify(code)
  }

  const handleResend = async () => {
    if (!canResend) return
    
    console.log('📧 [VerifyEmail] User clicked resend OTP')
    console.log('📧 [VerifyEmail] Sending OTP to:', email)
    
    // Reset OTP input
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    
    // Gọi API resend
    await onResend()
    
    // Reset countdown sau khi gửi thành công
    setResendTimer(60)
    setCanResend(false)
  }

  const handleClose = () => {
    if (isLoading) return
    setOtp(['', '', '', '', '', ''])
    onClose()
  }

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
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                {!isLoading && (
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div className="bg-white px-8 pt-8 pb-6">
                  {/* Icon */}
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 text-center mb-2">
                    {description}
                  </p>
                  <p className="text-sm text-center mb-6">
                    <span className="font-semibold text-green-600">{email}</span>
                  </p>

                  {/* OTP Input */}
                  <div className="flex justify-center gap-2 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                        className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all
                          ${digit ? 'border-green-500 bg-green-50' : 'border-gray-300'}
                          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-400'}
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                        `}
                      />
                    ))}
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center mb-6">
                    {canResend ? (
                      <button
                        onClick={handleResend}
                        className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline transition"
                      >
                        Gửi lại mã OTP
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Gửi lại mã sau <span className="font-semibold text-green-600">{resendTimer}s</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-8 py-4">
                  <button
                    type="button"
                    onClick={() => handleVerify()}
                    disabled={isLoading || otp.join('').length !== 6}
                    className={`w-full inline-flex justify-center items-center rounded-lg px-6 py-3 text-base font-semibold text-white transition
                      ${isLoading || otp.join('').length !== 6
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xác thực...
                      </>
                    ) : (
                      'Xác thực Email'
                    )}
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

export default VerifyEmailModal

