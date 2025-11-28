import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Table, Button, Space, Tag, message, Switch, Card, Typography, Divider } from 'antd'
import { CheckCircleOutlined, UserOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { getEmployees } from '../../../../service/api/employeeApi'
import { updateEventStaffs } from '../../../../service/api/eventApi'
import { hasRole } from '../../../../utils/authHelper'

const { Text } = Typography

const EventStaffEditor = ({ visible, onClose, eventId, assigned = [], onSaved }) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [allEmployees, setAllEmployees] = useState([])
  const [current, setCurrent] = useState([])
  const [selectedToAdd, setSelectedToAdd] = useState([])
  const [storeManagerIds, setStoreManagerIds] = useState(new Set())
  const [conflictModal, setConflictModal] = useState({ open: false, message: '', staffNames: [] })
  const [errorModal, setErrorModal] = useState({ open: false, title: '', message: '' })
  const [successModal, setSuccessModal] = useState(false)
  const [updatedStaffList, setUpdatedStaffList] = useState(null)

  useEffect(() => {
    if (visible) {
      // Khởi tạo danh sách hiện tại và loại trùng theo staffId
      const initMap = new Map()
      assigned.forEach(s => {
        const id = Number(s.id)
        initMap.set(id, { staffId: id, fullName: s.fullName, email: s.email, storeManager: !!s.storeManager })
      })
      setCurrent(Array.from(initMap.values()))
      setSelectedToAdd([])
      setStoreManagerIds(new Set())
      setSuccessModal(false)
      setUpdatedStaffList(null)
      ;(async () => {
        try {
          setLoading(true)
          const res = await getEmployees({ page: 0, size: 100, sortBy: 'createdAt', sortDir: 'DESC' })
          const list = res?.data?.content || []
          setAllEmployees(list.map(e => ({ id: e.id, fullName: e.fullName || e.email, email: e.email, roles: e.roles || [] })))
        } catch (e) {
          setAllEmployees([])
        } finally {
          setLoading(false)
        }
      })()
    } else {
      // Reset state khi modal đóng
      setSuccessModal(false)
      setUpdatedStaffList(null)
    }
  }, [visible, assigned])

  const isStoreManager = hasRole('STORE_MANAGER') || hasRole('ADMIN')

  // Danh sách nhân viên có thể chọn (chưa được phân công)
  const selectableEmployees = useMemo(() => {
    const currentIds = new Set(current.map(c => Number(c.staffId)))
    return allEmployees.filter(emp => !currentIds.has(Number(emp.id)))
  }, [allEmployees, current])

  // Danh sách nhân viên đã chọn để thêm
  const selectedStaffs = selectableEmployees.filter(e => selectedToAdd.includes(e.id))

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    ...(isStoreManager ? [{ 
      title: 'Quản lý', key: 'storeManager',
      render: (_, record) => (
        <Switch size="small" checked={record.storeManager} onChange={(val) => {
          setCurrent(prev => prev.map(it => it.staffId === record.staffId ? { ...it, storeManager: val } : it))
        }} />
      )
    }] : []),
    { 
      title: 'Hành động', key: 'actions', width: 120,
      render: (_, record) => (
        <Button 
          danger 
          size="small" 
          onClick={() => {
            const id = Number(record.staffId)
            setCurrent(prev => prev.filter(it => Number(it.staffId) !== id))
            // Nếu đang chọn để thêm lại, cũng loại khỏi lựa chọn/manager set để tránh trạng thái sai
            setSelectedToAdd(prev => prev.filter(x => Number(x) !== id))
            setStoreManagerIds(prev => { const next = new Set(prev); next.delete(id); return next })
          }}
        >Bỏ</Button>
      )
    }
  ]

  const handleSave = async () => {
    if (!eventId) return
    try {
      setSaving(true)
      // Xây danh sách FULL LIST theo yêu cầu backend:
      // "bỏ" = gửi lại toàn bộ danh sách mới (không bao gồm người bị bỏ)
      const toAdd = selectedToAdd.map(id => {
        const emp = allEmployees.find(e => e.id === id)
        return { staffId: Number(id), fullName: emp?.fullName || '', email: emp?.email || '', storeManager: storeManagerIds.has(id) }
      })
      const merged = [...current, ...toAdd]
      const dedupMap = new Map()
      merged.forEach((it) => {
        const id = Number(it.staffId)
        const existed = dedupMap.get(id)
        const nextStoreManager = existed ? (existed.storeManager || !!it.storeManager) : !!it.storeManager
        dedupMap.set(id, { staffId: id, storeManager: nextStoreManager })
      })
      const assignments = Array.from(dedupMap.values())
      // Kiểm tra nếu danh sách rỗng
      if (assignments.length === 0) {
        setErrorModal({
          open: true,
          title: 'Không thể lưu phân công',
          message: 'Danh sách nhân viên không được để trống. Vui lòng chọn ít nhất một nhân viên cho sự kiện.'
        })
        setSaving(false)
        return
      }
      // Nếu còn người thì phải có ít nhất 1 quản lý
      if (assignments.length > 0 && assignments.every(a => a.storeManager !== true)) {
        message.warning('Cần chọn ít nhất 1 Quản lý cửa hàng cho sự kiện.')
        setSaving(false)
        return
      }
      const payload = {
        eventId: Number(eventId),
        staffAssignments: assignments.map(a => ({
          staffId: Number(a.staffId),
          // Gửi cả 2 key để tương thích
          StoreManager: !!a.storeManager,
          storeManager: !!a.storeManager
        }))
      }
      console.log('UpdateEventStaffs payload:', payload)
      await updateEventStaffs(eventId, payload)
      // Lưu danh sách đã cập nhật để dùng khi đóng modal success
      const updatedList = Array.from(dedupMap.values()).map(a => ({
        staffId: a.staffId,
        fullName: allEmployees.find(e => e.id === a.staffId)?.fullName || '',
        email: allEmployees.find(e => e.id === a.staffId)?.email || '',
        storeManager: a.storeManager
      }))
      setUpdatedStaffList(updatedList)
      setSuccessModal(true)
      setSaving(false)
      // Không gọi onSaved ngay, đợi người dùng đóng modal success
    } catch (e) {
      // Lấy message từ nhiều nguồn có thể
      const responseData = e?.response?.data || {}
      const serverMsg = responseData.message || e?.message || 'Cập nhật phân công thất bại'
      const errors = responseData.errors || []
      
      console.log('Error caught in EventStaffEditor:', { 
        serverMsg, 
        errors, 
        fullError: responseData,
        statusCode: responseData.statusCode,
        response: e?.response
      })
      
      const isEmptyError = errors.some(err => 
        typeof err === 'string' && err.toLowerCase().includes('must not be empty')
      ) || (serverMsg && String(serverMsg).toLowerCase().includes('must not be empty'))
      
      // Kiểm tra nhiều từ khóa để phát hiện lỗi conflict
      // Message mẫu: "Nhân viên có sự kiện khác trùng thời gian với sự kiện này"
      const conflictKeywords = [
        'time conflict', 
        'trùng thời gian', 
        'trùng lịch', 
        'conflict', 
        'trùng',
        'sự kiện khác',
        'có sự kiện khác',
        'nhân viên có sự kiện'
      ]
      const msgLower = String(serverMsg || '').toLowerCase().trim()
      const conflictIndicator = conflictKeywords.some(keyword => {
        const keywordLower = String(keyword).toLowerCase()
        const found = msgLower.includes(keywordLower)
        if (found) {
          console.log(`Matched conflict keyword: "${keyword}" in message: "${serverMsg}"`)
        }
        return found
      })
      
      console.log('Conflict check:', { 
        serverMsg, 
        msgLower, 
        conflictIndicator, 
        conflictKeywords,
        matchedKeyword: conflictKeywords.find(keyword => msgLower.includes(keyword.toLowerCase())),
        msgLength: msgLower.length
      })
      
      if (isEmptyError) {
        setErrorModal({
          open: true,
          title: 'Không thể lưu phân công',
          message: 'Danh sách nhân viên không được để trống. Vui lòng chọn ít nhất một nhân viên cho sự kiện.'
        })
      } else if (conflictIndicator) {
        console.log('Setting conflict modal to open')
        let conflictStaffIds = []
        const conflictPayload = e?.response?.data?.data
        if (Array.isArray(conflictPayload)) {
          conflictStaffIds = conflictPayload
            .map((item) => {
              if (typeof item === 'object' && item !== null) {
                return Number(item.staffId || item.id || item.employeeId || item)
              }
              return Number(item)
            })
            .filter((id) => Number.isFinite(id))
        }
        if (!conflictStaffIds.length) {
          conflictStaffIds = assignments.map((a) => Number(a.staffId))
        }
        const staffLookup = [
          ...allEmployees.map((emp) => ({
            id: Number(emp.id),
            fullName: emp.fullName || emp.email || `Nhân viên #${emp.id}`
          })),
          ...current.map((emp) => ({
            id: Number(emp.staffId),
            fullName: emp.fullName || emp.email || `Nhân viên #${emp.staffId}`
          }))
        ]
        const conflictNames = conflictStaffIds
          .map((id) => staffLookup.find((emp) => emp.id === Number(id))?.fullName)
          .filter(Boolean)

        // Sử dụng message từ backend thay vì message đã dịch
        const errorMessage = serverMsg || 'Nhân sự được chọn đang trùng lịch với sự kiện khác'
        console.log('Setting conflict modal:', { open: true, message: errorMessage, serverMsg })
        
        // Sử dụng Modal.error để đảm bảo hiển thị với message từ backend
        Modal.error({
          title: 'Không thể lưu phân công',
          content: errorMessage,
          centered: true,
          okText: 'Đóng',
          zIndex: 2000,
          width: 500,
          onOk: () => {
            console.log('Conflict modal closed')
          }
        })
        
        // Vẫn set state để đồng bộ
        setConflictModal({
          open: true,
          message: errorMessage,
          staffNames: []
        })
        console.log('Conflict modal state set')
      } else {
        message.error(serverMsg)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <Modal
      title="Chỉnh sửa phân công nhân viên"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okButtonProps={{ loading: saving }}
      width={900}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Danh sách nhân viên đã được phân công */}
        {current.length > 0 && (
          <Card 
            size="small" 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <Text strong>Nhân viên đã được phân công ({current.length})</Text>
              </Space>
            }
          >
            <Table
              size="small"
              dataSource={current}
              rowKey={(r) => r.staffId}
              columns={columns}
              pagination={false}
            />
          </Card>
        )}

        {/* Danh sách nhân viên đã chọn để thêm */}
        {selectedStaffs.length > 0 && (
          <Card 
            size="small" 
            title={
              <Space>
                <UserOutlined />
                <Text strong>Danh sách nhân viên đã chọn ({selectedStaffs.length})</Text>
              </Space>
            }
          >
            <Space wrap>
              {selectedStaffs.map((staff) => (
                <Tag
                  key={staff.id}
                  closable
                  onClose={() => {
                    setSelectedToAdd(prev => prev.filter(id => id !== staff.id))
                    setStoreManagerIds(prev => {
                      const next = new Set(prev)
                      next.delete(staff.id)
                      return next
                    })
                  }}
                  color="blue"
                  style={{ padding: '4px 8px', fontSize: '13px' }}
                >
                  {staff.fullName}
                  {storeManagerIds.has(staff.id) && (
                    <Tag color="green" style={{ marginLeft: 4, fontSize: '11px' }}>Quản lý</Tag>
                  )}
                </Tag>
              ))}
            </Space>
          </Card>
        )}

        {current.length > 0 && selectedStaffs.length > 0 && <Divider style={{ margin: '16px 0' }} />}

        {/* Bảng danh sách nhân viên để chọn */}
        <div>
          <div className="mb-2 text-sm font-medium">Chọn nhân viên để thêm</div>
          <Table
            size="small"
            loading={loading}
            dataSource={selectableEmployees}
            rowKey="id"
            pagination={{ pageSize: 7 }}
            rowSelection={{ 
              selectedRowKeys: selectedToAdd, 
              onChange: (keys) => setSelectedToAdd(keys),
              getCheckboxProps: (record) => ({
                disabled: current.some(c => c.staffId === record.id)
              })
            }}
            columns={[
              { 
                title: 'Họ tên', 
                dataIndex: 'fullName', 
                key: 'fullName',
                render: (text, record) => {
                  const isAssigned = current.some(c => c.staffId === record.id)
                  return (
                    <Space>
                      {isAssigned && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                      <span style={{ color: isAssigned ? '#52c41a' : 'inherit' }}>{text}</span>
                    </Space>
                  )
                }
              },
              { title: 'Email', dataIndex: 'email', key: 'email' },
              ...(isStoreManager ? [{
                title: 'Quản lý cửa hàng',
                key: 'storeManager',
                render: (_, record) => (
                  <Switch
                    size="small"
                    checked={storeManagerIds.has(record.id)}
                    onChange={(checked) => {
                      setStoreManagerIds((prev) => {
                        const next = new Set(prev)
                        if (checked) next.add(record.id); else next.delete(record.id)
                        return next
                      })
                    }}
                    disabled={!selectedToAdd.includes(record.id)}
                  />
                )
              }] : [])
            ]}
          />
        </div>
      </Space>
      <Modal
        open={conflictModal.open}
        onCancel={() => {
          console.log('Closing conflict modal')
          setConflictModal({ open: false, message: '', staffNames: [] })
        }}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => {
              console.log('Closing conflict modal via button')
              setConflictModal({ open: false, message: '', staffNames: [] })
            }}
          >
            Đóng
          </Button>
        ]}
        centered
        title="Không thể lưu phân công"
        closable={true}
        maskClosable={true}
        zIndex={2000}
      >
        <div className="space-y-2">
          <p>{conflictModal.message || 'Nhân sự được chọn đang trùng lịch với sự kiện khác'}</p>
        </div>
      </Modal>
      {errorModal.open && (
        <Modal
          open={errorModal.open}
          onCancel={() => setErrorModal({ open: false, title: '', message: '' })}
          footer={[
            <Button key="close" type="primary" onClick={() => setErrorModal({ open: false, title: '', message: '' })}>
              Đóng
            </Button>
          ]}
          centered
          destroyOnClose
          title={errorModal.title || 'Lỗi'}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-rose-100 text-rose-600">
              <CloseCircleOutlined className="text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-base leading-relaxed font-medium">{errorModal.message}</p>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
    {/* Render modal success bên ngoài modal chính để tránh bị unmount */}
    {successModal && (
      <Modal
        title={<div className="flex items-center gap-2 text-lg font-semibold text-green-600"><CheckCircleOutlined className="text-2xl" /><span>Cập nhật nhân viên thành công!</span></div>}
        open={successModal}
        onCancel={() => {
          setSuccessModal(false)
          setUpdatedStaffList(null)
          // Sau khi đóng modal success, gọi onSaved và đóng modal chính
          if (typeof onSaved === 'function' && updatedStaffList) {
            onSaved(updatedStaffList)
          }
          onClose()
        }}
        footer={[
          <Button key="close" type="primary" onClick={() => {
            setSuccessModal(false)
            setUpdatedStaffList(null)
            // Sau khi đóng modal success, gọi onSaved và đóng modal chính
            if (typeof onSaved === 'function' && updatedStaffList) {
              onSaved(updatedStaffList)
            }
            onClose()
          }}>
            Đóng
          </Button>
        ]}
        centered
        destroyOnClose
        maskClosable={true}
        zIndex={2000}
        closable={true}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100 text-emerald-600">
            <CheckCircleOutlined className="text-2xl" />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 text-base leading-relaxed font-medium">Phân công nhân viên đã được cập nhật thành công.</p>
          </div>
        </div>
      </Modal>
    )}
    </>
  )
}

export default EventStaffEditor
