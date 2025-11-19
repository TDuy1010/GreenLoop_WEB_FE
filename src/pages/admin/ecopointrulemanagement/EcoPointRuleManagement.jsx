import React, { useCallback, useEffect, useState } from 'react';
import { Card, Typography, Button, Space, message, Form } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getEcoPointRules, createEcoPointRule, changeEcoPointRuleStatus, updateEcoPointRule } from '../../../service/api/ecoPointsApi';
import { getAllCategories } from '../../../service/api/categoryApi';
import EcoRuleFilters from './components/EcoRuleFilters';
import EcoRuleTable from './components/EcoRuleTable';
import EcoRuleCreateModal from './components/EcoRuleCreateModal';
import EcoRuleEditModal from './components/EcoRuleEditModal';

const { Title, Paragraph } = Typography;

const defaultFilters = {
  actionType: 'all',
  code: '',
  name: '',
  categoryId: '',
};

const actionTypeOptions = [
  { value: 'DONATION', label: 'DONATION' },
  { value: 'RESALE', label: 'RESALE' },
  { value: 'CHECK_IN', label: 'CHECK_IN' }
];

const EcoPointRuleManagement = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEcoPointRules({
        actionType: filters.actionType !== 'all' ? filters.actionType : undefined,
        code: filters.code || undefined,
        name: filters.name || undefined,
        categoryId: filters.categoryId || undefined,
      });

      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể tải danh sách quy tắc');
      }

      const payload = response?.data ?? response;
      let list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

      if (filters.categoryId) {
        const catIdNumber = Number(filters.categoryId);
        list = list.filter(rule => Number(rule.categoryId) === catIdNumber);
      }

      setRules(list);
    } catch (error) {
      console.error('Error fetching eco point rules:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tải danh sách quy tắc');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleToggleStatus = useCallback(
    async (rule) => {
      try {
        await changeEcoPointRuleStatus(rule.id, !rule.isActive);
        message.success('Cập nhật trạng thái quy tắc thành công');
        fetchRules();
      } catch (error) {
        console.error('Error updating status:', error);
        message.error(error?.message || 'Không thể cập nhật trạng thái');
      }
    },
    [fetchRules]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response?.success === false) {
          throw new Error(response?.message || 'Không thể tải danh mục');
        }
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setCategoryOptions(list);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error(error?.message || 'Không thể tải danh mục');
      }
    };

    fetchCategories();
  }, []);

  const handleRefresh = () => {
    setFilters(defaultFilters);
    message.success('Đã đặt lại bộ lọc và tải dữ liệu');
  };

  const handleCreate = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };

  const handleCreateRule = async () => {
    try {
      const values = await createForm.validateFields();
      setCreateLoading(true);
      const payload = {
        code: values.code.trim(),
        name: values.name.trim(),
        description: values.description?.trim(),
        actionType: values.actionType,
        minPoints: values.minPoints,
        maxPoints: values.maxPoints,
        categoryId: values.categoryId,
      };

      const response = await createEcoPointRule(payload);
      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể tạo quy tắc mới');
      }

      message.success('Thêm quy tắc eco point thành công');
      setIsCreateModalVisible(false);
      fetchRules();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      console.error('Error creating eco point rule:', error);
      const conflictMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Có lỗi xảy ra khi tạo quy tắc';
      message.error(conflictMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenEdit = useCallback((rule) => {
    setEditingRule(rule);
    editForm.setFieldsValue({
      code: rule.code,
      name: rule.name,
      description: rule.description,
      actionType: rule.actionType,
      minPoints: rule.minPoints,
      maxPoints: rule.maxPoints,
      categoryId: rule.categoryId,
    });
    setEditModalVisible(true);
  }, [editForm]);

  const handleUpdateRule = async () => {
    try {
      if (!editingRule) return;
      const values = await editForm.validateFields();
      setEditLoading(true);
      const payload = {
        code: values.code.trim(),
        name: values.name.trim(),
        description: values.description?.trim(),
        actionType: values.actionType,
        minPoints: values.minPoints,
        maxPoints: values.maxPoints,
        categoryId: values.categoryId,
      };

      const response = await updateEcoPointRule(editingRule.id, payload);
      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể cập nhật quy tắc');
      }

      message.success('Cập nhật quy tắc thành công');
      setEditModalVisible(false);
      setEditingRule(null);
      fetchRules();
    } catch (error) {
      if (error?.errorFields) return;
      console.error('Error updating eco point rule:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Có lỗi xảy ra khi cập nhật quy tắc';
      message.error(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="m-0">
              Quản lý Eco Point Rule
            </Title>
            <Paragraph className="text-gray-500 mb-0">
              Cấu hình quy tắc tích và sử dụng điểm Eco cho hệ thống.
            </Paragraph>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Thêm quy tắc
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="shadow-sm">
        <EcoRuleFilters
          filters={filters}
          onFiltersChange={setFilters}
          actionTypeOptions={actionTypeOptions}
          categoryOptions={categoryOptions}
        />
      </Card>

      <Card className="shadow-sm">
        <EcoRuleTable
          rules={rules}
          loading={loading}
          categoryOptions={categoryOptions}
          onToggleStatus={handleToggleStatus}
          onEdit={handleOpenEdit}
        />
      </Card>

      <EcoRuleCreateModal
        visible={isCreateModalVisible}
        loading={createLoading}
        form={createForm}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateRule}
        actionTypeOptions={actionTypeOptions}
        categoryOptions={categoryOptions}
      />

      <EcoRuleEditModal
        visible={editModalVisible}
        loading={editLoading}
        form={editForm}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingRule(null);
        }}
        onSubmit={handleUpdateRule}
        actionTypeOptions={actionTypeOptions}
        categoryOptions={categoryOptions}
      />
    </div>
  );
};

export default EcoPointRuleManagement;


