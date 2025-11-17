import React from 'react'
import {
  Modal,
  Tag,
  Row,
  Col,
  Card,
  Image
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  TagOutlined,
  CalendarOutlined,
  DollarOutlined,
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
      <div className="py-6 bg-gradient-to-r from-green-50 to-emerald-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex gap-4 mb-4">
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

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-3">{product.description}</p>

              {product.code && (
                <div className="text-sm text-gray-500 mb-3">
                  Mã sản phẩm: <span className="font-medium">{product.code}</span>
                </div>
              )}

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
              </div>
            </div>
          </div>

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
          {product.type && (
            <Col span={12}>
              <div className="flex items-center gap-3">
                <TagOutlined className="text-purple-500 text-lg" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Loại sản phẩm</div>
                  <Tag color={product.type === 'DONATION' ? 'green' : 'blue'}>
                    {product.type === 'DONATION' ? 'Quyên góp' : 'Mua'}
                  </Tag>
                </div>
              </div>
            </Col>
          )}
          {product.code && (
            <Col span={12}>
              <div className="flex items-center gap-3">
                <InfoCircleOutlined className="text-cyan-500 text-lg" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Mã sản phẩm</div>
                  <div className="text-sm font-medium text-gray-900">{product.code}</div>
                </div>
              </div>
            </Col>
          )}
          {product.createdAt && (
            <Col span={12}>
              <div className="flex items-center gap-3">
                <CalendarOutlined className="text-orange-500 text-lg" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Ngày tạo</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Card>

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
            </div>
          </Card>
        </Col>
      </Row>
    </Modal>
  )
}

export default ProductDetail

