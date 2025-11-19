import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';

const EcoRuleCreateModal = ({
  visible,
  loading,
  form,
  onCancel,
  onSubmit,
  actionTypeOptions,
  categoryOptions,
}) => (
  <Modal
    title="Thêm quy tắc Eco Point"
    open={visible}
    onCancel={onCancel}
    onOk={onSubmit}
    confirmLoading={loading}
    okText="Thêm quy tắc"
    cancelText="Hủy"
    destroyOnClose
  >
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        actionType: 'DONATION',
        minPoints: 0,
        maxPoints: 100,
      }}
    >
      <Form.Item
        label="Mã quy tắc"
        name="code"
        rules={[
          { required: true, message: 'Vui lòng nhập mã quy tắc' },
          { max: 50, message: 'Tối đa 50 ký tự' },
        ]}
      >
        <Input placeholder="VD: EPOINT01" />
      </Form.Item>

      <Form.Item
        label="Tên quy tắc"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên quy tắc' },
          { max: 100, message: 'Tối đa 100 ký tự' },
        ]}
      >
        <Input placeholder="VD: Tặng điểm khi quyên góp" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ max: 255, message: 'Tối đa 255 ký tự' }]}
      >
        <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn..." />
      </Form.Item>

      <Form.Item
        label="Loại hành động"
        name="actionType"
        rules={[{ required: true, message: 'Vui lòng chọn loại hành động' }]}
      >
        <Select options={actionTypeOptions} placeholder="Chọn loại hành động" />
      </Form.Item>

      <Form.Item
        label="Danh mục"
        name="categoryId"
        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
      >
        <Select
          placeholder="Chọn danh mục"
          style={{ width: '100%' }}
          options={categoryOptions.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          loading={!categoryOptions.length}
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          label="Điểm tối thiểu"
          name="minPoints"
          rules={[
            { required: true, message: 'Vui lòng nhập điểm tối thiểu' },
            { type: 'number', min: 0, message: 'Không được âm', transform: Number },
          ]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Điểm tối đa"
          name="maxPoints"
          rules={[
            { required: true, message: 'Vui lòng nhập điểm tối đa' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const min = Number(getFieldValue('minPoints') || 0);
                if (value === undefined || value === null) {
                  return Promise.reject(new Error('Vui lòng nhập điểm tối đa'));
                }
                if (Number(value) < min) {
                  return Promise.reject(new Error('Điểm tối đa phải lớn hơn điểm tối thiểu'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
      </div>
    </Form>
  </Modal>
);

export default EcoRuleCreateModal;

