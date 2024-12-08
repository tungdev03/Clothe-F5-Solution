import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, Table, Modal, Form, Input as AntdInput, Select, Row, Col, message, Image, Typography, Card, Divider,Tag } from 'antd';

import logo_v1 from '../../../assets/images/Logo.png'; // Đảm bảo đường dẫn hình ảnh đúng
// import "./ViewOrderInformation.css"

import './Home.css';

const { Header, Content } = Layout;

const { Title, Text } = Typography;

const items1 = [
  { key: '/', label: 'Cửa hàng' },
  { key: '/Products', label: 'Sản phẩm' },
  { key: '/contact', label: 'Liên hệ' },
  { key: '/album', label: 'Bộ sưu tập' }
];

const ViewOrderInformation = () => {
  const navigate = useNavigate();
  const [TaiKhoan, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([
    { key: 1, image: 'https://product.hstatic.net/200000182297/product/3_546959316b5642f2a2ef2c3bbe0423f0_master.jpg', name: 'Product 1', price: 50, quantity: 2, status: 'processing' },
    { key: 2, image: 'https://product.hstatic.net/200000182297/product/2_01427c39fc824af3940e9ca334275070_master.jpg', name: 'Product 2', price: 30, quantity: 1, status: 'shipped' },
    { key: 3, image: 'https://product.hstatic.net/200000182297/product/6_d5e0224e09b348a08caa34d04a6fd1ec_master.jpg', name: 'Product 3', price: 20, quantity: 4, status: 'delivered' }
  ]);
  const [statusOptions] = useState([
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã giao' },
    { value: 'delivered', label: 'Đã hoàn tất' },
    { value: 'cancelled', label: 'Đã hủy' }
  ]);

  // Modal show product details
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Modal for checkout
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
    }
  }, []);

  const handleContinueShopping = () => {
    message.success('Tiếp tục mua sắm');
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleBackCart = () => {
    navigate('/cart/:username');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    setUsername(null);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/');
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

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

  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleStatusChange = (key, value) => {
    setCartItems(cartItems.map(item => {
      if (item.key === key) {
        return { ...item, status: value };
      }
      return item;
    }));
    message.success('Trạng thái đơn hàng đã được thay đổi');
  };

  const columns = [
    { title: 'No.', dataIndex: 'key', key: 'key' },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image width={50} src={image} alt="product" />
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `${price} VNĐ` },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Total Price',
      key: 'total',
      render: (_, record) => `${record.price * record.quantity} VNĐ`
    },
    {
        title: 'Trạng thái',
        key: 'status',
        render: (_, record) => {
          let statusColor;
          let statusText;
      
          // Xác định trạng thái và màu sắc tương ứng
          switch (record.status) {
            case 'processing':
              statusColor = 'orange';
              statusText = 'Đang xử lý';
              break;
            case 'shipped':
              statusColor = 'green';
              statusText = 'Đã giao hàng';
              break;
            case 'pending':
              statusColor = 'blue';
              statusText = 'Chờ xử lý';
              break;
            case 'cancelled':
              statusColor = 'red';
              statusText = 'Đã hủy';
              break;
            default:
              statusColor = 'grey';
              statusText = 'Chưa xác định';
          }
      
          return (
            <span style={{ color: statusColor, fontWeight: 'bold' }}>
              {statusText}
            </span>
          );
        }
      },
      
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => handleOrderClick(record)}>Xem chi tiết đơn hàng</Button>
      ),
    }
  ];
  // Hàm trả về màu sắc cho từng trạng thái
const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'orange';
      case 'shipped':
        return 'green';
      case 'pending':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOrderDetailsVisible(true);
  };

  const handleOrderDetailsClose = () => {
    setOrderDetailsVisible(false);
    setSelectedOrder(null);
  };

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  const handleCheckoutCancel = () => {
    setCheckoutVisible(false);
  };

  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header Section */}
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
        <div className="logo-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo_v1} alt="logo" style={{ height: '150px', marginRight: '3px' }} />
          <span className="brand" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            <h2><span style={{ color: 'orange' }}>F5</span> Fashion</h2>
          </span>
        </div>
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
            lineHeight: '64px',
          }}
        />
        <div>
          <Input placeholder="Search" />
        </div>

        {/* User Actions */}
        <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button type="link" icon={<ShoppingCartOutlined />} onClick={handleBackCart} />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Button type="link" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>

      {/* Content Section */}
      <Content
        style={{
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        

        <Table
          columns={columns}
          dataSource={cartItems}
          pagination={false}
          rowKey="key"
        />

        <div style={{ marginTop: 20 }}>
          <h3>Tổng giá trị đơn hàng: {getTotalPrice()} VNĐ</h3>
          <Button onClick={handleCheckoutClick} type="primary">Thanh toán</Button>
          <Button onClick={handleBackCart} style={{ marginBottom: 20 }}>Quay lại giỏ hàng</Button>
        </div>
      </Content>


{/* Modal Order Details */}
<Modal
  title={`Chi tiết đơn hàng #${selectedOrder?.key}`}
  visible={orderDetailsVisible}
  onCancel={handleOrderDetailsClose}
  footer={null}
  width={700}
>
  {selectedOrder && (
    <Card bordered={false} style={{ padding: '20px' }}>
      <Row gutter={16}>
        {/* Tên sản phẩm */}
        <Col span={24}>
          <Title level={4}>Tên sản phẩm</Title>
          <Text>{selectedOrder.name}</Text>
        </Col>

        <Divider />

        {/* Tình trạng */}
        <Col span={24}>
          <Title level={5}>Tình trạng</Title>
          <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Tag>
        </Col>

        <Divider />

        {/* Giá */}
        <Col span={12}>
          <Title level={5}>Giá</Title>
          <Text strong>{selectedOrder.price} VNĐ</Text>
        </Col>


        {/* Số lượng */}
        <Col span={12}>
          <Title level={5}>Số lượng</Title>
          <Text>{selectedOrder.quantity}</Text>
        </Col>

        <Divider />

        {/* Tổng giá trị */}
        <Col span={24}>
          <Title level={5}>Tổng giá trị</Title>
          <Text strong>{selectedOrder.price * selectedOrder.quantity} VNĐ</Text>
        </Col>

        <Divider />

        {/* Các thông tin khác có thể thêm ở đây */}
        <Col span={24}>
          <Title level={5}>Ghi chú</Title>
          <Text>{selectedOrder.notes || 'Không có ghi chú'}</Text>
        </Col>
      </Row>
    </Card>
  )}
</Modal>
    </Layout>
  );
};

export default ViewOrderInformation;
