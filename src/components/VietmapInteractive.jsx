import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Input, Button, message, Card, List } from 'antd'
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'

// Icon cho marker đã chọn
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

const InvalidateSizeOnMount = () => {
  const map = useMap()
  useEffect(() => {
    const invalidate = () => {
      try {
        map.invalidateSize()
      } catch {
        // ignore
      }
    }
    requestAnimationFrame(invalidate)
    const t1 = setTimeout(invalidate, 150)
    const t2 = setTimeout(invalidate, 400)
    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(invalidate)
      ro.observe(map.getContainer())
    }
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (ro) ro.disconnect()
    }
  }, [map])
  return null
}

const MapClickHandler = ({ onMapClick }) => {
  const map = useMap()
  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng
      onMapClick(lat, lng)
    }
    map.on('click', handleClick)
    return () => {
      map.off('click', handleClick)
    }
  }, [map, onMapClick])
  return null
}

/**
 * VietmapInteractive - Map với tìm kiếm địa chỉ và chọn tọa độ
 * Props:
 * - latitude, longitude: tọa độ hiện tại (optional)
 * - height: chiều cao map
 * - apiKey: Vietmap API key
 * - onLocationSelect: callback khi chọn vị trí (lat, lng, address)
 */
const VietmapInteractive = ({ 
  latitude, 
  longitude, 
  height = '400px', 
  apiKey,
  onLocationSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPos, setSelectedPos] = useState(
    latitude && longitude ? [Number(latitude), Number(longitude)] : [10.7769, 106.7009]
  )
  const [address, setAddress] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedResultIndex, setSelectedResultIndex] = useState(null)
  const mapRef = useRef(null)

  // Hàm xử lý chọn một kết quả từ danh sách
  const handleSelectResult = (feature, index) => {
    let lat, lng, addressText

    // Xử lý GeoJSON Feature format
    if (feature.geometry && feature.geometry.coordinates) {
      // GeoJSON format: coordinates = [longitude, latitude]
      const [longitude, latitude] = feature.geometry.coordinates
      lng = longitude
      lat = latitude
      // Lấy địa chỉ từ properties
      addressText = feature.properties?.name || 
                    feature.properties?.address || 
                    feature.properties?.display_name ||
                    feature.properties?.full_address ||
                    feature.properties?.label ||
                    searchQuery
    } else {
      // Format cũ (không phải GeoJSON)
      lat = feature.lat || feature.latitude
      lng = feature.lon || feature.lng || feature.longitude
      addressText = feature.address || feature.display_name || feature.name || searchQuery
    }

    if (lat && lng) {
      setSelectedPos([Number(lat), Number(lng)])
      setAddress(addressText)
      setSelectedResultIndex(index)
      
      // Cập nhật map view
      if (mapRef.current) {
        mapRef.current.setView([Number(lat), Number(lng)], 16)
      }
      
      onLocationSelect?.(Number(lat), Number(lng), addressText)
    }
  }

  const handleMapClick = (lat, lng) => {
    setSelectedPos([lat, lng])
    setSearchResults([]) // Clear search results when clicking on map
    setSelectedResultIndex(null)
    // Reverse geocoding để lấy địa chỉ
    fetch(`https://maps.vietmap.vn/api/reverse?apikey=${apiKey}&lat=${lat}&lng=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data?.address) {
          setAddress(data.data.address)
          onLocationSelect?.(lat, lng, data.data.address)
        } else {
          onLocationSelect?.(lat, lng, '')
        }
      })
      .catch(() => {
        onLocationSelect?.(lat, lng, '')
      })
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Vui lòng nhập từ khóa tìm kiếm!')
      return
    }

    if (!apiKey) {
      message.error('API key không hợp lệ!')
      return
    }

    try {
      const searchUrl = `https://maps.vietmap.vn/api/search?apikey=${apiKey}&text=${encodeURIComponent(searchQuery)}`
      const response = await fetch(searchUrl)
      
      // Kiểm tra status code
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Log để debug
      console.log('Vietmap API Response:', data)

      // Vietmap API trả về GeoJSON FeatureCollection format
      // Structure: {code: 'OK', message: null, data: {features: Array, type: 'FeatureCollection', ...}}
      let features = null
      
      // Kiểm tra format GeoJSON FeatureCollection
      if (data?.data?.features && Array.isArray(data.data.features) && data.data.features.length > 0) {
        features = data.data.features
      } else if (data?.features && Array.isArray(data.features) && data.features.length > 0) {
        features = data.features
      } else if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        // Fallback: format cũ (không phải GeoJSON)
        features = data.data
      } else if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
        features = data.results
      }

      if (features && features.length > 0) {
        // Lưu tất cả kết quả để hiển thị danh sách
        setSearchResults(features)
        
        // Tự động chọn kết quả đầu tiên
        const first = features[0]
        handleSelectResult(first, 0)
        
        message.success(`Tìm thấy ${features.length} kết quả`)
      } else {
        // Kiểm tra xem có thông báo lỗi từ API không
        if (data?.message) {
          message.error(data.message)
        } else if (data?.error) {
          message.error(data.error)
        } else {
          message.warning(`Không tìm thấy địa điểm cho "${searchQuery}". Vui lòng thử lại với từ khóa khác.`)
        }
        console.warn('No results found:', data)
      }
    } catch (error) {
      console.error('Error searching location:', error)
      message.error(`Lỗi khi tìm kiếm địa điểm: ${error.message || 'Vui lòng thử lại sau!'}`)
    }
  }

  useEffect(() => {
    if (latitude && longitude) {
      setSelectedPos([Number(latitude), Number(longitude)])
    }
  }, [latitude, longitude])

  return (
    <div className="w-full">
      <div className="mb-3 flex gap-2">
        <Input
          placeholder="Tìm kiếm địa chỉ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={handleSearch}
          size="large"
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={handleSearch} size="large" icon={<SearchOutlined />}>
          Tìm
        </Button>
      </div>
      <div style={{ width: '100%', height, minHeight: height }} className="rounded-lg overflow-hidden border">
        <MapContainer
          ref={mapRef}
          center={selectedPos}
          zoom={16}
          style={{ width: '100%', height: '100%' }}
          preferCanvas
          whenReady={(ctx) => {
            const m = ctx.target
            const invalidate = () => {
              try {
                m.invalidateSize()
              } catch {
                // ignore
              }
            }
            invalidate()
            setTimeout(invalidate, 150)
            setTimeout(invalidate, 400)
            const onResize = () => invalidate()
            window.addEventListener('resize', onResize)
            m.on('unload', () => window.removeEventListener('resize', onResize))
          }}
        >
          <TileLayer url={`https://maps.vietmap.vn/api/tm/{z}/{x}/{y}.png?apikey=${apiKey}`} attribution="Map data © Vietmap" />
          <Marker position={selectedPos} icon={selectedIcon} />
          <MapClickHandler onMapClick={handleMapClick} />
          <InvalidateSizeOnMount />
        </MapContainer>
      </div>
      {/* Danh sách kết quả tìm kiếm */}
      {searchResults.length > 0 && (
        <Card 
          title={
            <div className="flex items-center gap-2">
              <EnvironmentOutlined />
              <span>Kết quả tìm kiếm ({searchResults.length} kết quả)</span>
            </div>
          }
          className="mt-3"
          size="small"
        >
          <div className="max-h-64 overflow-y-auto">
            <List
              dataSource={searchResults}
              renderItem={(item, index) => {
                let itemName = ''
                let itemAddress = ''
                
                if (item.geometry && item.properties) {
                  itemName = item.properties?.name || item.properties?.display_name || 'Không có tên'
                  itemAddress = item.properties?.address || 
                                item.properties?.full_address || 
                                item.properties?.label || 
                                ''
                } else {
                  itemName = item.name || item.display_name || 'Không có tên'
                  itemAddress = item.address || item.full_address || ''
                }

                return (
                  <List.Item
                    className={`cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors ${
                      selectedResultIndex === index ? 'bg-blue-50 border border-blue-300' : ''
                    }`}
                    onClick={() => handleSelectResult(item, index)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                        selectedResultIndex === index ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 mb-1">
                          {itemName}
                        </div>
                        {itemAddress && (
                          <div className="text-sm text-gray-600">
                            {itemAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )
              }}
            />
          </div>
        </Card>
      )}
      
      {address && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>Địa chỉ đã chọn:</strong> {address}
        </div>
      )}
      <div className="mt-1 text-xs text-gray-500">
        <strong>Tọa độ:</strong> {selectedPos[0].toFixed(6)}, {selectedPos[1].toFixed(6)}
      </div>
    </div>
  )
}

export default VietmapInteractive

