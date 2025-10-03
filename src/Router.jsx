import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/user/landingpage/LandingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      }
    ]
  }
])

const Router = () => {
  return <RouterProvider router={router} />
}

export default Router