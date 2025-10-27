import React from 'react'
import { 
  Modal, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Progress
} from 'antd'
import { 
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

const WarehouseDetail = ({ visible, onClose, warehouse }) => {
  if (!warehouse) return null

  const statusConfig = {
    active: { color: 'green', text: 'Hoạt động', icon: <CheckCircleOutlined /> },
    inactive: { color: 'default', text: 'Không hoạt động', icon: <CloseCircleOutlined /> },
    maintenance: { color: 'orange', text: 'Bảo trì', icon: <ClockCircleOutlined /> },
    full: { color: 'red', text: 'Đầy', icon: <ExclamationCircleOutlined /> }
  }

  const typeConfig = {
    main: { color: 'blue', text: 'Kho chính' },
    branch: { color: 'purple', text: 'Kho chi nhánh' },
    temporary: { color: 'orange', text: 'Kho tạm' }
  }

  const occupancyRate = Math.round((warehouse.currentStock / warehouse.capacity) * 100)
  const availableSpace = warehouse.capacity - warehouse.currentStock

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="warehouse-detail-modal"
    >
      {/* Header Section */}
      <div className="py-6 bg-gradient-to-r from-blue-50 to-green-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
        <div className="px-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <HomeOutlined className="text-blue-600" />
                {warehouse.name}
              </h2>
              <p className="text-gray-600 mt-1">ID: WH-{String(warehouse.id).padStart(3, '0')}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Tag 
                color={statusConfig[warehouse.status]?.color || 'default'}
                icon={statusConfig[warehouse.status]?.icon}
                className="text-base px-4 py-1"
              >
                {statusConfig[warehouse.status]?.text || warehouse.status}
              </Tag>
              <Tag 
                color={typeConfig[warehouse.type]?.color || 'default'}
                className="text-sm px-3 py-1"
              >
                {typeConfig[warehouse.type]?.text || warehouse.type}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col span={16}>
          {/* Manager Information */}
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <UserOutlined className="mr-2" />
                Thông tin quản lý
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <UserOutlined className="text-blue-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Người quản lý</div>
                    <div className="text-sm font-medium text-gray-900">{warehouse.manager}</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-green-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Số điện thoại</div>
                    <div className="text-sm font-medium text-gray-900">{warehouse.phone}</div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-purple-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium text-gray-900">{warehouse.email}</div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="flex items-start gap-3">
                  <EnvironmentOutlined className="text-red-500 text-lg mt-1" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Địa chỉ</div>
                    <div className="text-sm font-medium text-gray-900">{warehouse.address}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Warehouse Information */}
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <HomeOutlined className="mr-2" />
                Thông tin kho
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-orange-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Ngày thành lập</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(warehouse.establishedDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <ClockCircleOutlined className="text-cyan-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Giờ làm việc</div>
                    <div className="text-sm font-medium text-gray-900">{warehouse.operatingHours}</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <AppstoreOutlined className="text-purple-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Số lượng sản phẩm</div>
                    <div className="text-sm font-medium text-gray-900">{warehouse.totalProducts} sản phẩm</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="flex items-center gap-3">
                  <CalendarOutlined className="text-green-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Cập nhật lần cuối</div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(warehouse.lastUpdated).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Categories */}
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <AppstoreOutlined className="mr-2" />
                Danh mục sản phẩm
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <div className="flex flex-wrap gap-2">
              {warehouse.categories?.map(category => (
                <Tag key={category} color="blue" className="px-3 py-1">
                  {category}
                </Tag>
              ))}
            </div>
          </Card>

          {/* Facilities */}
          <Card 
            title={
              <span className="text-base font-semibold text-gray-700">
                <SafetyOutlined className="mr-2" />
                Tiện ích & Trang thiết bị
              </span>
            }
            className="shadow-sm"
            size="small"
          >
            <div className="flex flex-wrap gap-2">
              {warehouse.facilities?.map(facility => (
                <Tag key={facility} color="green" icon={<CheckCircleOutlined />} className="px-3 py-1">
                  {facility}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Column - Capacity Stats */}
        <Col span={8}>
          {/* Capacity Overview */}
          <Card 
            title={
              <span className="text-sm font-semibold text-gray-700">
                <InboxOutlined className="mr-2" />
                Công suất kho
              </span>
            }
            className="mb-4 shadow-sm"
            size="small"
          >
            <div className="text-center mb-4">
              <Progress
                type="circle"
                percent={occupancyRate}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                format={percent => (
                  <div>
                    <div className="text-2xl font-bold">{percent}%</div>
                    <div className="text-xs text-gray-500">Sử dụng</div>
                  </div>
                )}
              />
            </div>
            
            <Divider className="my-3" />
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Tổng công suất</div>
                <div className="text-lg font-bold text-blue-600">
                  {warehouse.capacity.toLocaleString()} m³
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Đã sử dụng</div>
                <div className="text-lg font-bold text-green-600">
                  {warehouse.currentStock.toLocaleString()} m³
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Còn trống</div>
                <div className="text-lg font-bold text-orange-600">
                  {availableSpace.toLocaleString()} m³
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Card size="small" className="text-center bg-blue-50">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {warehouse.totalProducts}
                </div>
                <div className="text-xs text-gray-600">Sản phẩm</div>
              </Card>
            </Col>
            <Col span={24}>
              <Card size="small" className="text-center bg-green-50">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {warehouse.categories?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Danh mục</div>
              </Card>
            </Col>
            <Col span={24}>
              <Card size="small" className="text-center bg-purple-50">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {warehouse.facilities?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Tiện ích</div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}

export default WarehouseDetail

