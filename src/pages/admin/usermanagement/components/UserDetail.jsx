import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Modal, 
  Avatar, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  Space,
  Badge,
  Spin,
  message,
  Empty
} from 'antd'
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  GiftOutlined,
  StarOutlined
} from '@ant-design/icons'
import { getCustomerById } from '../../../../service/api/customerApi'
import { getEcoPointsByUserId } from '../../../../service/api/ecoPointsApi'

const deriveEcoTransactionMeta = (tx = {}) => {
  const description = tx?.description || tx?.action || 'Giao dịch điểm'
  const actionType = (tx?.type || tx?.actionType || tx?.action || '').toUpperCase()
  const numericPoints = Number(tx?.points ?? tx?.point ?? tx?.pointChanged ?? tx?.amount ?? 0) || 0
  const isSpend = actionType.includes('SPEND') || actionType.includes('REDEEM') || actionType.includes('USE')
  const absPoints = Math.abs(numericPoints)
  const timestamp = tx?.createdAt ? new Date(tx.createdAt).getTime() : null
  return { description, actionType, numericPoints, absPoints, isSpend, timestamp }
}

const groupEcoTransactions = (list = []) => {
  const map = new Map()
  list.forEach((tx, index) => {
    const meta = deriveEcoTransactionMeta(tx)
    const key = `${meta.description}|${meta.actionType}|${meta.isSpend}|${meta.absPoints}`
    if (!map.has(key)) {
      map.set(key, {
        meta,
        count: 0,
        latestTimestamp: meta.timestamp ?? 0,
        latestTx: tx,
        firstIndex: index
      })
    }
    const group = map.get(key)
    group.count += 1
    if ((meta.timestamp ?? 0) > group.latestTimestamp) {
      group.latestTimestamp = meta.timestamp ?? 0
      group.latestTx = tx
    }
  })

  return Array.from(map.values()).sort((a, b) => {
    if (b.latestTimestamp === a.latestTimestamp) {
      return a.firstIndex - b.firstIndex
    }
    return b.latestTimestamp - a.latestTimestamp
  })
}

