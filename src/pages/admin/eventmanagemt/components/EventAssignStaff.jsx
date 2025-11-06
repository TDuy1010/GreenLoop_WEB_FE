import React, { useEffect, useState } from 'react'
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
          } catch (e) {
            console.error('Error reloading assigned staffs:', e)
          }
        }
        // Reset selection sau khi gán thành công
        setSelectedStaffIds([])
        setStoreManagerIds(new Set())
        onClose()
        if (onAssigned) onAssigned()
      } else {
        const msg = res?.message || 'Gán nhân sự thất bại!'
        message.error(msg)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Gán nhân sự thất bại!'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách staff đã chọn
  const selectedStaffs = employees.filter(e => selectedStaffIds.includes(e.id))

  return (
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
            // Lọc bỏ các nhân viên đã được assign
            const assignedIds = assignedStaffs.map(s => s.id)
            const filteredKeys = keys.filter(id => !assignedIds.includes(id))
            setSelectedStaffIds(filteredKeys)
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
              // Chỉ hiển thị toggle nếu staff có role STORE_MANAGER
              const hasStoreManagerRole = (record.roles || []).some(
                role => role === 'STORE_MANAGER' || role?.toUpperCase() === 'STORE_MANAGER'
              )
              
              if (!hasStoreManagerRole) {
                return <span className="text-gray-400">—</span>
              }
              
              return (
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
                  disabled={!selectedStaffIds.includes(record.id)}
                />
              )
            }
          }
        ]}
      />
    </Modal>
  )
}

export default EventAssignStaff


