import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { message } from 'antd'
import { isAuthenticated, getUserInfo, logoutUser, logoutFromServer } from '../service/api/authApi'
import ConfirmModal from './ConfirmModal'

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkAuth = () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true)
        const info = getUserInfo()
        setUserInfo(info)
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
      }
    }

    checkAuth()

    // Listen for storage changes (khi login/logout ở tab khác)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  const handleLogoutClick = () => {
    console.log('🚪 [Logout] User clicked logout button')
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    console.log('✅ [Logout] User confirmed logout')
    console.log('📦 [Logout] Current tokens:', {
      accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
      refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
      userInfo: localStorage.getItem('userInfo')
    })
    
    setShowLogoutModal(false)
    
    try {
      console.log('🔄 [Logout] Calling API logout...')
      await logoutFromServer()
      
      console.log('✅ [Logout] API logout success')
      console.log('🗑️ [Logout] Tokens after logout:', {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        userInfo: localStorage.getItem('userInfo')
      })
      
      message.success('Đăng xuất thành công!')
      
      console.log('🔄 [Logout] Redirecting to home page...')
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    } catch (error) {
      console.error('❌ [Logout] API error:', error)
      
      // Nếu API lỗi, vẫn logout ở client
      console.log('🔄 [Logout] Fallback to client logout')
      logoutUser()
      
      console.log('🗑️ [Logout] Tokens after client logout:', {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        userInfo: localStorage.getItem('userInfo')
      })
      
      message.warning('Đã đăng xuất khỏi thiết bị này')
      
      console.log('🔄 [Logout] Redirecting to home page...')
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    }
  }

  const handleLogoutCancel = () => {
    console.log('❌ [Logout] User cancelled logout')
    setShowLogoutModal(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-10 py-4">
        <div className=" px-11 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-2xl font-bold text-gray-900">GreenLoop</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* <Link to="/" className="text-gray-600 hover:text-green-600 transition font-medium">
              Trang chủ
            </Link> */}
            <Link to="/events" className="text-gray-600 hover:text-green-600 transition font-medium">
              Sự kiện
            </Link>
            <Link to="/shop" className="text-gray-600 hover:text-green-600 transition font-medium">
              Cửa hàng
            </Link>
            <Link to="/blogs" className="text-gray-600 hover:text-green-600 transition font-medium">
              Blog
            </Link> <Link to="/about-us" className="text-gray-600 hover:text-green-600 transition font-medium">
              Về chúng tôi
            </Link>
          </nav>

          {/* Right Icons */}
          <div className=" px-4 flex items-center gap-6">
            {/* Notification - Chỉ hiện khi đã đăng nhập */}
            {isLoggedIn && (
              <button className="relative text-gray-600 hover:text-green-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">3</span>
              </button>
            )}

            {/* Messages/Chat - Chỉ hiện khi đã đăng nhập */}
            {isLoggedIn && (
              <Link to="/chat" className="relative text-gray-600 hover:text-green-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  AI
                </span>
              </Link>
            )}

            {isLoggedIn ? (
              // User Profile Dropdown - Khi đã đăng nhập
              <div className="relative group">
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                    {userInfo?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {userInfo?.fullName || 'User'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{userInfo?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {userInfo?.roles?.includes('ADMIN') ? 'Quản trị viên' : 
                         userInfo?.roles?.includes('STAFF') ? 'Nhân viên' : 'Khách hàng'}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Tài khoản của tôi
                      </div>
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Đơn hàng của tôi
                      </div>
                    </Link>

                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Cài đặt
                      </div>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogoutClick}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Login & Register Buttons - Khi chưa đăng nhập
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-600 font-medium transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        type="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </header>
  )
}

export default Header