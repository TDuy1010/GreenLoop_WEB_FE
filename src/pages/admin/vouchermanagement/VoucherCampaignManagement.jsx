import React, { useEffect, useState, useCallback } from 'react';
import { Card, Typography, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { convertToUTCString, parseDateFromAPI } from '../../../utils/dateUtils';
import {
  getVoucherCampaigns,
  createVoucherCampaign,
  updateVoucherCampaign,
  getVouchers,
  createVoucher
} from '../../../service/api/voucherApi';
import VoucherCampaignTable from './components/VoucherCampaignTable';
import VoucherCampaignFormModal from './components/VoucherCampaignFormModal';
import VoucherListModal from './components/VoucherListModal';
import VoucherCreateModal from './components/VoucherCreateModal';

const { Title, Paragraph } = Typography;

const VoucherCampaignManagement = () => {
  const [campaignData, setCampaignData] = useState([]);
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', dateRange: [null, null] });
  const [campaignPagination, setCampaignPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [formModal, setFormModal] = useState({ visible: false, mode: 'create', campaign: null });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [voucherListModal, setVoucherListModal] = useState({ visible: false, campaign: null });
  const [voucherCreateModal, setVoucherCreateModal] = useState({ visible: false });
  const [voucherSubmitLoading, setVoucherSubmitLoading] = useState(false);

  const handleCreate = () => {
    setFormModal({ visible: true, mode: 'create', campaign: null });
  };

  const handleCreateSingleVoucher = () => {
    setVoucherCreateModal({ visible: true });
  };

  const fetchCampaigns = useCallback(async (page, pageSize) => {
    try {
      setCampaignLoading(true);
      const currentPage = page ?? campaignPagination.current;
      const currentPageSize = pageSize ?? campaignPagination.pageSize;
      
      const { content, pagination: paginationInfo } = await getVoucherCampaigns({
        page: currentPage - 1,
        size: currentPageSize,
        name: filters.name || undefined,
        from: filters.dateRange?.[0] ? convertToUTCString(filters.dateRange[0]) : undefined,
        to: filters.dateRange?.[1] ? convertToUTCString(filters.dateRange[1]) : undefined,
      });

      setCampaignData(content);
      setCampaignPagination({
        current: (paginationInfo?.pageNumber ?? currentPage - 1) + 1,
        pageSize: paginationInfo?.pageSize ?? currentPageSize,
        total: paginationInfo?.totalElements ?? content.length
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tải chiến dịch voucher');
    } finally {
      setCampaignLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleRefresh = () => {
    fetchCampaigns();
  };

  const handleEditCampaign = async (campaign) => {
    try {
      console.log('Editing campaign:', campaign);
      
      // Load vouchers của campaign để populate vào form
      if (campaign?.campaignId) {
        message.loading({ content: 'Đang tải thông tin chiến dịch...', key: 'loading-edit' });
        
        const { content: vouchers } = await getVouchers({
          campaignId: campaign.campaignId,
          page: 0,
          size: 1000, // Lấy tất cả vouchers
        });
        
        console.log('Loaded vouchers:', vouchers);
        
        // Map vouchers để format cho form
        const formattedVouchers = vouchers.map(v => ({
          voucherType: v.voucherType,
          name: v.code || v.name || '', // Sử dụng code làm name nếu không có name
          description: v.description || '',
          value: v.value || 0,
          minOrderValue: v.minOrderValue || 0,
          maxDiscount: v.maxDiscount || 0,
          expiryDate: v.expiryDate ? parseDateFromAPI(v.expiryDate) : null,
          quantity: v.quantity || 1,
          pointToRedeem: v.pointToRedeem || 0,
        }));
        
        const campaignWithVouchers = { 
          ...campaign, 
          vouchers: formattedVouchers 
        };
        
        console.log('Campaign with vouchers:', campaignWithVouchers);
        
        message.success({ content: 'Đã tải thông tin chiến dịch', key: 'loading-edit', duration: 2 });
        
        // Chỉ set visible = true sau khi đã load xong vouchers
        setFormModal({ 
          visible: true, 
          mode: 'edit', 
          campaign: campaignWithVouchers
        });
      } else {
        console.log('No campaignId, opening modal without vouchers');
        setFormModal({ visible: true, mode: 'edit', campaign });
      }
    } catch (error) {
      console.error('Error loading vouchers for edit:', error);
      message.error({ content: 'Không thể tải danh sách voucher', key: 'loading-edit' });
      // Vẫn mở modal nhưng không có vouchers
      setFormModal({ visible: true, mode: 'edit', campaign });
    }
  };

  const handleViewVouchers = (campaign) => {
    setVoucherListModal({ visible: true, campaign });
  };

  const handleCloseVoucherList = () => {
    setVoucherListModal({ visible: false, campaign: null });
  };

  const handleFormModalClose = () => {
    setFormModal({ visible: false, mode: 'create', campaign: null });
  };

  const handleFormSubmit = async (values) => {
    try {
      setSubmitLoading(true);
      
      if (formModal.mode === 'create') {
        await createVoucherCampaign(values);
        message.success('Tạo chiến dịch voucher thành công');
        handleFormModalClose();
        fetchCampaigns();
      } else {
        if (!formModal.campaign?.campaignId) {
          message.error('Không tìm thấy ID chiến dịch');
          return;
        }
        await updateVoucherCampaign(formModal.campaign.campaignId, values);
        message.success('Cập nhật chiến dịch voucher thành công');
        handleFormModalClose();
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error submitting campaign:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      message.error(formModal.mode === 'create' 
        ? `Có lỗi xảy ra khi tạo chiến dịch: ${errorMessage}`
        : `Có lỗi xảy ra khi cập nhật chiến dịch: ${errorMessage}`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTableChange = (page, pageSize) => {
    fetchCampaigns(page, pageSize);
  };

  const handleVoucherCreateClose = () => {
    setVoucherCreateModal({ visible: false });
  };

  const handleVoucherSubmit = async (values) => {
    try {
      setVoucherSubmitLoading(true);
      await createVoucher(values);
      message.success('Tạo voucher thành công');
      handleVoucherCreateClose();
      fetchCampaigns(); // Refresh để cập nhật danh sách
    } catch (error) {
      console.error('Error creating voucher:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      message.error(`Có lỗi xảy ra khi tạo voucher: ${errorMessage}`);
    } finally {
      setVoucherSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="m-0">
              Quản lý Voucher
            </Title>
            <Paragraph className="text-gray-500 mb-0">
              Thiết lập mã giảm giá và chương trình khuyến mãi cho người dùng.
            </Paragraph>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Tải lại
            </Button>
            <Button icon={<PlusOutlined />} onClick={handleCreateSingleVoucher}>
              Tạo voucher
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Thêm chiến dịch
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="shadow-sm">
        <VoucherCampaignTable
          filters={filters}
          onFiltersChange={setFilters}
          data={campaignData}
          loading={campaignLoading}
          pagination={campaignPagination}
          onChangePage={handleTableChange}
          onEdit={handleEditCampaign}
          onViewVouchers={handleViewVouchers}
        />
      </Card>

      <VoucherCampaignFormModal
        visible={formModal.visible}
        mode={formModal.mode}
        campaign={formModal.campaign}
        onClose={handleFormModalClose}
        onSubmit={handleFormSubmit}
        loading={submitLoading}
      />

      <VoucherListModal
        visible={voucherListModal.visible}
        campaign={voucherListModal.campaign}
        onClose={handleCloseVoucherList}
      />

      <VoucherCreateModal
        visible={voucherCreateModal.visible}
        onClose={handleVoucherCreateClose}
        onSubmit={handleVoucherSubmit}
        loading={voucherSubmitLoading}
      />
    </div>
  );
};

export default VoucherCampaignManagement;

