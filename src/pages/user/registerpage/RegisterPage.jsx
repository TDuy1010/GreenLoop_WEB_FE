import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'
import recyclingImage from '../../../assets/images/Uncover the truth about plastic recycling with….jpg'
import { registerUser, verifyEmail, resendVerifyEmailOTP } from '../../../service/api/authAPI'
import VerifyEmailModal from '../../../components/VerifyEmailModal'
import SuccessModal from '../../../components/SuccessModal'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Verify Email Modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  
  // Success Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại'
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ'
    }

    // Bỏ validation agreeToTerms vì không có trong form
    // if (!formData.agreeToTerms) {
    //   newErrors.agreeToTerms = 'Vui lòng đồng ý với điều khoản sử dụng'
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🎯 [Register] Form submitted!')
    console.log('📋 [Register] Current form data:', formData)
    
    const isValid = validateForm()
    console.log('✔️ [Register] Validation result:', isValid)
    console.log('❌ [Register] Validation errors:', errors)
    
    if (!isValid) {
      console.log('⛔ [Register] Validation failed, stopping...')
      return
    }

    setIsLoading(true)
    console.log('📝 [Register] Submitting registration:', formData)
    
    try {
      // Chuẩn bị data theo format API
      const registerData = {
        email: formData.email,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }

      console.log('🔄 [Register] Calling API with:', registerData)
      
      // Gọi API register
      const response = await registerUser(registerData)
      
      console.log('✅ [Register] Success:', response)
      message.success(response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.')
      
      // Lưu email và mở modal verify
      setRegisteredEmail(formData.email)
      setShowVerifyModal(true)
      
    } catch (error) {
      console.error('❌ [Register] Error:', error)
      
      // Xử lý các lỗi cụ thể
      const errorMessage = error.message || 'Đăng ký thất bại. Vui lòng thử lại!'
      
      // Hiển thị message error
      message.error(errorMessage)
      
      // Set errors cho từng field cụ thể
      const newErrors = {}
      
      // Check nếu lỗi về email
      if (errorMessage.toLowerCase().includes('email')) {
        newErrors.email = errorMessage
      }
      
      // Check nếu lỗi về số điện thoại
      if (errorMessage.toLowerCase().includes('số điện thoại') || 
          errorMessage.toLowerCase().includes('phone')) {
        newErrors.phoneNumber = errorMessage
      }
      
      // Check nếu lỗi về mật khẩu
      if (errorMessage.toLowerCase().includes('mật khẩu') || 
          errorMessage.toLowerCase().includes('password')) {
        newErrors.password = errorMessage
      }
      
      // Set tất cả errors
      setErrors(prev => ({
        ...prev,
        ...newErrors,
        submit: errorMessage
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Handler verify OTP
  const handleVerifyOTP = async (otpCode) => {
    console.log('🔐 [Register] Verifying OTP:', otpCode)
    setIsVerifying(true)

    try {
      const response = await verifyEmail({ 
        email: registeredEmail,
        otp: otpCode 
      })

      console.log('✅ [Register] Verify success:', response)
      
      // Đóng verify modal
      setShowVerifyModal(false)
      
      // Hiển thị success modal
      setShowSuccessModal(true)
      
      // Chuyển đến trang login sau 3s
      setTimeout(() => {
        setShowSuccessModal(false)
        navigate('/login')
      }, 3000)
      
    } catch (error) {
      console.error('❌ [Register] Verify error:', error)
      message.error(error.message || 'Mã OTP không đúng. Vui lòng thử lại!')
    } finally {
      setIsVerifying(false)
    }
  }

  // Handler resend OTP
  const handleResendOTP = async () => {
    console.log('📧 [Register] Resending OTP to:', registeredEmail)
    
    try {
      const response = await resendVerifyEmailOTP({ email: registeredEmail })
      console.log('✅ [Register] Resend success:', response)
      message.success('Đã gửi lại mã OTP đến email của bạn!')
    } catch (error) {
      console.error('❌ [Register] Resend error:', error)
      message.error(error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau!')
    }
  }

  // Handler close verify modal
  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false)
    // User có thể resend OTP hoặc đăng nhập sau
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 to-green-800/80"></div>
        
        

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          {/* Logo */}
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

          {/* Welcome Text */}
          <motion.div
            className="text-center max-w-md mb-12"
            variants={fadeIn}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Tham gia GreenLoop</h2>
            <p className="text-green-100 text-lg leading-relaxed">
              Kết nối với cộng đồng yêu thời trang bền vững. 
              Chia sẻ, trao đổi và cùng nhau bảo vệ hành tinh xanh.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 gap-6 max-w-sm"
            variants={fadeIn}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-4 text-green-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-medium">Cộng đồng 10,000+ thành viên</span>
            </div>
            <div className="flex items-center gap-4 text-green-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="font-medium">Tiết kiệm đến 70% chi phí</span>
            </div>
            <div className="flex items-center gap-4 text-green-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-medium">Góp phần bảo vệ môi trường</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
        initial="hidden"
        animate="visible"
        variants={slideInRight}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-md space-y-8 py-8">
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

          {/* Header */}
          <motion.div
            className="text-center lg:text-left"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h2>
            <p className="text-gray-600">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Đăng nhập
              </Link>
            </p>
          </motion.div>

          {/* Register Form */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="steve.madden@gmail.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và Tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                    errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+84911772199"
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="2003-10-10"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Hãy nhập Mật Khẩu của bạn"
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
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Hãy nhập lại Mật Khẩu của bạn"
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
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </motion.button>
            </form>
          </motion.div>

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

      {/* Verify Email Modal */}
      <VerifyEmailModal
        isOpen={showVerifyModal}
        email={registeredEmail}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onClose={handleCloseVerifyModal}
        isLoading={isVerifying}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="🎉 Đăng ký thành công!"
        message="Xác thực email hoàn tất. Đang chuyển đến trang đăng nhập..."
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/login')
        }}
      />
    </div>
  )
}

export default RegisterPage