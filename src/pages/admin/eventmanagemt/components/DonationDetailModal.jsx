import React from 'react'
import { Modal, Card, Row, Col, Table, Skeleton, Empty, Image } from 'antd'

const DonationDetailModal = ({
  visible,
  loading,
  donation,
  onClose
}) => {
  return (
    <Modal
      title={`Chi tiết donation ${donation?.code || ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {loading ? (
        <div className="py-10 flex justify-center">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : donation ? (
        <>
          <Card size="small" className="mb-4">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="text-xs text-gray-500">Tổng sản phẩm</div>
                <div className="text-lg font-semibold text-gray-900">
                  {donation.totalItems?.toLocaleString('vi-VN')}
                </div>
              </Col>
              <Col span={12}>
                <div className="text-xs text-gray-500">Tổng trọng lượng (kg)</div>
                <div className="text-lg font-semibold text-gray-900">
                  {donation.totalWeight?.toLocaleString('vi-VN')}
                </div>
              </Col>
              <Col span={12}>
                <div className="text-xs text-gray-500">Tổng Eco Points</div>
                <div className="text-lg font-semibold text-emerald-600">
                  {donation.totalEcoPoints?.toLocaleString('vi-VN')}
                </div>
              </Col>
              <Col span={12}>
                <div className="text-xs text-gray-500">Người kiểm định</div>
                <div className="text-sm font-medium text-gray-900">
                  {donation.inspectedName || '-'}
                </div>
              </Col>
            </Row>
          </Card>
          <Table
            size="small"
            dataSource={donation.donationItems || []}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Ảnh',
                key: 'images',
                render: (_, record) => {
                  const images = Array.isArray(record.imageUrls)
                    ? record.imageUrls
                    : record.imageUrl
                      ? [record.imageUrl]
                      : []
                  if (images.length === 0) {
                    return (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )
                  }
                  return (
                    <div className="flex gap-2">
                      {images.slice(0, 3).map((url, idx) => (
                        <Image
                          key={`${record.id}-img-${idx}`}
                          src={url}
                          alt={`donation-item-${idx}`}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      ))}
                      {images.length > 3 && (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                          +{images.length - 3}
                        </div>
                      )}
                    </div>
                  )
                }
              },
              { title: 'Mã sản phẩm', dataIndex: 'code', key: 'code' },
              { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
              { title: 'Danh mục', dataIndex: 'categoryName', key: 'categoryName' },
              { title: 'Tình trạng', dataIndex: 'conditionGrade', key: 'conditionGrade' },
              {
                title: 'Eco Points',
                dataIndex: 'ecoPoints',
                key: 'ecoPoints',
                render: (value) => Number(value || 0).toLocaleString('vi-VN')
              }
            ]}
          />
        </>
      ) : (
        <Empty description="Không tìm thấy dữ liệu donation" />
      )}
    </Modal>
  )
}

export default DonationDetailModal

