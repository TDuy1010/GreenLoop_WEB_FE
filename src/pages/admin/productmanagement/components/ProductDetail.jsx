import React from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Space,
  Image,
  Badge
} from 'antd'
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  TagOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  EyeOutlined,
  HeartOutlined,
  StarOutlined,
  InfoCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons'

const ProductDetail = ({ visible, onClose, product }) => {
  if (!product) return null

  const statusConfig = {
    available: { color: 'green', text: 'Có sẵn', icon: <CheckCircleOutlined /> },
    sold: { color: 'blue', text: 'Đã bán', icon: <CheckCircleOutlined /> },
    pending: { color: 'orange', text: 'Chờ duyệt', icon: <CloseCircleOutlined /> },
    rejected: { color: 'red', text: 'Từ chối', icon: <CloseCircleOutlined /> },
    reserved: { color: 'purple', text: 'Đã đặt', icon: <CheckCircleOutlined /> }
  }

  const conditionConfig = {
    'Rất tốt': { color: 'green', text: 'Rất tốt' },
    'Tốt': { color: 'blue', text: 'Tốt' },
    'Khá': { color: 'orange', text: 'Khá' },
    'Cần sửa chữa': { color: 'red', text: 'Cần sửa chữa' }
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="product-detail-modal"
    >
      {/* Header Section with Images */}
      <div className="py-6 bg-gradient-to-r from-green-50 to-emerald-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex gap-4 mb-4">
            {/* Main Image */}
            <div className="flex-shrink-0">
              <Image
                width={200}
                height={200}
                src={product.images?.[0]}
                alt={product.name}
                className="rounded-lg object-cover shadow-lg"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-3">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tags?.map(tag => (
                  <Tag key={tag} color="blue" icon={<TagOutlined />}>
                    {tag}
                  </Tag>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Tag 
                  color={statusConfig[product.status]?.color || 'default'}
                  icon={statusConfig[product.status]?.icon}
                  className="text-sm px-3 py-1"
                >
                  {statusConfig[product.status]?.text || product.status}
                </Tag>
                <Tag 
                  color={conditionConfig[product.condition]?.color || 'default'}
                  className="text-sm px-3 py-1"
                >
                  {conditionConfig[product.condition]?.text || product.condition}
                </Tag>
                {product.isApproved && (
                  <Tag color="green" icon={<CheckCircleOutlined />} className="text-sm px-3 py-1">
                    Đã duyệt
                  </Tag>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1).map((img, index) => (
                <Image
                  key={index}
                  width={80}
                  height={80}
                  src={img}
                  alt={`${product.name} ${index + 2}`}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <AppstoreOutlined className="mr-2" />
            Thông tin sản phẩm
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <ShoppingOutlined className="text-blue-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Danh mục</div>
                <div className="text-sm font-medium text-gray-900">{product.category}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <TagOutlined className="text-purple-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Thương hiệu</div>
                <div className="text-sm font-medium text-gray-900">{product.brand}</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex items-center gap-3">
              <InfoCircleOutlined className="text-cyan-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Size</div>
                <div className="text-sm font-medium text-gray-900">{product.size}</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex items-center gap-3">
              <InfoCircleOutlined className="text-pink-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Màu sắc</div>
                <div className="text-sm font-medium text-gray-900">{product.color}</div>
              </div>
            </div>
          </Col>
          <Col span={8}>
            <div className="flex items-center gap-3">
              <InfoCircleOutlined className="text-orange-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Chất liệu</div>
                <div className="text-sm font-medium text-gray-900">{product.material}</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <InfoCircleOutlined className="text-gray-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Trọng lượng</div>
                <div className="text-sm font-medium text-gray-900">{product.weight} kg</div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <InfoCircleOutlined className="text-gray-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Kích thước</div>
                <div className="text-sm font-medium text-gray-900">{product.dimensions}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Location & Dates */}
      <Card 
        title={
          <span className="text-base font-semibold text-gray-700">
            <HomeOutlined className="mr-2" />
            Vị trí & Thời gian
          </span>
        }
        className="mb-4 shadow-sm"
        size="small"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <HomeOutlined className="text-green-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Kho lưu trữ</div>
                <div className="text-sm font-medium text-gray-900">
                  <Tag color="purple">{product.location}</Tag>
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center gap-3">
              <CalendarOutlined className="text-orange-500 text-lg" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Ngày quyên góp</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(product.donationDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </Col>
          {product.approvedDate && (
            <Col span={12}>
              <div className="flex items-center gap-3">
                <CalendarOutlined className="text-green-500 text-lg" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Ngày duyệt</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(product.approvedDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </Col>
          )}
          {product.approvedBy && (
            <Col span={12}>
              <div className="flex items-center gap-3">
                <CheckCircleOutlined className="text-green-500 text-lg" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Người duyệt</div>
                  <div className="text-sm font-medium text-gray-900">{product.approvedBy}</div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Card>

      {/* Pricing & Statistics */}
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <DollarOutlined className="mr-2" />
                Giá cả
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giá bán:</span>
                <span className="text-xl font-bold text-green-600">
                  {product.price?.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giá gốc:</span>
                <span className="text-sm line-through text-gray-400">
                  {product.originalPrice?.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="p-2 bg-green-50 rounded text-center">
                <span className="text-sm text-green-700 font-medium">
                  Tiết kiệm {(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Card>
        </Col>
         <Col span={12}>
           <Card 
             title={
               <span className="text-base font-semibold text-gray-700">
                 <StarOutlined className="mr-2" />
                 Thống kê
               </span>
             }
             className="shadow-sm"
             size="small"
           >
             <div className="text-center ">
               <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mb-3">
                 <StarOutlined className="text-xl text-yellow-600" />
               </div>
               <div className="text-xl font-bold text-yellow-600 mb-1">
                 {product.ecoPoints || 0}
               </div>
               <div className="text-sm text-gray-600 font-medium">Eco Points</div>
               <div className="mt-3 text-xs text-gray-500">
                 Điểm thưởng cho sản phẩm thân thiện môi trường
               </div>
             </div>
           </Card>
         </Col>
      </Row>
    </Modal>
  )
}

export default ProductDetail

