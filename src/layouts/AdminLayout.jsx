import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ConfigProvider, theme, Button } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Sidebar from '../components/Sidebar'

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Xác định trang hiện tại dựa trên path
  const getCurrentPageTitle = () => {
    const path = location.pathname
    
    if (path.includes('dashboard')) return 'Bảng điều khiển'
    if (path.includes('staff')) return 'Quản lý nhân viên'
    if (path.includes('users')) return 'Quản lý người dùng'
    if (path.includes('products')) return 'Quản lý sản phẩm'
    if (path.includes('warehouses')) return 'Quản lý kho'
    if (path.includes('events')) return 'Quản lý sự kiện'
    if (path.includes('donations')) return 'Quản lý quyên góp'
    if (path.includes('orders')) return 'Quản lý đơn hàng'
    if (path.includes('analytics')) return 'Thống kê & Báo cáo'
    if (path.includes('settings')) return 'Cài đặt hệ thống'
    
    return 'Quản trị viên'
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#16a34a', // green-600
          borderRadius: 8,
        },
        components: {
          Menu: {
            itemSelectedBg: '#f0f9ff',
            itemSelectedColor: '#16a34a',
            itemHoverBg: '#f9fafb',
          }
        },
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={setSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <div className={`transition-all duration-200 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Header */}
          <header className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Toggle Button + Page Title */}
              <div className="flex items-center gap-4">
                <Button
                  type="text"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  className="text-base w-10 h-10 flex items-center justify-center"
                />
                <h1 className="text-2xl font-semibold text-gray-900 m-0">
                  {getCurrentPageTitle()}
                </h1>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-4 ml-auto">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg border-none bg-transparent cursor-pointer transition-colors hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    3
                  </span>
                </button>

                {/* User Profile */}
                <div className="relative inline-block">
                  <button className="flex items-center gap-3 p-2 rounded-lg border-none bg-transparent cursor-pointer transition-colors hover:bg-gray-100">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">A</span>
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-900 m-0">Admin User</p>
                      <p className="text-xs text-gray-500 m-0">admin@greenloop.com</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default AdminLayout
