import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Table, Button, Space, Tag, message, Switch, Card, Typography, Divider } from 'antd'
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons'
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
      message.success('Đã lưu phân công nhân viên')
      if (typeof onSaved === 'function') onSaved(Array.from(dedupMap.values()).map(a=>({ staffId: a.staffId, fullName: allEmployees.find(e=>e.id===a.staffId)?.fullName || '', email: allEmployees.find(e=>e.id===a.staffId)?.email || '', storeManager: a.storeManager })))
    } catch (e) {
      const serverMsg = e?.response?.data?.message || e?.message || 'Cập nhật phân công thất bại'
      message.error(serverMsg)
    } finally {
      setSaving(false)
    }
  }

  return (
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
    </Modal>
  )
}

export default EventStaffEditor
