import React, { useEffect, useState } from 'react';
import { Modal, Table, Tag, Empty, message, Button, Select, Dropdown, Space, Switch, Tooltip } from 'antd';
import { DownOutlined, EditOutlined } from '@ant-design/icons';
import { getVouchers, changeVoucherStatus, toggleVoucherActiveStatus, updateVoucher } from '../../../../service/api/voucherApi';
import { formatDateShort } from '../../../../utils/dateUtils';
import VoucherCreateModal from './VoucherCreateModal';

const VoucherListModal = ({ visible, campaign, onClose }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);
  const [togglingActiveId, setTogglingActiveId] = useState(null);
  const [editModal, setEditModal] = useState({ visible: false, voucher: null });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchVouchers = async (page = 1, pageSize = 10) => {
    if (!campaign?.campaignId) return;

    try {
      setLoading(true);
      const { content, pagination: paginationInfo } = await getVouchers({
        campaignId: campaign.campaignId,
        page: page - 1,
        size: pageSize,
      });

      setVouchers(content);
      setPagination({
        current: (paginationInfo?.pageNumber ?? page - 1) + 1,
        pageSize: paginationInfo?.pageSize ?? pageSize,
        total: paginationInfo?.totalElements ?? content.length,
      });
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && campaign?.campaignId) {
      fetchVouchers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, campaign?.campaignId]);

  const getVoucherTypeText = (type) => {
    const types = {
      PERCENT: 'Phần trăm (%)',
      AMOUNT: 'Số tiền cố định',
      FREE_ITEM: 'Sản phẩm miễn phí',
      FREESHIP: 'Miễn phí vận chuyển',
    };
    return types[type] || type;
  };

  const getVoucherTypeColor = (type) => {
    const colors = {
      PERCENT: 'blue',
      AMOUNT: 'green',
      FREE_ITEM: 'orange',
      FREESHIP: 'purple',
    };
    return colors[type] || 'default';
  };

  const getStatusText = (status) => {
    const statuses = {
      ACTIVE: 'Đang hoạt động',
      INACTIVE: 'Ngưng hoạt động',
      EXPIRED: 'Hết hạn',
      USED: 'Đã sử dụng',
      REVOKED: 'Đã thu hồi',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'green',
      INACTIVE: 'red',
      EXPIRED: 'orange',
      USED: 'gray',
      REVOKED: 'red',
    };
    return colors[status] || 'default';
  };

  const handleChangeStatus = async (voucherId, newStatus) => {
    try {
      console.log('handleChangeStatus called:', voucherId, newStatus);
      setChangingStatusId(voucherId);
      const response = await changeVoucherStatus(voucherId, newStatus);
      console.log('Status change response:', response);
      message.success('Đổi trạng thái voucher thành công');
      // Refresh danh sách
      await fetchVouchers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error changing voucher status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đổi trạng thái';
      message.error(errorMessage);
    } finally {
      setChangingStatusId(null);
    }
  };

  const handleToggleActive = async (voucherId, currentActive) => {
    try {
      setTogglingActiveId(voucherId);
      await toggleVoucherActiveStatus(voucherId);
      message.success(`Đã ${currentActive ? 'tắt' : 'bật'} trạng thái hoạt động của voucher`);
      // Refresh danh sách
      await fetchVouchers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error toggling voucher active status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đổi trạng thái hoạt động';
      message.error(errorMessage);
    } finally {
      setTogglingActiveId(null);
    }
  };

  const handleEdit = (voucher) => {
    setEditModal({ visible: true, voucher });
  };

  const handleEditClose = () => {
    setEditModal({ visible: false, voucher: null });
  };

  const handleEditSubmit = async (values) => {
    if (!editModal.voucher?.voucherId) {
      message.error('Không tìm thấy ID voucher');
      return;
    }

    try {
      setSubmitLoading(true);
      await updateVoucher(editModal.voucher.voucherId, values);
      message.success('Cập nhật voucher thành công');
      handleEditClose();
      await fetchVouchers(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Error updating voucher:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      message.error(`Có lỗi xảy ra khi cập nhật voucher: ${errorMessage}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = [
      { value: 'ACTIVE', label: 'Đang hoạt động' },
      { value: 'EXPIRED', label: 'Hết hạn' },
      { value: 'USED', label: 'Đã sử dụng' },
      { value: 'REVOKED', label: 'Đã thu hồi' },
    ];
    
    // Lọc bỏ trạng thái hiện tại
    return allStatuses.filter(status => status.value !== currentStatus);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };


  const columns = [
    {
      title: 'Tên voucher',
      key: 'name',
      width: 200,
      render: (_, record) => {
        const displayName = record.name || record.code || '—';
        return (
          <div>
            <div className="font-medium text-gray-900">{displayName}</div>
            {record.code && record.name && (
              <div className="text-xs text-gray-500 font-mono mt-1">Mã: {record.code}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (description) => <span className="text-gray-600">{description || '—'}</span>,
    },
    {
      title: 'Loại',
      dataIndex: 'voucherType',
      key: 'voucherType',
      width: 150,
      render: (type) => (
        <Tag color={getVoucherTypeColor(type)}>{getVoucherTypeText(type)}</Tag>
      ),
    },
    {
      title: 'Giá trị',
      key: 'value',
      width: 150,
      render: (_, record) => {
        if (record.voucherType === 'PERCENT') {
          return `${(record.value * 100).toFixed(0)}%`;
        } else if (record.voucherType === 'AMOUNT') {
          return formatCurrency(record.value);
        } else {
          return '—';
        }
      },
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
      width: 150,
      render: (value) => (value ? formatCurrency(value) : '—'),
    },
    {
      title: 'Giảm tối đa',
      dataIndex: 'maxDiscount',
      key: 'maxDiscount',
      width: 150,
      render: (value) => (value ? formatCurrency(value) : '—'),
    },
    {
      title: 'SL tạo',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 110,
      align: 'center',
      render: (value) => (
        <Tag color="blue" style={{ margin: 0 }}>
          {value ?? 0}
        </Tag>
      ),
    },
    {
      title: 'SL khả dụng',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      width: 140,
      align: 'center',
      render: (value, record) => {
        const remaining = value ?? 0;
        const total = record.quantity ?? 0;
        const isLow = total > 0 && remaining / total <= 0.2;
        return (
          <Tag color={isLow ? 'red' : 'green'} style={{ margin: 0 }}>
            {remaining} / {total}
          </Tag>
        );
      },
    },
    {
      title: 'Điểm đổi',
      dataIndex: 'pointToRedeem',
      key: 'pointToRedeem',
      width: 120,
      render: (points) => (points ? `${points} điểm` : '—'),
    },
    {
      title: 'Hết hạn',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 180,
      render: (date) => formatDateShort(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'voucherStatus',
      key: 'voucherStatus',
      width: 180,
      render: (status, record) => {
        const statusOptions = getStatusOptions(status);
        const isLoading = changingStatusId === record.voucherId;
        const statusColor = getStatusColor(status);
        
        // Nếu không có option nào để đổi thì chỉ hiển thị Tag
        if (statusOptions.length === 0) {
          return <Tag color={statusColor} style={{ margin: 0 }}>{getStatusText(status)}</Tag>;
        }
        
        // Tạo menu items cho dropdown
        const menuItems = statusOptions.map(option => {
          const optionColor = getStatusColor(option.value);
          return {
            key: option.value,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color={optionColor} style={{ margin: 0 }}>
                  {option.label}
                </Tag>
              </div>
            ),
            onClick: () => {
              if (record.voucherId) {
                handleChangeStatus(record.voucherId, option.value);
              }
            },
          };
        });
        
        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            disabled={isLoading}
            placement="bottomLeft"
          >
            <Tag
              color={statusColor}
              style={{
                margin: 0,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
              }}
            >
              {getStatusText(status)}
              {!isLoading && <DownOutlined style={{ fontSize: 10 }} />}
            </Tag>
          </Dropdown>
        );
      },
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      key: 'active',
      width: 120,
      render: (active, record) => {
        const isLoading = togglingActiveId === record.voucherId;
        return (
          <Switch
            checked={active}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
            loading={isLoading}
            disabled={isLoading}
            onChange={() => {
              if (record.voucherId) {
                handleToggleActive(record.voucherId, active);
              }
            }}
          />
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Modal
      title={`Danh sách voucher - ${campaign?.campaignName || ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1400}
      destroyOnClose
    >
      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="voucherId"
        loading={loading}
        locale={{
          emptyText: <Empty description="Chưa có voucher nào trong chiến dịch này." />,
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `${total} voucher`,
          onChange: (page, pageSize) => fetchVouchers(page, pageSize),
        }}
        scroll={{ x: 1200 }}
      />

      <VoucherCreateModal
        visible={editModal.visible}
        mode="edit"
        voucher={editModal.voucher}
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        loading={submitLoading}
      />
    </Modal>
  );
};

export default VoucherListModal;

