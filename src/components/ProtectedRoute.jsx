import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getUserInfo, isLoggedIn } from '../utils/authHelper'

/**
 * ProtectedRoute - Bảo vệ routes theo role
 * @param {React.ReactNode} children - Component con
 * @param {string[]} allowedRoles - Danh sách roles được phép truy cập
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  
  useEffect(() => {
    console.log('🔐 [ProtectedRoute] Checking access...')
    console.log('📍 [ProtectedRoute] Current path:', location.pathname)
    console.log('🎭 [ProtectedRoute] Allowed roles:', allowedRoles)
    
    // Kiểm tra đã đăng nhập chưa
    const loggedIn = isLoggedIn()
    console.log('👤 [ProtectedRoute] Is logged in:', loggedIn)
    
    if (!loggedIn) {
      console.log('❌ [ProtectedRoute] Not logged in, redirecting to /login')
      setIsChecking(false)
      setHasAccess(false)
      return
    }
    
    // Lấy thông tin user và check role
    const userInfo = getUserInfo()
    console.log('👤 [ProtectedRoute] User info:', userInfo)
    
    if (!userInfo || !userInfo.roles) {
      console.log('❌ [ProtectedRoute] No user info or roles found')
      setIsChecking(false)
      setHasAccess(false)
      return
    }
    
    // Kiểm tra user có role được phép không
    const userRoles = userInfo.roles || []
    const hasRequiredRole = allowedRoles.some(role => 
      userRoles.map(r => r.toUpperCase()).includes(role.toUpperCase())
    )
    
    console.log('🎭 [ProtectedRoute] User roles:', userRoles)
    console.log('✅ [ProtectedRoute] Has required role:', hasRequiredRole)
    
    setHasAccess(hasRequiredRole)
    setIsChecking(false)
  }, [location.pathname, allowedRoles])
  
  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Đang kiểm tra quyền truy cập...</p>
        </motion.div>
      </div>
    )
  }
  
  // Không đăng nhập -> redirect to login
  if (!isLoggedIn()) {
    console.log('🔄 [ProtectedRoute] Redirecting to /login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // Không có quyền -> redirect to home với thông báo
  if (!hasAccess) {
    console.log('🔄 [ProtectedRoute] Access denied, redirecting to /')
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location,
          message: 'Bạn không có quyền truy cập trang này'
        }} 
        replace 
      />
    )
  }
  
  // Có quyền -> render children
  console.log('✅ [ProtectedRoute] Access granted, rendering children')
  return children
}

export default ProtectedRoute

