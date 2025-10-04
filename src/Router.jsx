import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/user/landingpage/LandingPage'
import ShopPage from './pages/user/shop/ShopPage'
import ProductDetail from './pages/user/shop/ProductDetail'
import EventPage from './pages/user/events/EventPage'
import EventDetail from './pages/user/events/EventDetail'

const router = createBrowserRouter([
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
    ]
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router