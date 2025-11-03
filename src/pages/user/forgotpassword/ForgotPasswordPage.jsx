import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import recyclingImage from '../../../assets/images/reformation-hero-image-e1692133079876.jpg'
import { forgotPassword, resetPassword, resendResetPasswordOTP } from '../../../service/api/authAPI'
import { isValidEmail } from '../../../utils/authHelper'
import VerifyEmailModal from '../../../components/VerifyEmailModal'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  
  // Step states: 'email' -> 'otp' -> 'password' -> 'success'
  const [currentStep, setCurrentStep] = useState('email')
  
  // Form data
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false)

  // ===== STEP 1: Nhập Email =====
  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    // Validate email
    if (!email) {
      setErrors({ email: 'Vui lòng nhập email' })
      return
    }
    
    if (!isValidEmail(email)) {
      setErrors({ email: 'Email không hợp lệ' })
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      console.log('📧 [ForgotPassword] Sending OTP to:', email)
      
      const response = await forgotPassword(email)
      
      console.log('✅ [ForgotPassword] OTP sent:', response)
      
      message.success('Mã OTP đã được gửi đến email của bạn!')
      
      // Chuyển sang bước nhập OTP
      setShowOtpModal(true)
      
    } catch (error) {
      console.error('❌ [ForgotPassword] Send OTP error:', error)
      message.error(error.message || 'Không thể gửi mã OTP. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  // ===== STEP 2: Xác thực OTP =====
  const handleVerifyOTP = async (otpCode) => {
    console.log('🔐 [ForgotPassword] Verifying OTP:', otpCode)
    
    try {
      setOtp(otpCode)
      
      // Đóng modal và chuyển sang step nhập password
      setShowOtpModal(false)
      setCurrentStep('password')
      
      message.success('Xác thực OTP thành công!')
      
    } catch (error) {
      console.error('❌ [ForgotPassword] Verify OTP error:', error)
      throw error
    }
  }

  // ===== RESEND OTP =====
  const handleResendOTP = async () => {
    try {
      console.log('🔄 [ForgotPassword] Resending OTP to:', email)
      
      await resendResetPasswordOTP({ email })
      
      message.success('Đã gửi lại mã OTP!')
      
    } catch (error) {
      console.error('❌ [ForgotPassword] Resend OTP error:', error)
      message.error('Không thể gửi lại mã OTP. Vui lòng thử lại!')
    }
  }

  // ===== STEP 3: Đặt mật khẩu mới =====
  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    // Validate
    const newErrors = {}
    
    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      console.log('🔐 [ForgotPassword] Resetting password with OTP:', otp)
      
      const response = await resetPassword({
        email: email,
        otp: otp,
        newPassword: newPassword
      })
      
      console.log('✅ [ForgotPassword] Password reset success:', response)
      
      // Chuyển sang step success
      setCurrentStep('success')
      
    } catch (error) {
      console.error('❌ [ForgotPassword] Reset password error:', error)
      message.error(error.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image Panel */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={slideInLeft}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `url(${recyclingImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-800/80"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            className="flex items-center gap-4 mb-8"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            <motion.svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </motion.svg>
            <h1 className="text-4xl font-bold">GreenLoop</h1>
          </motion.div>

          <motion.div
            className="text-center max-w-md mb-12"
            variants={fadeIn}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Đặt lại mật khẩu</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Đừng lo lắng! Chúng tôi sẽ giúp bạn lấy lại quyền truy cập tài khoản một cách an toàn.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-4 max-w-sm"
            variants={fadeIn}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Xác thực qua email</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Bảo mật tuyệt đối</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial="hidden"
        animate="visible"
        variants={slideInRight}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <motion.div
              className="flex justify-center items-center gap-3 mb-6"
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              <motion.svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </motion.svg>
              <h1 className="text-3xl font-bold text-gray-900">GreenLoop</h1>
            </motion.div>
          </div>

          {/* STEP 1: Nhập Email */}
          {currentStep === 'email' && (
            <>
              <motion.div
                className="text-center lg:text-left"
                variants={fadeIn}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h2>
                <p className="text-gray-600">
                  Nhập email của bạn để nhận mã xác thực
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-8"
                variants={fadeIn}
                transition={{ delay: 0.4 }}
              >
                <form className="space-y-6" onSubmit={handleSendOTP}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setErrors({})
                      }}
                      className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                      }`}
                      placeholder="your-email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi mã xác thực'
                    )}
                  </motion.button>

                  <div className="text-center">
                    <Link to="/login" className="text-sm text-green-600 hover:text-green-700 font-medium">
                      ← Quay lại đăng nhập
                    </Link>
                  </div>
                </form>
              </motion.div>
            </>
          )}

          {/* STEP 3: Đặt mật khẩu mới */}
          {currentStep === 'password' && (
            <>
              <motion.div
                className="text-center lg:text-left"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt mật khẩu mới</h2>
                <p className="text-gray-600">
                  Nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-8"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <form className="space-y-6" onSubmit={handleResetPassword}>
                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value)
                          setErrors(prev => ({ ...prev, newPassword: '' }))
                        }}
                        className={`block w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.newPassword
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder="Nhập mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setErrors(prev => ({ ...prev, confirmPassword: '' }))
                        }}
                        className={`block w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.confirmPassword
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                        }`}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    }`}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      'Đặt lại mật khẩu'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </>
          )}

          {/* STEP 4: Success */}
          {currentStep === 'success' && (
            <>
              <motion.div
                className="text-center"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="mx-auto w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Thành công!</h2>
                <p className="text-gray-600 mb-8">
                  Mật khẩu của bạn đã được đặt lại thành công.
                </p>

                <motion.button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đăng nhập ngay
                </motion.button>
              </motion.div>
            </>
          )}

          {/* Back to Home */}
          <motion.div
            className="text-center"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Về trang chủ
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* OTP Modal */}
      <VerifyEmailModal
        isOpen={showOtpModal}
        email={email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onClose={() => setShowOtpModal(false)}
        isLoading={false}
        title="Xác thực mã OTP"
        description="Chúng tôi đã gửi mã OTP gồm 6 số đến email của bạn. Vui lòng kiểm tra hộp thư và nhập mã bên dưới."
      />
    </div>
  )
}

export default ForgotPasswordPage

