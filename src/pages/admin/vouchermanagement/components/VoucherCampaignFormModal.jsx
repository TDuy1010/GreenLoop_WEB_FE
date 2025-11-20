import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Switch, Select, InputNumber, Button, Steps, Divider, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { parseDateFromAPI, convertToUTCString } from '../../../../utils/dateUtils';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const VoucherCampaignFormModal = ({
  visible,
  mode,
  campaign,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  // Effect để populate form khi modal mở hoặc campaign thay đổi
  React.useEffect(() => {
    if (!visible) {
      // Reset khi đóng modal
      setCurrentStep(0);
      return;
    }

    // Reset step khi mở modal
    setCurrentStep(0);

    if (mode === 'edit' && campaign) {
      console.log('Populating form with campaign:', campaign);
      
      // Populate form với dữ liệu campaign
      const formValues = {
        campaignName: campaign.campaignName || '',
        description: campaign.campaignDescription || campaign.description || '',
        dateRange: [
          campaign.startDate ? parseDateFromAPI(campaign.startDate) : null,
          campaign.endDate ? parseDateFromAPI(campaign.endDate) : null,
        ],
        isActive: campaign.isActive !== undefined ? campaign.isActive : true,
      };

      // Chỉ set vouchers nếu đã có (đã load xong)
      if (campaign.vouchers && Array.isArray(campaign.vouchers) && campaign.vouchers.length > 0) {
        formValues.vouchers = campaign.vouchers;
      } else {
        formValues.vouchers = [{}]; // Tạo voucher trống nếu chưa có
      }

      // Sử dụng setTimeout để đảm bảo form đã được mount
      setTimeout(() => {
        form.setFieldsValue(formValues);
        console.log('Form values set:', formValues);
      }, 150);
    } else if (mode === 'create') {
      form.resetFields();
      form.setFieldsValue({
        vouchers: [{}], // Khởi tạo với 1 voucher trống
      });
    }
  }, [campaign, mode, form, visible]);

  const steps = [
    {
      title: 'Thông tin chiến dịch',
      content: (
        <div className="mt-6">
          <Form.Item
            name="campaignName"
            label="Tên chiến dịch"
            rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}
          >
            <Input placeholder="Ví dụ: Holiday Sale Campaign" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả chiến dịch"
            rules={[{ max: 500, message: 'Tối đa 500 ký tự' }]}
          >
            <TextArea rows={4} placeholder="Mô tả ngắn gọn về chiến dịch..." />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian diễn ra"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian diễn ra' }]}
          >
            <DatePicker.RangePicker className="w-full" format="DD/MM/YYYY HH:mm" showTime size="large" />
          </Form.Item>

          {mode === 'edit' && (
            <Form.Item
              name="isActive"
              label="Trạng thái"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Đang hoạt động" unCheckedChildren="Ngưng hoạt động" />
            </Form.Item>
          )}
        </div>
      ),
    },
    {
      title: 'Danh sách Voucher',
      content: (
        <div className="mt-6">
          <Form.List name="vouchers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-700">Voucher #{name + 1}</span>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        >
                          Xóa
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'voucherType']}
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
                        {...restField}
                        name={[name, 'name']}
                        label="Tên voucher"
                        rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
                      >
                        <Input placeholder="Ví dụ: Giảm 10%" size="large" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Mô tả"
                    >
                      <TextArea rows={2} placeholder="Mô tả voucher..." />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        label="Giá trị"
                        dependencies={[[name, 'voucherType']]}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const voucherType = getFieldValue(['vouchers', name, 'voucherType']);
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
                        {...restField}
                        name={[name, 'minOrderValue']}
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
                        {...restField}
                        name={[name, 'maxDiscount']}
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
                        {...restField}
                        name={[name, 'expiryDate']}
                        label="Ngày hết hạn"
                      >
                        <DatePicker
                          className="w-full"
                          format="DD/MM/YYYY HH:mm"
                          showTime
                          size="large"
                          placeholder="Nếu để trống sẽ dùng ngày kết thúc chiến dịch"
                        />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
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
                        {...restField}
                        name={[name, 'pointToRedeem']}
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
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size="large"
                  >
                    Thêm voucher
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      ),
    },
  ];

  const next = async () => {
    // Nếu đang edit thì không cho chuyển sang step 2
    if (mode === 'edit') {
      return;
    }
    
    try {
      // Validate các field của bước hiện tại
      const fieldsToValidate = currentStep === 0 
        ? ['campaignName', 'dateRange']
        : ['vouchers'];
      
      await form.validateFields(fieldsToValidate);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleOk = async () => {
    // Nếu đang edit, chỉ validate và submit thông tin chiến dịch
    if (mode === 'edit') {
      try {
        // Validate thông tin chiến dịch
        await form.validateFields(['campaignName', 'dateRange']);
        
        const values = form.getFieldsValue();
        console.log('Form values (edit mode):', values);
        
        // Kiểm tra dateRange
        if (!values.dateRange) {
          message.error('Vui lòng chọn thời gian diễn ra cho chiến dịch');
          return;
        }

        if (!Array.isArray(values.dateRange) || values.dateRange.length !== 2) {
          message.error('Vui lòng chọn thời gian diễn ra cho chiến dịch');
          return;
        }

        const [startDate, endDate] = values.dateRange;
        if (!startDate || !endDate) {
          message.error('Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc');
          return;
        }
        
        // Chỉ gửi thông tin chiến dịch, không gửi vouchers
        const payload = {
          campaignName: values.campaignName,
          description: values.description || '',
          startDate: convertToUTCString(startDate),
          endDate: convertToUTCString(endDate),
          isActive: values.isActive !== undefined ? values.isActive : true,
        };

        console.log('Payload created (edit mode, no vouchers):', payload);
        onSubmit(payload);
      } catch (error) {
        console.error('Validation failed:', error);
        message.error('Vui lòng kiểm tra lại thông tin chiến dịch');
      }
      return;
    }

    // Logic cho create mode (giữ nguyên)
    // Đảm bảo đang ở bước cuối cùng
    if (currentStep !== steps.length - 1) {
      console.log('Not at final step, currentStep:', currentStep);
      return;
    }

    console.log('Starting handleOk, validating vouchers...');

    try {
      // Validate các field ở bước 2 (vouchers) trước
      await form.validateFields(['vouchers']);
      console.log('Voucher validation passed');
    } catch (voucherError) {
      // Nếu có lỗi ở vouchers, giữ nguyên ở bước 2
      console.error('Voucher validation failed:', voucherError);
      message.error('Vui lòng kiểm tra lại thông tin các voucher');
      return;
    }

    // Lấy giá trị form mà không validate lại (vì đã validate ở bước 1 rồi)
    const values = form.getFieldsValue();
    console.log('Form values:', values);
    
    // Kiểm tra dateRange (đã được validate ở bước 1, nhưng kiểm tra lại để chắc chắn)
    if (!values.dateRange) {
      console.error('dateRange is missing');
      message.error('Vui lòng chọn thời gian diễn ra cho chiến dịch');
      setCurrentStep(0);
      return;
    }

    if (!Array.isArray(values.dateRange) || values.dateRange.length !== 2) {
      console.error('dateRange is not a valid array:', values.dateRange);
      message.error('Vui lòng chọn thời gian diễn ra cho chiến dịch');
      setCurrentStep(0);
      return;
    }

    const [startDate, endDate] = values.dateRange;
    if (!startDate || !endDate) {
      console.error('startDate or endDate is missing:', { startDate, endDate });
      message.error('Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc');
      setCurrentStep(0);
      return;
    }

    // Kiểm tra vouchers
    if (!values.vouchers || values.vouchers.length === 0) {
      console.error('No vouchers found');
      message.error('Vui lòng thêm ít nhất một voucher');
      return; // Giữ nguyên ở bước 2
    }

    // Kiểm tra từng voucher có đầy đủ thông tin không
    const invalidVouchers = values.vouchers.filter((v) => {
      if (!v.name || !v.voucherType) {
        return true;
      }
      // FREE_ITEM và FREESHIP không cần value
      if (v.voucherType === 'FREE_ITEM' || v.voucherType === 'FREESHIP') {
        return false;
      }
      // PERCENT và AMOUNT cần value
      return v.value === undefined || v.value === null;
    });
    
    if (invalidVouchers.length > 0) {
      console.error('Invalid vouchers found:', invalidVouchers);
      message.error('Vui lòng điền đầy đủ thông tin cho tất cả các voucher');
      return; // Giữ nguyên ở bước 2
    }
    
    console.log('All validations passed, creating payload...');
    
    // Chuyển đổi dateRange thành startDate và endDate
    const payload = {
      campaignName: values.campaignName,
      description: values.description || '',
      startDate: convertToUTCString(startDate),
      endDate: convertToUTCString(endDate),
      vouchers: values.vouchers.map(voucher => ({
        voucherType: voucher.voucherType || 'PERCENT',
        name: voucher.name,
        description: voucher.description || '',
        value: (voucher.voucherType === 'FREE_ITEM' || voucher.voucherType === 'FREESHIP') 
          ? 0 
          : (voucher.value || 0),
        minOrderValue: voucher.minOrderValue || 0,
        maxDiscount: voucher.maxDiscount || 0,
        expiryDate: voucher.expiryDate ? convertToUTCString(voucher.expiryDate) : convertToUTCString(endDate),
        quantity: voucher.quantity || 1,
        pointToRedeem: voucher.pointToRedeem || 0,
      })),
    };

    console.log('Payload created, calling onSubmit:', payload);
    onSubmit(payload);
  };

  const handleCancel = () => {
    setCurrentStep(0);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={mode === 'edit' ? 'Chỉnh sửa chiến dịch' : 'Thêm chiến dịch mới'}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        mode === 'create' && currentStep > 0 && (
          <Button key="prev" onClick={prev}>
            Quay lại
          </Button>
        ),
        mode === 'create' && currentStep < steps.length - 1 ? (
          <Button key="next" type="primary" onClick={next}>
            Tiếp theo
          </Button>
        ) : (
          <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
            {mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        ),
      ]}
      destroyOnClose
      width={900}
    >
      {mode === 'create' && (
        <Steps current={currentStep} className="mb-6">
          {steps.map((step) => (
            <Step key={step.title} title={step.title} />
          ))}
        </Steps>
      )}

      <Form 
        layout="vertical" 
        form={form} 
        preserve={true}
        initialValues={
          mode === 'edit' && campaign
            ? {
                campaignName: campaign.campaignName || '',
                description: campaign.campaignDescription || campaign.description || '',
                dateRange: [
                  campaign.startDate ? parseDateFromAPI(campaign.startDate) : null,
                  campaign.endDate ? parseDateFromAPI(campaign.endDate) : null,
                ],
                isActive: campaign.isActive !== undefined ? campaign.isActive : true,
                vouchers: campaign.vouchers && Array.isArray(campaign.vouchers) && campaign.vouchers.length > 0
                  ? campaign.vouchers
                  : [{}],
              }
            : {
                vouchers: [{}],
              }
        }
      >
        {/* Render tất cả các field nhưng chỉ hiển thị field của bước hiện tại */}
        {/* Khi edit, chỉ hiển thị step 0 (thông tin chiến dịch) */}
        <div style={{ display: (mode === 'edit' || currentStep === 0) ? 'block' : 'none' }}>
          {steps[0].content}
        </div>
        {/* Chỉ hiển thị step 1 khi create và đang ở step 1 */}
        {mode === 'create' && (
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            {steps[1].content}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default VoucherCampaignFormModal;
