import React, { useState, useEffect } from 'react';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo_v1 from '../../../assets/images/Logo.png';

const { Header } = Layout;

const items1 = [
  { key: '/', label: 'Cửa hàng' },
  { key: '/Products', label: 'Sản phẩm' },
  { key: '/contact', label: 'Liên hệ' },
  { key: '/album', label: 'Bộ sưu tập' }
];

const CustomHeader = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  // Load thông tin người dùng từ localStorage khi component được render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    } else {
      setUsername(null);
    }
  }, []);

  // Xử lý đăng nhập
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Xử lý đăng xuất
  const handleLogoutClick = () => {
    localStorage.removeItem('user'); // Xóa thông tin user khỏi localStorage
    setUsername(null); // Xóa trạng thái username
    navigate('/'); // Quay lại trang chủ sau khi đăng xuất
  };

  // Xử lý chuyển đến trang cá nhân
  const handleProfileClick = () => {
    navigate('/profile'); // Điều hướng đến trang thông tin cá nhân
  };

  // Xử lý chuyển trang khi click menu
  const handleMenuClick = ({ key }) => {
    navigate(key); // Điều hướng đến các route tương ứng
  };

  // Menu khi người dùng đã đăng nhập
  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleProfileClick}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="2" danger onClick={handleLogoutClick} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        padding: '20px 40px',
        height: '120px',
      }}
    >
      {/* Logo và thương hiệu */}
      <div className="logo-brand" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo_v1} alt="logo" style={{ height: '150px', marginRight: '3px' }} />
        <span className="brand" style={{ fontSize: '18px', fontWeight: 'bold' }}>
          <h2><span style={{ color: 'orange' }}>F5</span> Fashion</h2>
        </span>
      </div>

      {/* Menu điều hướng */}
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={['/']}
        onClick={handleMenuClick}
        items={items1}
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      />

      {/* Thanh tìm kiếm */}
      <div>
        <Input placeholder="Search" />
      </div>

      {/* Phần giỏ hàng và thông tin tài khoản */}
      <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button type="link" icon={<ShoppingCartOutlined />} style={{ fontSize: '16px' }}>Giỏ hàng</Button>
        {username ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="link">
              <Space>
                <span style={{ fontSize: '16px' }}>Xin chào, {username}</span>
              </Space>
            </Button>
          </Dropdown>
        ) : (
          <Button type="link" icon={<UserOutlined />} style={{ fontSize: '16px' }} onClick={handleLoginClick}>
            Đăng nhập
          </Button>
        )}
      </div>
    </Header>
  );
};

export default CustomHeader;
