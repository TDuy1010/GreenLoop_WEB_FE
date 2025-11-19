import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Button,
  Input,
  Table,
  Tag,
  Space,
  Switch,
  Typography,
  Modal,
  Form,
  message,
  Statistic,
  Row,
  Col,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryActiveStatus,
} from '../../../service/api/categoryApi';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [activeToggleId, setActiveToggleId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const normalizeCategories = (response) => {
    if (!response) return [];

    const dataCandidate =
      Array.isArray(response?.data) || !response?.data
        ? response?.data
        : response?.data?.content;

    const list = Array.isArray(dataCandidate) ? dataCandidate : [];

    return list.map((item, index) => ({
      id: item.id ?? index,
      code: item.code || `CAT-${item.id ?? index + 1}`,
      name: item.name || 'Chưa đặt tên',
      description: item.description || '',
      isActive: Boolean(
        item.isActive ?? item.active ?? item.status ?? item.enabled ?? true,
      ),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();

      if (response?.success === false) {
        throw new Error(response?.message || 'Không thể tải danh mục');
      }

      const parsedCategories = normalizeCategories(response);
      setCategories(parsedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error(error?.message || 'Có lỗi xảy ra khi tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchText) return categories;
    return categories.filter((category) => {
      const term = searchText.toLowerCase();
      return (
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term)
      );
    });
  }, [categories, searchText]);

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setModalSubmitting(true);

      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await createCategory(values);
        message.success('Thêm danh mục mới thành công');
      }

      handleModalCancel();
      fetchCategories();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }
      console.error('Error saving category:', error);
      message.error(error?.message || 'Không thể lưu danh mục');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleToggleActive = async (record) => {
    try {
      setActiveToggleId(record.id);
      await updateCategoryActiveStatus(record.id);
      message.success(
        record.isActive ? 'Đã vô hiệu hóa danh mục' : 'Đã kích hoạt danh mục',
      );
      setCategories((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
    } catch (error) {
      console.error('Error toggling category status:', error);
      message.error(error?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setActiveToggleId(null);
    }
  };

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text strong>{id}</Text>,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (value) => <Text type="secondary">{value || '—'}</Text>,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive_toggle',
      width: 140,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          onChange={() => handleToggleActive(record)}
          loading={activeToggleId === record.id}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => openEditModal(record)}
          type="link"
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Title level={3} className="m-0">
              Quản lý danh mục
            </Title>
            <Paragraph className="text-gray-500 mb-0">
              Theo dõi và cập nhật các danh mục sản phẩm trong hệ thống.
            </Paragraph>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchCategories}
              loading={loading}
            >
              Tải lại
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Thêm danh mục
            </Button>
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng danh mục"
              value={totalCategories}
              valueStyle={{ color: '#2563eb' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeCategories}
              valueStyle={{ color: '#16a34a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Ngưng hoạt động"
              value={inactiveCategories}
              valueStyle={{ color: '#dc2626' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="mb-4">
          <Search
            placeholder="Tìm theo tên hoặc mô tả danh mục..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            onSearch={(value) => setSearchText(value.trim())}
            onChange={(event) => {
              if (!event.target.value) {
                setSearchText('');
              }
            }}
          />
        </div>
        <Table
          dataSource={filteredCategories}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `${total} danh mục`,
          }}
          locale={{
            emptyText: (
              <Empty description="Chưa có danh mục nào. Hãy thêm mới ngay!" />
            ),
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
        open={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleSubmit}
        okText={editingCategory ? 'Cập nhật' : 'Thêm mới'}
        confirmLoading={modalSubmitting}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            name: '',
            description: '',
          }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục' },
              { max: 100, message: 'Tên tối đa 100 ký tự' },
            ]}
          >
            <Input placeholder="Ví dụ: Đồ gia dụng" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 255, message: 'Mô tả tối đa 255 ký tự' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Thông tin mô tả ngắn gọn..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;