const UserDetail = ({ visible, onClose, user }) => {
  const [customerDetail, setCustomerDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ecoPointInfo, setEcoPointInfo] = useState({
    totalPoints: 0,
    lifetimePoints: 0,
    transactions: []
  })
  const [ecoPointLoading, setEcoPointLoading] = useState(false)

  const fetchEcoPointInfo = useCallback(async (customerId) => {
    try {
      setEcoPointLoading(true)
      const response = await getEcoPointsByUserId(customerId)
      const data = response?.data ?? response
      setEcoPointInfo({
        totalPoints: data?.totalPoints ?? 0,
        lifetimePoints: data?.lifetimePoints ?? 0,
        transactions: Array.isArray(data?.transactions) ? data.transactions : []
      })
    } catch (error) {
      console.error('Error fetching eco point info:', error)
      message.error('Không thể tải thông tin điểm Eco của khách hàng!')
      setEcoPointInfo({
        totalPoints: 0,
        lifetimePoints: 0,
        transactions: []
      })
    } finally {
      setEcoPointLoading(false)
    }
  }, [])

  const fetchCustomerDetail = useCallback(async (customerId) => {
    try {
      setLoading(true)
      const response = await getCustomerById(customerId)
      
      if (response.success && response.data) {
        // Map API data to component format
        const normalizedGender =
          typeof response.data.gender === 'string'
            ? response.data.gender.trim().toLowerCase()
            : 'other'
        const genderValue = ['male', 'female', 'other'].includes(normalizedGender)
          ? normalizedGender
          : 'other'

        const mappedData = {
          id: response.data.id,
          name: response.data.fullName,
          email: response.data.email,
          phone: response.data.phoneNumber || 'Chưa có',
          gender: genderValue,
          dateOfBirth: response.data.dateOfBirth,
          address: 'Chưa cập nhật',
          joinDate: response.data.createdAt,
          status: response.data.isActive ? 'active' : 'inactive',
          isVerified: response.data.isEmailVerified,
          avatar: response.data.avatarUrl,
          totalOrders: 0,
          totalSpent: 0,
          ecoPoints: 0,
          lastLogin: response.data.updatedAt,
          accountType: 'standard',
          donationCount: 0,
          eventParticipation: 0
        }
        setCustomerDetail(mappedData)
      }
    } catch (error) {
      console.error('Error fetching customer detail:', error)
      message.error('Không thể tải thông tin chi tiết khách hàng!')
      onClose()
    } finally {
      setLoading(false)
    }
  }, [onClose])

  useEffect(() => {
    if (visible && user?.id) {
      fetchCustomerDetail(user.id)
      fetchEcoPointInfo(user.id)
    }
  }, [visible, user?.id, fetchCustomerDetail, fetchEcoPointInfo])

  const handleClose = () => {
    setCustomerDetail(null)
    onClose()
  }

  const groupedEcoTransactions = useMemo(
    () => groupEcoTransactions(ecoPointInfo.transactions),
    [ecoPointInfo.transactions]
  )

  if (!visible) return null

  const accountTypeConfig = {
    standard: { color: 'blue', text: 'Tiêu chuẩn' },
    premium: { color: 'purple', text: 'Premium' },
    vip: { color: 'gold', text: 'VIP' }
  }

  const genderConfig = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Chưa cập nhật'
  }

  const displayUser = customerDetail || user

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={700}
      className="user-detail-modal"
    >
      <Spin spinning={loading} tip="Đang tải thông tin...">
        {displayUser && (
          <>
            {/* Header Section with Avatar and Basic Info */}
            <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 -mt-6 -mx-6 mb-6 rounded-t-lg">
              <Badge 
                dot={displayUser.status === 'active'} 
                status={displayUser.status === 'active' ? 'success' : 'default'}
                offset={[-10, 85]}
              >
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  src={displayUser.avatar}
                  className="bg-blue-100 text-blue-600 border-4 border-white shadow-lg"
                />
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {displayUser.name}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <Tag color={accountTypeConfig[displayUser.accountType]?.color || 'blue'} className="text-sm px-3 py-1">
                  {accountTypeConfig[displayUser.accountType]?.text || displayUser.accountType}
                </Tag>
                <Tag 
                  color={displayUser.status === 'active' ? 'green' : 'red'} 
                  icon={<CheckCircleOutlined />}
                  className="text-sm px-3 py-1"
                >
                  {displayUser.status === 'active' ? 'Active' : 'Inactive'}
                </Tag>
                {displayUser.isVerified && (
                  <Tag color="green" icon={<CheckCircleOutlined />} className="text-sm px-3 py-1">
                    Đã xác thực
                  </Tag>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thông tin liên hệ
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-blue-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium text-gray-900">{displayUser.email}</div>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center gap-3">
                  <PhoneOutlined className="text-green-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Số điện thoại</div>
                    <div className="text-sm font-medium text-gray-900">{displayUser.phone}</div>
                  </div>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center gap-3">
                  <EnvironmentOutlined className="text-red-500 text-lg" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Địa chỉ</div>
                    <div className="text-sm font-medium text-gray-900">{displayUser.address}</div>
                  </div>
                </div>
              </Space>
            </Card>

            {/* Personal Information */}
            <Card 
              title={
                <span className="text-base font-semibold text-gray-700">
                  Thông tin cá nhân
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <UserOutlined className="text-purple-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Giới tính</div>
                      <div className="text-sm font-medium text-gray-900">{genderConfig[displayUser.gender]}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-orange-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Ngày sinh</div>
                      <div className="text-sm font-medium text-gray-900">
                        {displayUser.dateOfBirth ? new Date(displayUser.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <CalendarOutlined className="text-cyan-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Ngày tham gia</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(displayUser.joinDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-start gap-3">
                    <StarOutlined className="text-yellow-500 text-lg mt-1" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Điểm Eco</div>
                      <div className="text-base font-bold text-yellow-600">
                        {ecoPointInfo.totalPoints ?? displayUser.ecoPoints ?? 0} EP
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Eco Point Detail */}
            <Card
              title={
                <span className="text-base font-semibold text-gray-700">
                  Điểm Eco & giao dịch
                </span>
              }
              className="mb-4 shadow-sm"
              size="small"
            >
              <Spin spinning={ecoPointLoading}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Điểm hiện có</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {(ecoPointInfo.totalPoints ?? 0).toLocaleString('vi-VN')} điểm
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Điểm tích lũy</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {(ecoPointInfo.lifetimePoints ?? 0).toLocaleString('vi-VN')} điểm
                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider />
                <div className="text-sm font-semibold text-gray-700 mb-3">Lịch sử giao dịch</div>
                {groupedEcoTransactions.length === 0 ? (
                  <Empty description="Chưa có giao dịch điểm" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <div className="max-h-64 overflow-auto pr-2 space-y-3">
                    {groupedEcoTransactions.map((group, index) => {
                      const { meta, latestTx, count } = group
                      const amountText = `${meta.isSpend ? '-' : '+'}${meta.absPoints.toLocaleString('vi-VN')} điểm`
                      const dateText = latestTx?.createdAt
                        ? new Date(latestTx.createdAt).toLocaleString('vi-VN')
                        : 'Không xác định'
                      return (
                        <div
                          key={`${meta.description}-${meta.actionType}-${index}`}
                          className="p-3 border border-gray-100 rounded-xl bg-gray-50"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium text-gray-900">
                              {meta.description}
                            </div>
                            <div className="flex items-center gap-2">
                              {count > 1 && (
                                <Tag color="blue" className="text-xs font-semibold px-2">
                                  x{count}
                                </Tag>
                              )}
                              <Tag color={meta.isSpend ? 'red' : 'green'} className="text-sm font-semibold">
                                {amountText}
                              </Tag>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {dateText} • {meta.actionType || 'Không xác định'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Spin>
            </Card>

          </>
        )}
      </Spin>
    </Modal>
  )
}

export default UserDetail

