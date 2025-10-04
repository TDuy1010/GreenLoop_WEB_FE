import React, { useCallback, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

// Component hiển thị map khi Google Maps API load thành công
const MapComponent = ({ center, zoom, markers = [] }) => {
  const [map, setMap] = useState(null)

  const ref = useCallback((node) => {
    if (node !== null && !map) {
      const newMap = new window.google.maps.Map(node, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
      setMap(newMap)

      // Thêm markers
      markers.forEach(marker => {
        new window.google.maps.Marker({
          position: marker.position,
          map: newMap,
          title: marker.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#10b981"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        })
      })
    }
  }, [center, zoom, markers, map])

  return <div ref={ref} className="w-full h-full" />
}

// Component hiển thị loading state
const LoadingComponent = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
      <p className="text-gray-600 text-sm">Đang tải bản đồ...</p>
    </div>
  </div>
)

// Component hiển thị error state
const ErrorComponent = ({ error }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center">
      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-gray-600 text-sm">Không thể tải bản đồ</p>
      <p className="text-gray-400 text-xs mt-1">{error?.message}</p>
    </div>
  </div>
)

// Component chính Google Maps
const GoogleMap = ({ 
  center = { lat: 10.7769, lng: 106.7009 }, // Default: TP.HCM
  zoom = 15,
  height = '300px',
  markers = [],
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY' // Lấy từ env
}) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />
      case Status.FAILURE:
        return <ErrorComponent error={new Error('Failed to load Google Maps')} />
      case Status.SUCCESS:
        return <MapComponent center={center} zoom={zoom} markers={markers} />
      default:
        return <LoadingComponent />
    }
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border" style={{ height }}>
      <Wrapper apiKey={apiKey} render={render} />
    </div>
  )
}

export default GoogleMap
