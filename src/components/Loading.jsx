import React from 'react'

const Loading = ({ message = 'Đang tải...', fullScreen = false, className = '' }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50'
    : 'w-full flex items-center justify-center py-8'

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex items-center gap-3 text-gray-600">
        <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

export default Loading


