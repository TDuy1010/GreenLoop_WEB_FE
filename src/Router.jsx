import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import LandingPage from './pages/user/landingpage/LandingPage'
import ShopPage from './pages/user/shop/ShopPage'
import ProductDetail from './pages/user/shop/ProductDetail'
import EventPage from './pages/user/events/EventPage'
import EventDetail from './pages/user/events/EventDetail'
import LoginPage from './pages/user/loginpage/LoginPage'
import RegisterPage from './pages/user/registerpage/RegisterPage'
import DashboardPage from './pages/admin/dashboard/DashboardPage'
import StaffManagement from './pages/admin/StaffManagement/StaffManagement'
import EventManagement from './pages/admin/eventmanagemt/EventManagement'
import UserManagement from './pages/admin/usermanagement/UserManagement'
import ProductManagement from './pages/admin/productmanagement/ProductManagement'
import WarehouseManagement from './pages/admin/warehousemanagement/WarehouseManagement'
import DonationManagement from './pages/admin/donationmanagement/DonationManagement'
import AdminErrorPage from './pages/admin/AdminErrorPage'
import ErrorPage from './pages/ErrorPage'

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
        path: 'shop/:id',
        element: <ProductDetail />
      },
      {
        path: 'events',
        element: <EventPage />
      },
      {
        path: 'events/:id',
        element: <EventDetail />
      }
    ],
    errorElement: <ErrorPage />
  },
  
  // Admin routes with AdminLayout
  {
    path: '/admin',
    element: <AdminLayout />,
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
        element: <AdminErrorPage />
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