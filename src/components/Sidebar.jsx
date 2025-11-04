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
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  // Cấu hình menu
  const menuItems = useMemo(
    () => [
      { 
        key: '/admin/dashboard', 
        label: 'Bảng điều khiển', 
        icon: <DashboardOutlined /> 
      },
      { 
        key: 'user-management',
        label: 'Quản lý người dùng',
        icon: <TeamOutlined />,
        children: [
          {
            key: '/admin/users',
            label: 'Quản lý khách hàng',
            icon: <UserOutlined />
          },
          {
            key: '/admin/staff',
            label: 'Quản lý nhân viên',
            icon: <UsergroupAddOutlined />
          }
        ]
      },
      { 
        key: '/admin/products', 
        label: 'Quản lý sản phẩm', 
        icon: <AppstoreOutlined /> 
      },
      { 
        key: '/admin/warehouses', 
        label: 'Quản lý kho', 
        icon: <HomeOutlined /> 
      },
      { 
        key: '/admin/events', 
        label: 'Quản lý sự kiện', 
        icon: <CalendarOutlined /> 
      },
      { 
        key: '/admin/donations', 
        label: 'Quản lý quyên góp', 
        icon: <HeartOutlined /> 
      },
      { 
        key: '/admin/orders', 
        label: 'Quản lý đơn hàng', 
        icon: <ShoppingCartOutlined /> 
      },
      { 
        key: '/admin/analytics', 
        label: 'Thống kê & Báo cáo', 
        icon: <BarChartOutlined /> 
      },
      { 
        key: '/admin/settings', 
        label: 'Cài đặt hệ thống', 
        icon: <SettingOutlined /> 
      },
      // Đăng xuất được di chuyển sang dropdown trong Admin header
      // { 
      //   key: '/admin/logout', 
      //   label: 'Đăng xuất', 
      //   icon: <LogoutOutlined /> 
      // },
    ],
    []
  );

  // Xác định key đang active và submenu mở
  const { selectedKey, openKeys } = useMemo(() => {
    const path = location.pathname;
    
    // Tìm menu item có children match với path
    for (const item of menuItems) {
      if (item.children) {
        const matchedChild = item.children.find(
          child => path === child.key || path.startsWith(child.key + '/')
        );
        if (matchedChild) {
          return {
            selectedKey: matchedChild.key,
            openKeys: [item.key]
          };
        }
      } else if (path === item.key || path.startsWith(item.key + '/')) {
        return {
          selectedKey: item.key,
          openKeys: []
        };
      }
    }
    
    return {
      selectedKey: '/admin/dashboard',
      openKeys: []
    };
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
        defaultOpenKeys={openKeys}
        items={menuItems.map(mi => ({
          key: mi.key,
          icon: mi.icon,
          label: mi.children ? mi.label : <Link to={mi.key}>{mi.label}</Link>,
          title: mi.label,
          children: mi.children?.map(child => ({
            key: child.key,
            icon: child.icon,
            label: <Link to={child.key}>{child.label}</Link>,
            title: child.label,
          }))
        }))}
        className="p-2 border-r-0"
      />
    </Sider>
  );
};

export default Sidebar;
