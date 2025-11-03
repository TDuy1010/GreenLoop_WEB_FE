import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { message } from 'antd'
import recyclingImage from '../../../assets/images/Uncover the truth about plastic recycling with….jpg'
import { loginUser } from '../../../service/api/authAPI'
import { isValidEmail, redirectAfterLogin, formatAuthError } from '../../../utils/authHelper'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const [loginError, setLoginError] = useState('') // Lỗi chung khi login fail

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error khi user nhập lại
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear login error khi user bắt đầu nhập lại
    if (loginError) {
      setLoginError('')
    }
    
    // Real-time validation
    if (name === 'email' && value && !isValidEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: 'Email không hợp lệ'
      }))
    }
    
    if (name === 'password' && value && value.length < 6) {
      setErrors(prev => ({
        ...prev,
        password: 'Mật khẩu phải có ít nhất 6 ký tự'
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form trước khi gửi
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Gọi API login
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      })
      
      if (response.success) {
        message.success('Đăng nhập thành công!')
        
        // Redirect về trang trước đó hoặc theo role
        setTimeout(() => {
          const from = location.state?.from?.pathname
          
          if (from && from !== '/login') {
            // Redirect về trang user định truy cập trước đó
            console.log('🔄 [Login] Redirecting to previous page:', from)
            window.location.href = from
          } else {
            // Redirect theo role mặc định
            const userRoles = response.data?.roles || []
            redirectAfterLogin(userRoles)
          }
        }, 500)
      } else {
        // API trả về success: false - xử lý lỗi
        console.error('❌ [Login] Failed:', response)
        
        const errorMsg = response.message || 'Đăng nhập thất bại!'
        
        // Chỉ set lỗi chung, không set lỗi vào từng field
        setLoginError(errorMsg)
        
        // Hiển thị toast
        message.error({
          content: errorMsg,
          duration: 4,
          style: {
            marginTop: '20vh'
          }
        })
      }
    } catch (error) {
      console.error('❌ [Login] Error caught:', error)
      
      // Axios interceptor đã reject error.response.data, nên error chính là response data
      const errorData = error.message ? error : error.response?.data || error
      const { message: errorMsg, statusCode } = errorData
      
      console.log('📋 [Login] Error details:', { errorMsg, statusCode, errorData })
      
      // Nếu có message từ API
      if (errorMsg) {
        // Chỉ set lỗi chung
        setLoginError(errorMsg)
        
        message.error({
          content: errorMsg,
          duration: 4,
          style: {
            marginTop: '20vh'
          }
        })
      } 
      // Không có message - có thể là lỗi network
      else {
        console.error('❌ [Login] Network or unknown error')
        const errorMessage = formatAuthError(error)
        
        setLoginError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.')
        
        message.error({
          content: errorMessage,
          duration: 4
        })
      }
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
            <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h2>
            <p className="text-green-100 text-lg leading-relaxed">
              Tiếp tục hành trình thời trang bền vững cùng GreenLoop. 
              Trao đổi, mua sắm và góp phần bảo vệ môi trường.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Trao đổi quần áo miễn phí</span>
            </div>
            <div className="flex items-center gap-4 text-green-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="font-medium">Kiếm điểm sinh thái</span>
            </div>
            <div className="flex items-center gap-4 text-green-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-medium">Cộng đồng yêu môi trường</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
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

          {/* Header */}
          <motion.div
            className="text-center lg:text-left"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                Đăng ký
              </Link>
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                    className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                        : formData.email && !errors.email && isValidEmail(formData.email)
                        ? 'border-green-500 focus:ring-green-500 bg-green-50'
                        : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                    }`}
                    placeholder="admin@greenloop.com"
                    autoComplete="email"
                  />
                  
                  {/* Success Icon */}
                  {formData.email && !errors.email && isValidEmail(formData.email) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Error Icon */}
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                        : formData.password && !errors.password && formData.password.length >= 6
                        ? 'border-green-500 focus:ring-green-500 bg-green-50'
                        : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  
                  {/* Toggle Password Visibility */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Login Error Message */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{loginError}</span>
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password || errors.email || errors.password}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition ${
                  isLoading || !formData.email || !formData.password || errors.email || errors.password
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
                whileHover={!isLoading && formData.email && formData.password && !errors.email && !errors.password ? { scale: 1.02 } : {}}
                whileTap={!isLoading && formData.email && formData.password && !errors.email && !errors.password ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Đăng nhập
                  </>
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
    </div>
  )
}

export default LoginPage