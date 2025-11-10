import React, { useEffect, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'

// Sửa lỗi icon bị vỡ khi bundle
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

/**
 * Vietmap (react-leaflet) – giữ nguyên props hiện có
 */
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
    // ngay sau khi mount và sau một nhịp layout
    requestAnimationFrame(invalidate)
    const t1 = setTimeout(invalidate, 150)
    const t2 = setTimeout(invalidate, 400)
    // theo dõi resize container
    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(invalidate)
      ro.observe(map.getContainer())
    }
    return () => {
      clearTimeout(t1); clearTimeout(t2)
      if (ro) ro.disconnect()
    }
  }, [map])
  return null
}

const Vietmap = ({ latitude, longitude, height = '300px', apiKey, zoom = 16 }) => {
  const center = useMemo(() => {
    const lat = Number(latitude)
    const lng = Number(longitude)
    return [isNaN(lat) ? 10.7769 : lat, isNaN(lng) ? 106.7009 : lng]
  }, [latitude, longitude])

  return (
    <div style={{ width: '100%', height, minHeight: height, position: 'relative', zIndex: 1 }} className="rounded-lg overflow-hidden border">
      <MapContainer
        key={`${center[0]},${center[1]}`}
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        preferCanvas
        whenReady={(ctx) => {
          const m = ctx.target
          const invalidate = () => {
            try { m.invalidateSize() } catch {
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
        <Marker position={center} icon={defaultIcon} />
        <InvalidateSizeOnMount />
      </MapContainer>
    </div>
  )
}

export default Vietmap



