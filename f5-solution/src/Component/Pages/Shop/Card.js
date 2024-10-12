import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined, DeleteTwoTone } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, Table, Row, Col, message, Image, Spin } from 'antd';
import logo_v1 from '../../../assets/images/Logo.png';
import './Home.css';
const { Header, Content } = Layout;

const items1 = [
    { key: '/', label: 'Cửa hàng' },
    { key: '/Products', label: 'Sản phẩm' },
    { key: '/contact', label: 'Liên hệ' },
    { key: '/album', label: 'Bộ sưu tập' }
];

const Cart = () => {
    const navigate = useNavigate();
    const [TaiKhoan, setUsername] = useState(null);
    const [loading, setLoading] = useState(false); // State for loading spinner

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.TaiKhoan);
        }
    }, []);
    const handleContinueShopping = () => {
        message.success('Continue shopping')
        setLoading(true); // Start loading
        setTimeout(() => {
            navigate('/'); // Redirect after a short delay
        }, 2000); // Adjust delay as needed
    }
    const handleLoginClick = () => {
        navigate('/login');
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

    const [cartItems, setCartItems] = useState([
        { key: 1, image: 'https://product.hstatic.net/200000182297/product/3_546959316b5642f2a2ef2c3bbe0423f0_master.jpg', name: 'Product 1', price: 50, quantity: 2 },
        { key: 2, image: 'https://product.hstatic.net/200000182297/product/2_01427c39fc824af3940e9ca334275070_master.jpg', name: 'Product 2', price: 30, quantity: 1 },
        { key: 3, image: 'https://product.hstatic.net/200000182297/product/6_d5e0224e09b348a08caa34d04a6fd1ec_master.jpg', name: 'Product 3', price: 20, quantity: 4 }
    ]);

    const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleDelete = (key) => {
        setCartItems(cartItems.filter(item => item.key !== key));
        message.success('Sản phẩm đã được xóa khỏi giỏ hàng');
    };

    const handleClearCart = () => {
        setCartItems([]);
        message.success('Đã xóa giỏ hàng');
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="danger" onClick={() => handleDelete(record.key)} ><DeleteTwoTone /></Button>
            )
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
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

                <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button type="link" icon={<ShoppingCartOutlined />} style={{ fontSize: '16px' }}>Giỏ hàng</Button>
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
            <Layout>
                <Content
                    style={{
                        margin: '0 10%',
                        minHeight: "100%",
                        background: '#fff',
                        borderRadius: '4px',
                    }}
                >
                    <Table
                        dataSource={cartItems}
                        columns={columns}
                        pagination={false}
                        summary={() => (
                            <Table.Summary.Row >
                                <Table.Summary.Cell colSpan={5} style={{ textAlign: 'right' }}>
                                    <strong>Total:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell colSpan={3}>
                                    <strong>{getTotalPrice()} VNĐ</strong>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                    {/* Clear Cart Button */}
                    <Row justify="end" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Button type="danger" onClick={handleClearCart} style={{ width: '150px', height: '20px' }}>
                                Clear Cart
                            </Button>
                        </Col>
                    </Row>

                    {/* Continue Shopping and Checkout Buttons */}
                    <Row justify="end" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Button
                                type="primary"
                                onClick={handleContinueShopping}
                                style={{ backgroundColor: 'black', borderColor: 'black', height: '50px', width: '200px', marginRight: '10px' }}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <Spin size="small" /> : 'Tiếp tục mua sắm'}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                onClick={() => message.info('Proceed to checkout')}
                                style={{ backgroundColor: 'black', borderColor: 'black', height: '50px', width: '200px' }}
                            >
                                Checkout
                            </Button>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Cart;
