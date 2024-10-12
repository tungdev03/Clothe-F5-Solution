import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, Breadcrumb, Carousel, Card } from 'antd';
import logo_v1 from '../../../assets/images/Logo.png';
import './Home.css';
import './Product.css';
import { AppstoreOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Meta } = Card;

const items1 = [
    { key: '/', label: 'Cửa hàng' },
    { key: '/Products', label: 'Sản phẩm' },
    { key: '/contact', label: 'Liên hệ' },
    { key: '/album', label: 'Bộ sưu tập' }
];

const products = [
    { id: 1, title: "ĐẦM ĐEN THIẾT KẾ", description: "1.800.000 Đ", imgSrc: "https://product.hstatic.net/200000182297/product/7_9e21fe965ef2474a9f334bc640876ab4_master.jpg" },
    { id: 2, title: "Sản phẩm 2", description: "Mô tả sản phẩm 2", imgSrc: "https://product.hstatic.net/200000182297/product/3_546959316b5642f2a2ef2c3bbe0423f0_master.jpg" },
    { id: 3, title: "Sản phẩm 3", description: "Mô tả sản phẩm 3", imgSrc: "https://product.hstatic.net/200000182297/product/11_7d07e90c8fee41629d02a837fd9a3e79_master.jpg" },
    { id: 4, title: "Sản phẩm 4", description: "Mô tả sản phẩm 4", imgSrc: "https://product.hstatic.net/200000182297/product/2_01427c39fc824af3940e9ca334275070_master.jpg" },
    { id: 5, title: "Sản phẩm 5", description: "Mô tả sản phẩm 5", imgSrc: "https://product.hstatic.net/200000182297/product/4_efc408a2620c47abb7bcd9d54f47c401_master.jpg" },
    { id: 6, title: "Sản phẩm 6", description: "Mô tả sản phẩm 6", imgSrc: "https://product.hstatic.net/200000182297/product/20_95721a4d9bbb444cb5b941f7199dafd6_master.jpg" },
    { id: 7, title: "Sản phẩm 7", description: "Mô tả sản phẩm 7", imgSrc: "https://product.hstatic.net/200000182297/product/6_d5e0224e09b348a08caa34d04a6fd1ec_master.jpg" },
    { id: 8, title: "Sản phẩm 8", description: "Mô tả sản phẩm 8", imgSrc: "https://product.hstatic.net/200000182297/product/6_d5e0224e09b348a08caa34d04a6fd1ec_master.jpg" },
];

const winterProducts = [
    { id: 1, title: "MĂNG TÔ CAO CẤP AK13262", description: "2.200.000 Đ", imgSrc: "https://product.hstatic.net/200000182297/product/12_14b69d65c3014d18a336f3d8beaee4cb_master.jpg" },
    { id: 2, title: "ÁO KHOÁC THIẾT KẾ AK13742", description: "1.500.000 Đ", imgSrc: "https://product.hstatic.net/200000182297/product/14_664080a99a6f4cd6ab61b6e40a3cdb48_master.jpg" },
    { id: 3, title: "MĂNG TÔ AK11882", description: "900.000 Đ", imgSrc: "https://product.hstatic.net/200000182297/product/5_0f84ef8d1aef4341a9fe107ee70fb7db_master.jpg" },
    { id: 4, title: "MĂNG TÔ VAI CAPE AK11882", description: "3.000.000 Đ", imgSrc: "https://product.hstatic.net/200000182297/product/1_b65595811f46450087d95f1b8ad33184_master.jpg" },
    { id: 5, title: "MĂNG TÔ VAI CAPE AK11882", description: "3.000.000 Đ", imgSrc: "https://product.hstatic.net/200000182297/product/1_b65595811f46450087d95f1b8ad33184_master.jpg" },
];

const ProductPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    // Tạo state cho từ khóa tìm kiếm và sản phẩm đã lọc
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        // Lọc danh sách sản phẩm dựa trên từ khóa tìm kiếm
        const result = products.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(result);
    }, [searchTerm]);

    useEffect(() => {
        // Check user info from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
        }
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('user');
        setUsername(null);
        navigate('/'); // Redirect to homepage after logout
    };

    const handleProfileClick = () => {
        navigate('/'); // Redirect to user profile
    };

    const handleMenuClick = ({ key }) => {
        navigate(key); // Navigate to the corresponding route
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

    const [selectedCategory, setSelectedCategory] = useState('all');
    const menuItems = [
        {
            key: 'all',
            icon: <AppstoreOutlined />,
            label: 'Tất cả sản phẩm',
        },
        {
            key: 'dam',
            label: 'Đầm',
            children: [
                { key: 'dam-suong', label: 'Đầm suông' },
                { key: 'dam-dang-a', label: 'Đầm dáng A' },
                { key: 'dam-om', label: 'Đầm ôm' },
            ],
        },
        {
            key: 'ao',
            label: 'Áo',
            children: [
                {
                    key: 'so-mi', label: 'Áo sơ mi', children: [
                        { key: 'dai-tay', label: 'Dài tay' },
                        { key: 'ngan-tay', label: 'Ngắn tay' },
                        { key: 'tay-lo', label: 'Tay lỡ' }
                    ]
                },
                { key: 'ao-kieu', label: 'Áo kiểu' },
                { key: 'ao-phong', label: 'Áo phông' },
            ],
        },
        {
            key: 'quan',
            label: 'Quần',
            children: [
                { key: 'short', label: 'Quần short' },
                { key: 'lung', label: 'Quần lửng' },
                { key: 'dai', label: 'Quần dài' },
                { key: 'jeans', label: 'Quần jeans' },
            ],
        },
        {
            key: 'chanvay',
            label: 'Chân váy',
            children: [
                { key: 'xep-li', label: 'Chân váy xếp li' },
                { key: 'but-chi', label: 'Chân váy bút chì' },
                { key: 'chu-a', label: 'Chân váy chữ A' },
            ],
        },
        {
            key: 'aokhoac',
            label: 'Áo khoác',
            children: [
                { key: 'mangto', label: 'Măng tô' },
                { key: 'vest', label: 'Áo vest' },
                { key: 'phao', label: 'Áo phao' },
            ],
        },
    ];

    const handleMenuClicks = ({ key }) => {
        setSelectedCategory(key);
    };

    // Hàm điều hướng đến trang chi tiết sản phẩm khi nhấn "Xem thêm"
    const handleViewMore = (id) => {
        navigate(`/Products/${id}`);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    padding: '20px 40px', // Tăng padding
                    height: '120px', // Tăng chiều cao của header
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
                    {/* Ô tìm kiếm */}
                    <Input 
                        placeholder="Search"
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
                    />
                </div>

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
            <Breadcrumb style={{ marginLeft: "20%" }}>
                <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item>{selectedCategory}</Breadcrumb.Item>
            </Breadcrumb>
            <Carousel autoplay>
                <div>
                    <img src='https://file.hstatic.net/200000182297/file/1920x500_1419eff661374b32aa624729627c58ad.jpg' alt="Banner 1" style={{ width: '100%' }} />
                </div>
            </Carousel>
            <Layout>
                <Sider width={300} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['all']}
                        defaultOpenKeys={['all']}
                        style={{ height: '100%', borderRight: 0, left: 0 }}
                        items={menuItems}
                        onClick={handleMenuClicks}
                    />
                </Sider>

                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: '#fff',
                        borderRadius: '4px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div className="product-header">
                        <h2>TẤT CẢ SẢN PHẨM</h2>
                        <div className="filters">
                            <div className="filter-item">
                                <label htmlFor="size">Size:</label>
                                <select id="size" name="size">
                                    <option value="all">All Sizes</option>
                                    <option value="s">S</option>
                                    <option value="m">M</option>
                                    <option value="l">L</option>
                                    <option value="xl">XL</option>
                                </select>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="color">Color:</label>
                                <select id="color" name="color">
                                    <option value="all">All Colors</option>
                                    <option value="red">Red</option>
                                    <option value="blue">Blue</option>
                                    <option value="green">Green</option>
                                    <option value="black">Black</option>
                                </select>
                            </div>
                            <div className="filter-item">
                                <label htmlFor="price">Price:</label>
                                <select id="price" name="price">
                                    <option value="all">All Prices</option>
                                    <option value="0-50">0-50</option>
                                    <option value="50-100">50-100</option>
                                    <option value="100-200">100-200</option>
                                    <option value="200+">200+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Sử dụng filteredProducts thay vì products */}
                    <Carousel slidesToShow={4} dots={false} style={{ margin: '0 5%' }}>
                        {filteredProducts.map(product => (
                            <div key={product.id} style={{ padding: '0 10px' }} className="product-card">
                                <Card
                                    hoverable
                                    cover={<img alt={product.title} src={product.imgSrc} style={{ width: '100%', objectFit: 'contain', height: 'auto' }} />}
                                >
                                    <Meta title={product.title} description={product.description} />
                                </Card>
                                {/* Lớp phủ khi hover */}
                                <div className="overlay">
                                    <button className="view-more-button" onClick={() => handleViewMore(product.id)}>Xem thêm</button>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                    <Carousel slidesToShow={4} dots={false} style={{ margin: '5% 5%' }}>
                        {winterProducts.map(product => (
                            <div key={product.id} style={{ padding: '0 10px' }} className="product-card">
                                <Card
                                    hoverable
                                    cover={<img alt={product.title} src={product.imgSrc} style={{ width: '100%', objectFit: 'contain', height: 'auto' }} />}
                                >
                                    <Meta title={product.title} description={product.description} />
                                </Card>
                                {/* Lớp phủ khi hover */}
                                <div className="overlay">
                                    <button className="view-more-button" onClick={() => handleViewMore(product.id)}>Xem thêm</button>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProductPage;
