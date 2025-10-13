// Sidebar.jsx
import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Badge, Alert } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  // Cấu hình menu
  const menuItems = useMemo(
    () => [
      { key: '/admin/dashboard', label: 'Bảng điều khiển', icon: <DashboardOutlined /> },
      { key: '/admin/staff',  label: 'Quản lý nhân viên', icon: <UserOutlined /> },
      { key: '/admin/users',     label: 'Quản lý người dùng', icon: <UserOutlined /> },
      { key: '/admin/products',  label: 'Quản lý sản phẩm', icon: <AppstoreOutlined /> },
      { key: '/admin/warehouses', label: 'Quản lý kho', icon: <HomeOutlined /> },
      { key: '/admin/events',    label: 'Quản lý sự kiện', icon: <CalendarOutlined /> },
      { key: '/admin/donations', label: 'Quản lý quyên góp', icon: <HeartOutlined /> },
      { key: '/admin/orders',    label: 'Quản lý đơn hàng', icon: <ShoppingCartOutlined /> },
      { key: '/admin/analytics', label: 'Thống kê & Báo cáo', icon: <BarChartOutlined /> },
      { key: '/admin/settings',  label: 'Cài đặt hệ thống', icon: <SettingOutlined /> },
      { key: '/admin/logout',    label: 'Đăng xuất', icon: <LogoutOutlined /> },
      
    ],
    []
  );

  // Xác định key đang active theo pathname
  const selectedKey = useMemo(() => {
    // Ưu tiên match dài nhất (để /admin/products/123 vẫn ăn /admin/products)
    const path = location.pathname;
    const candidate = menuItems
      .map(m => m.key)
      .sort((a, b) => b.length - a.length)
      .find(k => path === k || path.startsWith(k + '/'));
    return candidate || '/admin/dashboard';
  }, [location.pathname, menuItems]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onToggle}
      width={256}
      collapsedWidth={64}
      theme="light"
      breakpoint="lg"
      className="h-screen fixed left-0 top-0 border-r border-gray-200 shadow-md z-40"
      trigger={null} // dùng nút custom
    >
      {/* Logo + Toggle */}
      <div className={`flex items-center border-b border-gray-200 min-h-16 ${
        collapsed 
          ? 'justify-center px-2 py-3' 
          : 'justify-between px-3 py-3'
      }`}>
        {collapsed ? (
          // Collapsed state - chỉ hiển thị logo ở giữa
          <Link to="/admin/dashboard" className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-300 grid place-items-center flex-shrink-0">
              <span className="text-white font-bold text-sm">G</span>
            </div>
          </Link>
        ) : (
          // Expanded state - chỉ logo + text (không có toggle button)
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-300 grid place-items-center flex-shrink-0">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div className="overflow-hidden">
              <Text strong className="block text-gray-900 text-base">
                GreenLoop
              </Text>
              <Text type="secondary" className="text-xs">
                Admin Panel
              </Text>
            </div>
          </Link>
        )}
      </div>

      {/* Menu điều hướng */}
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        items={menuItems.map(mi => ({
          key: mi.key,
          icon: mi.icon,
          // AntD tự hiện tooltip = title khi inlineCollapsed = true
          label: <Link to={mi.key}>{mi.label}</Link>,
          title: mi.label,
        }))}
        className="p-2 border-r-0"
      />
    </Sider>
  );
};

export default Sidebar;
