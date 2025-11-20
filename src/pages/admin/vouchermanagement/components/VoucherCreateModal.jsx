import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { getVoucherCampaigns } from '../../../../service/api/voucherApi';
import { parseDateFromAPI, convertToUTCString } from '../../../../utils/dateUtils';

const { Option } = Select;
const { TextArea } = Input;

const VoucherCreateModal = ({
  visible,
  mode = 'create',
  voucher,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchCampaigns();
      
      if (mode === 'edit' && voucher) {
        // Populate form với dữ liệu voucher
        const formValues = {
          campaignId: voucher.campaignId,
          voucherType: voucher.voucherType,
          name: voucher.name || voucher.code || '',
          description: voucher.description || '',
          value: voucher.value || 0,
          minOrderValue: voucher.minOrderValue || 0,
          maxDiscount: voucher.maxDiscount || 0,
          expiryDate: voucher.expiryDate ? parseDateFromAPI(voucher.expiryDate) : null,
          quantity: voucher.quantity || 1,
          pointToRedeem: voucher.pointToRedeem || 0,
        };
        
        setTimeout(() => {
          form.setFieldsValue(formValues);
        }, 100);
      } else {
        form.resetFields();
        form.setFieldsValue({
          quantity: 1,
          pointToRedeem: 0,
        });
      }
    }
  }, [visible, mode, voucher, form]);

  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const { content } = await getVoucherCampaigns({
        page: 0,
        size: 1000, // Lấy tất cả campaigns
      });
      setCampaigns(content || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      message.error('Không thể tải danh sách chiến dịch');
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Kiểm tra value dựa trên voucherType
      if (values.voucherType === 'PERCENT' || values.voucherType === 'AMOUNT') {
        if (values.value === undefined || values.value === null) {
          message.error('Vui lòng nhập giá trị voucher');
          return;
        }
      }

      const payload = {
        campaignId: values.campaignId,
        voucherType: values.voucherType,
        name: values.name,
        description: values.description || '',
        value: (values.voucherType === 'FREE_ITEM' || values.voucherType === 'FREESHIP') 
          ? 0 
          : (values.value || 0),
        minOrderValue: values.minOrderValue || 0,
        maxDiscount: values.maxDiscount || 0,
        expiryDate: values.expiryDate ? convertToUTCString(values.expiryDate) : null,
        quantity: values.quantity || 1,
        pointToRedeem: values.pointToRedeem || 0,
      };

      onSubmit(payload);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={mode === 'edit' ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={700}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        preserve={false}
        initialValues={{
          quantity: 1,
          pointToRedeem: 0,
        }}
      >
        <Form.Item
          name="campaignId"
          label="Chiến dịch"
          rules={[{ required: true, message: 'Vui lòng chọn chiến dịch' }]}
        >
          <Select
            placeholder="Chọn chiến dịch"
            size="large"
            loading={loadingCampaigns}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={campaigns.map(campaign => ({
              value: campaign.campaignId,
              label: campaign.campaignName,
            }))}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="voucherType"
            label="Loại voucher"
            rules={[{ required: true, message: 'Vui lòng chọn loại voucher' }]}
          >
            <Select placeholder="Chọn loại voucher" size="large">
              <Option value="PERCENT">Phần trăm (%)</Option>
              <Option value="AMOUNT">Số tiền cố định</Option>
              <Option value="FREE_ITEM">Sản phẩm miễn phí</Option>
              <Option value="FREESHIP">Miễn phí vận chuyển</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên voucher"
            rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
          >
            <Input placeholder="Ví dụ: Giảm 10%" size="large" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TextArea rows={3} placeholder="Mô tả voucher..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="value"
            label="Giá trị"
            dependencies={['voucherType']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const voucherType = getFieldValue('voucherType');
                  if (!voucherType) {
                    return Promise.resolve();
                  }
                  if (voucherType === 'FREE_ITEM' || voucherType === 'FREESHIP') {
                    return Promise.resolve();
                  }
                  if (!value && value !== 0) {
                    return Promise.reject(new Error('Vui lòng nhập giá trị'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            tooltip="Với PERCENT: nhập số thập phân (ví dụ: 0.1 = 10%). Với AMOUNT: nhập số tiền. Với FREE_ITEM và FREESHIP: không cần nhập giá trị"
          >
            <InputNumber
              className="w-full"
              min={0}
              step={0.01}
              placeholder="0.1 hoặc 10000"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="minOrderValue"
            label="Giá trị đơn hàng tối thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị tối thiểu' }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              step={1000}
              placeholder="1000"
              size="large"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="maxDiscount"
            label="Giảm giá tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập giảm giá tối đa' }]}
            tooltip="Áp dụng cho voucher PERCENT (giảm giá tối đa)"
          >
            <InputNumber
              className="w-full"
              min={0}
              step={1000}
              placeholder="1000"
              size="large"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="expiryDate"
            label="Ngày hết hạn"
          >
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY HH:mm"
              showTime
              size="large"
              placeholder="Chọn ngày hết hạn"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber
              className="w-full"
              min={1}
              placeholder="100"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="pointToRedeem"
            label="Điểm đổi (Eco Point)"
            rules={[{ required: true, message: 'Vui lòng nhập điểm đổi' }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              placeholder="0"
              size="large"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default VoucherCreateModal;

