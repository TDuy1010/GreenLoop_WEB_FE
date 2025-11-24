import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/user/landingpage/LandingPage'
import ShopPage from './pages/user/shop/ShopPage'
import ProductDetail from './pages/user/shop/ProductDetail'
import EventPage from './pages/user/events/EventPage'
import EventDetail from './pages/user/events/EventDetail'
import MyEventsPage from './pages/user/profile/components/MyEventsPage'
import LoginPage from './pages/user/loginpage/LoginPage'
import RegisterPage from './pages/user/registerpage/RegisterPage'
import ForgotPasswordPage from './pages/user/forgotpassword/ForgotPasswordPage'
import DashboardPage from './pages/admin/dashboard/DashboardPage'
import AdminProfile from './pages/admin/profile/AdminProfile'
import StaffManagement from './pages/admin/staffmanagement/StaffManagement'
import EventManagement from './pages/admin/eventmanagemt/EventManagement'
import UserManagement from './pages/admin/usermanagement/UserManagement'
import ProductManagement from './pages/admin/productmanagement/ProductManagement'
import CategoryManagement from './pages/admin/categorymanagement/CategoryManagement'
import EcoPointRuleManagement from './pages/admin/ecopointrulemanagement/EcoPointRuleManagement'
import BlogManagement from './pages/admin/blogmanagement/BlogManagement'
import NotificationManagement from './pages/admin/notificationmanagement/NotificationManagement'
import WarehouseManagement from './pages/admin/warehousemanagement/WarehouseManagement'
import DonationManagement from './pages/admin/donationmanagement/DonationManagement'
import OrderManagement from './pages/admin/ordermanagement/OrderManagement'
import VoucherCampaignManagement from './pages/admin/vouchermanagement/VoucherCampaignManagement'
import AdminErrorPage from './pages/admin/AdminErrorPage'
import ErrorPage from './pages/ErrorPage'
import AboutUsPage from './pages/user/aboutus/AboutUsPage'
import BlogPage from './pages/user/blog/BlogPage'
import ChatPage from './pages/user/chat/ChatPage'
import ProfilePage from './pages/user/profile/ProfilePage'
import CartPage from './pages/user/cart/CartPage'
import PaymentPage from './pages/user/payment/PaymentPage'
import PaymentSuccessPage from './pages/user/payment/PaymentSuccessPage'
import PaymentFailPage from './pages/user/payment/PaymentFailPage'
import OrderSuccessPage from './pages/user/order/OrderSuccessPage'

const router = createBrowserRouter([
  // User routes with MainLayout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'shop',
        element: <ShopPage />
      },
      {
        path: 'shop/product/:id',
        element: <ProductDetail />
      },
      {
        path: 'events',
        element: <EventPage />
      },
      {
        path: 'my-events',
        element: <MyEventsPage />
      },
      {
        path: 'events/:id',
        element: <EventDetail />
      },
      {
        path: 'about-us',
        element: <AboutUsPage />
      },
      {
        path:'blogs',
        element:<BlogPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'payment',
        element: <PaymentPage />
      },
      {
        path: 'payments/success',
        element: <PaymentSuccessPage />
      },
      {
        path: 'payments/fail',
        element: <PaymentFailPage />
      },
      {
        path: 'orders/success',
        element: <OrderSuccessPage />
      }
        
    ],
    errorElement: <ErrorPage />
  },
  
  // Admin routes with AdminLayout (Protected - chỉ ADMIN, MANAGER, STAFF)
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF', 'STORE_MANAGER', 'SUPPORT_STAFF', 'SUPPPORTS_STAFF']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'profile',
        element: <AdminProfile />
      },
        {
          path: 'staff',
          element: <StaffManagement />
        },
        {
          path: 'users',
          element: <UserManagement />
        },
        {
          path: 'products',
          element: <ProductManagement />
        },
        {
          path: 'categories',
          element: <CategoryManagement />
        },
        {
          path: 'eco-rules',
          element: <EcoPointRuleManagement />
        },
        {
          path: 'blogs',
          element: <BlogManagement />
        },
        {
          path: 'notifications',
          element: <NotificationManagement />
        },
        {
          path: 'warehouses',
          element: <WarehouseManagement />
        },
        {
          path: 'events',
          element: <EventManagement />
        },
      {
        path: 'donations',
        element: <DonationManagement />
      },
      {
        path: 'orders',
        element: <OrderManagement />
      },
      {
        path: 'vouchers',
        element: <Navigate to="/admin/vouchers/campaigns" replace />
      },
      {
        path: 'vouchers/campaigns',
        element: <VoucherCampaignManagement />
      },
      {
        path: 'analytics',
        element: <AdminErrorPage />
      },
      {
        path: 'settings',
        element: <AdminErrorPage />
      }
    ],
    errorElement: <AdminErrorPage />
  },
  
  // Auth routes (without any layout)
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  
  // Catch-all route for 404 and development pages
  {
    path: '*',
    element: <ErrorPage />
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router