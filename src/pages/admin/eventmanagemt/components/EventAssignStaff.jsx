import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Table, Tag, Switch, Button, message, Card, Space, Typography, Divider } from 'antd'
import { CloseOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { getEmployees } from '../../../../service/api/employeeApi'
import { assignEventStaffs, getEventStaffs } from '../../../../service/api/eventApi'

const { Text } = Typography

const EventAssignStaff = ({ visible, onClose, eventId, onAssigned }) => {
  const [loading, setLoading] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [loadingAssignedStaffs, setLoadingAssignedStaffs] = useState(false)
  const [employees, setEmployees] = useState([])
  const [assignedStaffs, setAssignedStaffs] = useState([]) // Danh sách nhân viên đã được assign
  const [selectedStaffIds, setSelectedStaffIds] = useState([])
  const [storeManagerIds, setStoreManagerIds] = useState(new Set())
  const [conflictModal, setConflictModal] = useState({ open: false, message: '', staffNames: [] })
  const [successModal, setSuccessModal] = useState(false)

  // Load danh sách nhân viên đã được assign vào event
  useEffect(() => {
    if (visible && eventId) {
      ;(async () => {
        try {
          setLoadingAssignedStaffs(true)
          const res = await getEventStaffs(eventId)
          // Backend có thể trả về { success, data: [...] } hoặc trực tiếp array
          const staffList = res?.data?.data || res?.data || (Array.isArray(res) ? res : [])
          const mapped = staffList.map((s) => ({
            id: s.staffId || s.id || s.employeeId,
            fullName: s.fullName || s.name || s.email,
            email: s.email,
            storeManager: s.storeManager === true,
            roles: s.roles || []
          }))
          setAssignedStaffs(mapped)
          // Loại bỏ các nhân viên đã được assign khỏi danh sách đã chọn
          const assignedIds = mapped.map(s => s.id)
          setSelectedStaffIds(prev => prev.filter(id => !assignedIds.includes(id)))
        } catch (err) {
          console.error('Error loading assigned staffs:', err)
          // Không hiển thị error nếu event chưa có nhân viên nào được assign
          setAssignedStaffs([])
        } finally {
          setLoadingAssignedStaffs(false)
        }
      })()
    } else {
      setAssignedStaffs([])
    }
  }, [visible, eventId])

  useEffect(() => {
    if (visible) {
      ;(async () => {
        try {
          setLoadingEmployees(true)
          const res = await getEmployees({ page: 0, size: 100, sortBy: 'createdAt', sortDir: 'DESC' })
          const list = res?.data?.content || []
          const mapped = list.map((e) => ({
            id: e.id,
            key: e.id,
            fullName: e.fullName || e.email,
            email: e.email,
            roles: e.roles || [],
            isActive: e.isActive === true
          }))
          setEmployees(mapped)
          setSelectedStaffIds([])
          setStoreManagerIds(new Set())
        } catch {
          message.error('Không tải được danh sách nhân viên')
        } finally {
          setLoadingEmployees(false)
        }
      })()
    }
  }, [visible])

  const handleAssign = async () => {
    if (!eventId) {
      message.error('Thiếu mã sự kiện để gán nhân sự')
      return
    }
    if (selectedStaffIds.length === 0) {
      message.warning('Hãy chọn ít nhất một nhân viên')
      return
    }
    try {
      setLoading(true)
      const payload = {
        eventId: Number(eventId),
        staffAssignments: selectedStaffIds.map((id) => ({
          staffId: Number(id),
          storeManager: storeManagerIds.has(id)
        }))
      }
      const res = await assignEventStaffs(payload)
      if (res?.success) {
        let latestCount = null
        message.success('Gán nhân sự thành công!')
        
        // Reload danh sách nhân viên đã được assign
        if (eventId) {
          try {
            const staffRes = await getEventStaffs(eventId)
            const staffList = staffRes?.data?.data || staffRes?.data || (Array.isArray(staffRes) ? staffRes : [])
            const mapped = staffList.map((s) => ({
              id: s.staffId || s.id || s.employeeId,
              fullName: s.fullName || s.name || s.email,
              email: s.email,
              storeManager: s.storeManager === true,
              roles: s.roles || []
            }))
            setAssignedStaffs(mapped)
            // Loại bỏ các nhân viên đã được assign khỏi danh sách đã chọn
            const assignedIds = mapped.map(s => s.id)
            setSelectedStaffIds(prev => prev.filter(id => !assignedIds.includes(id)))
            latestCount = mapped.length
          } catch (e) {
            console.error('Error reloading assigned staffs:', e)
          }
        }
        // Reset selection sau khi gán thành công
        setSelectedStaffIds([])
        setStoreManagerIds(new Set())
        
        // Hiển thị modal success trước, không đóng modal chính ngay
        setSuccessModal(true)
        
        // Lưu latestCount để dùng khi đóng modal success
        // Không gọi onClose() và onAssigned() ở đây, đợi người dùng đóng modal success
      } else {
        const msg = res?.message || 'Gán nhân sự thất bại!'
        message.error(msg)
      }
    } catch (err) {
      const responseData = err?.response?.data || {}
      const serverMsg = responseData.message || err?.message || 'Gán nhân sự thất bại!'
      
      console.log('Error caught in EventAssignStaff:', { 
        serverMsg, 
        fullError: responseData,
        statusCode: responseData.statusCode,
        response: err?.response
      })
      
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
        matchedKeyword: conflictKeywords.find(keyword => msgLower.includes(keyword.toLowerCase()))
      })
      
      if (conflictIndicator) {
        const conflictPayload = err?.response?.data?.data
        let conflictStaffIds = []
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
          conflictStaffIds = selectedStaffIds
        }
        const conflictNames = employees
          .filter((emp) => conflictStaffIds.includes(emp.id))
          .map((emp) => emp.fullName || emp.email || `Nhân viên #${emp.id}`)
        
        // Sử dụng message từ backend thay vì message đã dịch
        const errorMessage = serverMsg || 'Nhân sự được chọn đang trùng lịch với sự kiện khác'
        console.log('Setting conflict modal:', { open: true, message: errorMessage, serverMsg })
        
        // Sử dụng Modal.error để đảm bảo hiển thị với message từ backend
        Modal.error({
          title: 'Không thể gán nhân sự',
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
      setLoading(false)
    }
  }

  const existingManagerId = useMemo(() => {
    const manager = assignedStaffs.find((s) => s.storeManager)
    return manager ? manager.id : null
  }, [assignedStaffs])

  // Lấy danh sách staff đã chọn
  const selectedStaffs = employees.filter(e => selectedStaffIds.includes(e.id))

  return (
    <React.Fragment>
    <Modal
      title="Gán nhân sự cho sự kiện"
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="assign" type="primary" loading={loading} onClick={handleAssign}>
          Gán nhân sự
        </Button>
      ]}
    >
      {/* Danh sách nhân viên đã được assign vào event */}
      {assignedStaffs.length > 0 && (
        <Card 
          size="small" 
          title={
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text strong>Nhân viên đã được phân công ({assignedStaffs.length})</Text>
            </Space>
          }
          style={{ marginBottom: 16 }}
          loading={loadingAssignedStaffs}
        >
          <Space wrap>
            {assignedStaffs.map((staff) => (
              <Tag
                key={staff.id}
                color="green"
                icon={<CheckCircleOutlined />}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {staff.fullName}
                {staff.storeManager && (
                  <Tag color="gold" style={{ marginLeft: 4, fontSize: '11px' }}>
                    Quản lý
                  </Tag>
                )}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* Danh sách staff đã chọn để gán mới */}
      {selectedStaffs.length > 0 && (
        <Card 
          size="small" 
          title={
            <Space>
              <UserOutlined />
              <Text strong>Danh sách nhân viên đã chọn ({selectedStaffs.length})</Text>
            </Space>
          }
          style={{ marginBottom: 16 }}
        >
          <Space wrap>
            {selectedStaffs.map((staff) => (
              <Tag
                key={staff.id}
                closable
                onClose={() => {
                  setSelectedStaffIds(prev => prev.filter(id => id !== staff.id))
                  // Xóa khỏi storeManagerIds nếu có
                  setStoreManagerIds(prev => {
                    const next = new Set(prev)
                    next.delete(staff.id)
                    return next
                  })
                }}
                color="blue"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {staff.fullName}
                {storeManagerIds.has(staff.id) && (
                  <Tag color="green" style={{ marginLeft: 4, fontSize: '11px' }}>
                    Quản lý
                  </Tag>
                )}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {assignedStaffs.length > 0 && selectedStaffs.length > 0 && (
        <Divider style={{ margin: '16px 0' }} />
      )}

      <Table
        size="small"
        loading={loadingEmployees}
        dataSource={employees}
        rowKey="id"
        pagination={{ pageSize: 7 }}
        rowSelection={{ 
          selectedRowKeys: selectedStaffIds, 
          onChange: (keys) => {
            const assignedIds = assignedStaffs.map(s => s.id)
            const filteredKeys = keys.filter(id => !assignedIds.includes(id))
            const alreadySelectedManagers = Array.from(storeManagerIds).filter(id => filteredKeys.includes(id))
            setSelectedStaffIds(filteredKeys)
            setStoreManagerIds(new Set(alreadySelectedManagers))
          },
          getCheckboxProps: (record) => ({
            disabled: assignedStaffs.some(s => s.id === record.id)
          })
        }}
        columns={[
          { 
            title: 'Họ tên', 
            dataIndex: 'fullName', 
            key: 'fullName',
            render: (text, record) => {
              const isAssigned = assignedStaffs.some(s => s.id === record.id)
              return (
                <Space>
                  {isAssigned && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  <span style={{ color: isAssigned ? '#52c41a' : 'inherit' }}>{text}</span>
                </Space>
              )
            }
          },
          { title: 'Email', dataIndex: 'email', key: 'email' },
          {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (roles || []).map((r) => <Tag key={r}>{r}</Tag>)
          },
          {
            title: 'Quản lý cửa hàng',
            key: 'storeManager',
            render: (_, record) => {
              const isSelected = selectedStaffIds.includes(record.id)
              const limitReached =
                (!!existingManagerId && existingManagerId !== record.id) ||
                (storeManagerIds.size >= 1 && !storeManagerIds.has(record.id))

              return (
                <Switch
                  size="small"
                  checked={storeManagerIds.has(record.id)}
                  onChange={(checked) => {
                    setStoreManagerIds(() => {
                      const next = new Set()
                      if (checked) {
                        next.add(record.id)
                      }
                      return next
                    })
                  }}
                  disabled={!isSelected || limitReached}
                />
              )
            }
          }
        ]}
      />
      {conflictModal.open && (
        <Modal
          open={conflictModal.open}
          onCancel={() => setConflictModal({ open: false, message: '', staffNames: [] })}
          footer={[
            <Button key="close" type="primary" onClick={() => setConflictModal({ open: false, message: '', staffNames: [] })}>
              Đóng
            </Button>
          ]}
          centered
          title="Không thể gán nhân sự"
        >
          <div className="space-y-2">
            <p>{conflictModal.message}</p>
          </div>
        </Modal>
      )}
    </Modal>
    {/* Render modal success bên ngoài modal chính để tránh bị unmount */}
    {successModal && (
      <Modal
        open={successModal}
        onCancel={() => {
          setSuccessModal(false)
          // Sau khi đóng modal success, đóng modal chính và gọi callback
          onClose()
          if (typeof onAssigned === 'function' && eventId) {
            // Lấy lại số lượng nhân viên đã assign
            getEventStaffs(eventId).then(staffRes => {
              const staffList = staffRes?.data?.data || staffRes?.data || (Array.isArray(staffRes) ? staffRes : [])
              const count = staffList.length
              onAssigned(eventId, count)
            }).catch(() => {
              onAssigned(eventId, 0)
            })
          }
        }}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => {
              setSuccessModal(false)
              // Sau khi đóng modal success, đóng modal chính và gọi callback
              onClose()
              if (typeof onAssigned === 'function' && eventId) {
                // Lấy lại số lượng nhân viên đã assign
                getEventStaffs(eventId).then(staffRes => {
                  const staffList = staffRes?.data?.data || staffRes?.data || (Array.isArray(staffRes) ? staffRes : [])
                  const count = staffList.length
                  onAssigned(eventId, count)
                }).catch(() => {
                  onAssigned(eventId, 0)
                })
              }
            }}
          >
            Đóng
          </Button>
        ]}
        centered
        title="Gán nhân sự thành công"
        closable={true}
        maskClosable={true}
        destroyOnClose
        zIndex={2000}
      >
        <p>Danh sách nhân sự mới đã được cập nhật cho sự kiện.</p>
      </Modal>
    )}
    </React.Fragment>
  )
}

export default EventAssignStaff


