import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Avatar,
  Modal,
  Form,
  DatePicker,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Search } = Input;
const { Option } = Select;

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@greenloop.com",
      phone: "0901234567",
      position: "Quản lý",
      department: "Vận hành",
      status: "active",
      joinDate: "2023-01-15",
      avatar: null,
      salary: 15000000,
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@greenloop.com",
      phone: "0901234568",
      position: "Nhân viên",
      department: "Marketing",
      status: "active",
      joinDate: "2023-03-20",
      avatar: null,
      salary: 12000000,
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong.le@greenloop.com",
      phone: "0901234569",
      position: "Nhân viên",
      department: "Kỹ thuật",
      status: "inactive",
      joinDate: "2023-02-10",
      avatar: null,
      salary: 13000000,
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung.pham@greenloop.com",
      phone: "0901234570",
      position: "Trưởng phòng",
      department: "Nhân sự",
      status: "active",
      joinDate: "2022-12-05",
      avatar: null,
      salary: 18000000,
    },
  ]);

  const [filteredData, setFilteredData] = useState(staffData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Statistics
  const totalStaff = staffData.length;
  const activeStaff = staffData.filter(
    (staff) => staff.status === "active"
  ).length;
  const inactiveStaff = staffData.filter(
    (staff) => staff.status === "inactive"
  ).length;
  const departments = [...new Set(staffData.map((staff) => staff.department))]
    .length;

  // Table columns
  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={record.avatar}
            className="bg-green-100 text-green-600"
          />
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-gray-400" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <PhoneOutlined className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      render: (department) => <Tag color="blue">{department}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Đang làm việc" : "Nghỉ việc"}
        </Tag>
      ),
    },

    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, filterDepartment, filterStatus);
  };

  const handleDepartmentFilter = (value) => {
    setFilterDepartment(value);
    filterData(searchText, value, filterStatus);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    filterData(searchText, filterDepartment, value);
  };

  const filterData = (search, department, status) => {
    let filtered = staffData;

    if (search) {
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(search.toLowerCase()) ||
          staff.email.toLowerCase().includes(search.toLowerCase()) ||
          staff.phone.includes(search)
      );
    }

    if (department !== "all") {
      filtered = filtered.filter((staff) => staff.department === department);
    }

    if (status !== "all") {
      filtered = filtered.filter((staff) => staff.status === status);
    }

    setFilteredData(filtered);
  };

  // Handle CRUD operations
  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    form.setFieldsValue({
      ...staff,
      joinDate: staff.joinDate ? new Date(staff.joinDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    const newData = staffData.filter((staff) => staff.id !== id);
    setStaffData(newData);
    filterData(searchText, filterDepartment, filterStatus);
    message.success("Xóa nhân viên thành công!");
  };

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        joinDate: values.joinDate ? values.joinDate.format("YYYY-MM-DD") : null,
        id: editingStaff ? editingStaff.id : Date.now(),
      };

      if (editingStaff) {
        // Update existing staff
        const newData = staffData.map((staff) =>
          staff.id === editingStaff.id
            ? { ...staff, ...formattedValues }
            : staff
        );
        setStaffData(newData);
        message.success("Cập nhật nhân viên thành công!");
      } else {
        // Add new staff
        setStaffData([...staffData, formattedValues]);
        message.success("Thêm nhân viên thành công!");
      }

      setIsModalVisible(false);
      form.resetFields();
      filterData(searchText, filterDepartment, filterStatus);
    } catch (error) {
      message.error("Có lỗi xảy ra!");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng nhân viên"
              value={totalStaff}
              prefix={<UserOutlined className="text-blue-600" />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang làm việc"
              value={activeStaff}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Nghỉ việc"
              value={inactiveStaff}
              prefix={<UserOutlined className="text-red-600" />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Phòng ban"
              value={departments}
              prefix={<UserOutlined className="text-purple-600" />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 m-0">
              Danh sách nhân viên
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              Thêm nhân viên
            </Button>
          </div>
        }
        className="shadow-sm"
      >
        {/* Filters */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <Search
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1"
          />
          <Select
            placeholder="Lọc theo phòng ban"
            size="large"
            value={filterDepartment}
            onChange={handleDepartmentFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả phòng ban</Option>
            <Option value="Vận hành">Vận hành</Option>
            <Option value="Marketing">Marketing</Option>
            <Option value="Kỹ thuật">Kỹ thuật</Option>
            <Option value="Nhân sự">Nhân sự</Option>
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            size="large"
            value={filterStatus}
            onChange={handleStatusFilter}
            className="w-full sm:w-48"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Đang làm việc</Option>
            <Option value="inactive">Nghỉ việc</Option>
          </Select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nhân viên`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStaff ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Chức vụ"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
              >
                <Select placeholder="Chọn chức vụ">
                  <Option value="Nhân viên">Nhân viên</Option>
                  <Option value="Quản lý">Quản lý</Option>
                  <Option value="Trưởng phòng">Trưởng phòng</Option>
                  <Option value="Giám đốc">Giám đốc</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Phòng ban"
                rules={[
                  { required: true, message: "Vui lòng chọn phòng ban!" },
                ]}
              >
                <Select placeholder="Chọn phòng ban">
                  <Option value="Vận hành">Vận hành</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Kỹ thuật">Kỹ thuật</Option>
                  <Option value="Nhân sự">Nhân sự</Option>
                  <Option value="Kế toán">Kế toán</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Đang làm việc</Option>
                  <Option value="inactive">Nghỉ việc</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="Ngày vào làm"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày vào làm!" },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày vào làm"
                  className="w-full"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="Lương (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập lương!" }]}
              >
                <Input
                  type="number"
                  placeholder="Nhập lương"
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                {editingStaff ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default StaffManagement;
