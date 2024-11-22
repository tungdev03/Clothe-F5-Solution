import React, { useState, useEffect } from 'react';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, message } from 'antd';
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
  const [TaiKhoan, setUsername] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [MaKh, setMaKhachHang] = useState(null);
  const storedUser = localStorage.getItem('user');
  const user = JSON.parse(storedUser);
  useEffect(() => {
    // Kiểm tra thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
    }
  }, []);

  // Xử lý đăng nhập
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleOncartClick = () => {
    // Kiểm tra nếu người dùng không đăng nhập
    const storedUser = JSON.parse(localStorage.getItem('user')); // Parse dữ liệu từ localStorage
    // Kiểm tra nếu người dùng không đăng nhập
    if (!storedUser || !storedUser.TaiKhoan) {
      message.info("Vui lòng đăng nhập để xem giỏ hàng");
      navigate('/Login');
    } else {
      // Điều hướng đến giỏ hàng của người dùng đã đăng nhập
      navigate(`/cart/${storedUser.TaiKhoan}`);
    }
  }
  const handleLogoutClick = () => {
    // Xử lý đăng xuất
    localStorage.removeItem('user');
    setUsername(null); // Reset lại state username
    navigate('/'); // Điều hướng tới trang chủ sau khi đăng xuất
  };
  const handleProfileClick = () => {
    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    console.log(user.MaKh)
    setUsername(user.MaKh);
    if (user.MaKh) {
      navigate(`/Profile/${user.MaKh}`);
    }

  };
  const handleMenuClick = ({ key }) => {
    navigate(key); // Điều hướng đến đường dẫn tương ứng với key
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
        <Button onClick={handleOncartClick} type="link" icon={<ShoppingCartOutlined />} style={{ fontSize: '16px' }}>Giỏ hàng</Button>
        {TaiKhoan ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="link">
              <Space>
                <span style={{ fontSize: '16px' }}>Xin chào, {TaiKhoan}</span>
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
