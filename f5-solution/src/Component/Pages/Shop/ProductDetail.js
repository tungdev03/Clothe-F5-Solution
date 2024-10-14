import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Layout, Menu, Dropdown, Input, Space, Card, Carousel } from 'antd';
import { UpOutlined, DownOutlined, LogoutOutlined, UserOutlined, ShoppingCartOutlined, CheckOutlined } from '@ant-design/icons';
import './Home.css';
import logo_v1 from '../../../assets/images/Logo.png';
import { Content } from 'antd/es/layout/layout';

const { Meta } = Card;
const { Header } = Layout;

const items1 = [
    { key: '/', label: 'Cửa hàng' },
    { key: '/Products', label: 'Sản phẩm' },
    { key: '/contact', label: 'Liên hệ' },
    { key: '/album', label: 'Bộ sưu tập' }
];

const products = [
    {
        id: 1,
        maSp: 'FDDDDDsjdkadsdh465644',
        title: "ĐẦM ĐEN THIẾT KẾ",
        description: "1.800.000 Đ",
        material: "Vải cotton",
        color: ["black"],
        size: ["S", "M", "L"],
        origin: "Việt Nam",
        imgSrc: "https://product.hstatic.net/200000182297/product/7_9e21fe965ef2474a9f334bc640876ab4_master.jpg",
        imgGallery: [
            "https://product.hstatic.net/200000182297/product/7_9e21fe965ef2474a9f334bc640876ab4_master.jpg",
            "https://product.hstatic.net/200000182297/product/d046621412442110457p1599dt__7__6d022f95d1004958a1066d9a71677d38_master.jpg",
            "https://product.hstatic.net/200000182297/product/d046621412442110457p1599dt__5__c919c06696364fdb9ca49efa44155b74_master.jpg",
            "https://product.hstatic.net/200000182297/product/d046621412442110457p1599dt__1__f697f759edda4db7bb7334e54df7d319_master.jpg"
        ]
    },
    {
        id: 2,
        maSp: '076821412443470401',
        title: "ĐẦM TÍM THIẾT KẾ D07682",
        description: "1,599,000₫",
        material: "Vải tổng hợp cao cấp",
        color: ["Violet"],
        size: ["S", "M", "L"],
        origin: "Việt Nam",
        imgSrc: "https://product.hstatic.net/200000182297/product/10_ff1fed504837495ea29706f50260af66_master.jpg",
        imgGallery: [
            "https://product.hstatic.net/200000182297/product/d076821412443470401p1599dt_2__82251c622bcc4c908192c5f0f331de88_master.jpg",
            "https://product.hstatic.net/200000182297/product/10_ff1fed504837495ea29706f50260af66_master.jpg",
            "https://product.hstatic.net/200000182297/product/d076821412443470401p1599dt_5__041963791a0d40189f64ce91533002f5_master.jpg",
            "https://product.hstatic.net/200000182297/product/d076821412443470401p1599dt_1__8849cb40aaa347ee83618bdb4f1a6b2b_master.jpg"
        ]

    },
    {
        id: 3,
        maSp: '065321412442000426',
        title: "ĐẦM HỌA TIẾT D06532",
        description: "1,599,000₫",
        material: "Vải thô",
        color: ["pink"],
        size: ["S", "M", "L"],
        origin: "Việt Nam",
        imgSrc: "https://product.hstatic.net/200000182297/product/9_537a6b99fc7f486a9161bde9485cd0e0_master.jpg",
        imgGallery: [
            "https://product.hstatic.net/200000182297/product/9_537a6b99fc7f486a9161bde9485cd0e0_master.jpg",
            "https://product.hstatic.net/200000182297/product/d065321412442000426p1599dt__1__b18010b7d2874606bd8191006cd903cb_master.jpg",
            "https://product.hstatic.net/200000182297/product/d065321412442000426p1599dt__2__8954a205a6e548b59b62a3893ee39913_master.jpg",
            "https://product.hstatic.net/200000182297/product/d065321412442000426p1599dt__5__0ea7d99b5bbe41ffbe66e55aaba20d69_master.jpg"
        ]
    },
    {
        id: 4,
        maSp: 'SP123458',
        title: "ĐẦM XANH THIẾT KẾ",
        description: "1.600.000 Đ",
        material: "Vải cotton",
        color: ["black", "red"],
        size: ["S", "M", "L"],
        origin: "Việt Nam",
        imgSrc: "https://product.hstatic.net/200000182297/product/7_cc62b3371eec400ca74c3378f768078c_master.jpg",
        imgGallery: [
            "https://product.hstatic.net/200000182297/product/7_cc62b3371eec400ca74c3378f768078c_master.jpg",
            "https://product.hstatic.net/200000182297/product/d087121412443070401p1599dt_52cfb875e833445791002cb2c17e321f_master.jpg",
            "https://product.hstatic.net/200000182297/product/d087121412443070401p1599dt_52cfb875e833445791002cb2c17e321f_master.jpg",
            "https://product.hstatic.net/200000182297/product/d087121412443070401p1599dt_1__3c0c4731367f4b70bb30161dfae8c622_master.jpg"
        ]
    },
    {
        id: 5,
        maSp: 'SP123856',
        title: "ĐẦM XANH THIẾT KẾ",
        description: "1.600.000 Đ",
        material: "Vải cotton",
        color: ["black", "red"],
        size: ["S", "M", "L"],
        origin: "Việt Nam",
        imgSrc: "https://product.hstatic.net/200000182297/product/9_537a6b99fc7f486a9161bde9485cd0e0_master.jpg",
        imgGallery: [
            "https://product.hstatic.net/200000182297/product/7_9e21fe965ef2474a9f334bc640876ab4_master.jpg",
            "https://product.hstatic.net/200000182297/product/d046621412442110457p1599dt__7__6d022f95d1004958a1066d9a71677d38_master.jpg",
            "https://product.hstatic.net/200000182297/product/d046621412442110457p1599dt__5__c919c06696364fdb9ca49efa44155b74_master.jpg",
            "https://product.hstatic.net/200000182297/product/d046621412442110457p1599dt__1__f697f759edda4db7bb7334e54df7d319_master.jpg"
        ]
    }
];

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [username, setUsername] = useState(null);

    // State cho form mua hàng
    const [showForm, setShowForm] = useState(false);
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [startIndex, setStartIndex] = useState(0);

    const galleryLength = product?.imgGallery.length || 0;
    const visibleImages = 3;

    useEffect(() => {
        const product = products.find((item) => item.id === parseInt(id));
        if (product) {
            setProduct(product);
            setMainImage(product.imgSrc);
        } else {
            setProduct(null);
        }
    }, [id]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
        }
    }, []);

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng.");
            return;
        }
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ ...product, selectedColor, selectedSize });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    const handleBuyNow = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và size trước khi mua.");
            return;
        }
        setShowForm(true); // Hiển thị form mua hàng
    };

    const handleCloseForm = (e) => {
        if (e.target.className === 'overlay') {
            setShowForm(false);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const handleNext = () => {
        if (startIndex + visibleImages < galleryLength) {
            setStartIndex(startIndex + 1);
        }
    };

    const handleSelectColor = (color) => {
        setSelectedColor(color);
    };

    const handleSelectSize = (size) => {
        setSelectedSize(size);
    };

    if (!product) {
        return <div>Product not found</div>;
    }

    const userMenu = (
        <Menu>
            <Menu.Item key="1" onClick={() => navigate('/profile')}>
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Item key="2" danger onClick={() => { localStorage.removeItem('user'); setUsername(null); navigate('/'); }}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const handleViewMore = (id) => {
        navigate(`/Products/${id}`);
    };

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    padding: '20px 40px',
                    height: '120px', // Giữ nguyên chiều cao của header như bạn yêu cầu
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
                    defaultSelectedKeys={[items1]}
                    onClick={({ key }) => navigate(key)}
                    items={items1}
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                />
                <div>
                    <Input placeholder="Search" />
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
                        <Button type="link" icon={<UserOutlined />} style={{ fontSize: '16px' }} onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </Header>

            <Content>
                <Layout>
                    <div style={{ padding: '10px', marginLeft: '15%', marginRight: '15%' }}>
                        <Row gutter={16}>
                            {/* Cột chứa ảnh nhỏ với carousel dọc */}
                            <Col span={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
                                <Button
                                    icon={<UpOutlined />}
                                    onClick={handlePrev}
                                    disabled={startIndex === 0}
                                    style={{ backgroundColor: 'black', color: 'white', marginBottom: '-15px' }}
                                />
                                {product.imgGallery.slice(startIndex, startIndex + visibleImages).map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`gallery-${index}`}
                                        style={{
                                            maxWidth: '80%',
                                            maxHeight: '80%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: mainImage === img ? '2px solid #1890ff' : '1px solid #ddd',
                                        }}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                                <Button
                                    icon={<DownOutlined />}
                                    onClick={handleNext}
                                    disabled={startIndex + visibleImages >= galleryLength}
                                    style={{ backgroundColor: 'black', color: 'white', marginTop: '-15px' }}
                                />
                            </Col>

                            {/* Cột chứa ảnh lớn ở giữa */}
                            <Col span={10}>
                                <div style={{ width: '100%' }}>
                                    <img alt={product.title} src={mainImage} style={{ width: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                                </div>
                            </Col>

                            {/* Cột chứa thông tin sản phẩm */}
                            <Col span={10} style={{ paddingLeft: '20px', textAlign: 'left', lineHeight: '2', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', }}>
                                {/* Mô tả sản phẩm nằm ở đầu */}
                                <div style={{ flexGrow: 1 }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{product.title}</h2>
                                    <p style={{ fontSize: '18px', marginBottom: '5px' }}><strong>Mã sản phẩm:</strong> {product.maSp}</p>
                                    <p style={{ fontSize: '18px', marginBottom: '5px', color: 'red', fontWeight: 'bold' }}><strong>Giá:</strong> {product.description}</p>
                                    <p style={{ fontSize: '18px', marginBottom: '5px' }}><strong>Chất liệu:</strong> {product.material}</p>

                                    <p style={{ fontSize: '18px', marginBottom: '5px' }}><strong>Màu sắc:</strong></p>
                                    <div>
                                        {product.color.map((clr, index) => (
                                            <Button
                                                key={index}
                                                shape="circle"
                                                style={{
                                                    backgroundColor: clr,
                                                    marginRight: '10px',
                                                    border: selectedColor === clr ? '2px solid black' : '1px solid #ddd',
                                                    position: 'relative'
                                                }}
                                                onClick={() => handleSelectColor(clr)}
                                            >
                                                {selectedColor === clr && <CheckOutlined style={{ position: 'absolute', bottom: '-2px', right: '-2px', color: 'white' }} />}
                                            </Button>
                                        ))}
                                    </div>

                                    <p style={{ fontSize: '18px', marginBottom: '5px' }}><strong>Size:</strong></p>
                                    <div>
                                        {product.size.map((sz, index) => (
                                            <Button
                                                key={index}
                                                shape="round"
                                                style={{
                                                    marginRight: '10px',
                                                    border: selectedSize === sz ? '2px solid black' : '1px solid #ddd',
                                                    position: 'relative',
                                                    width: '50px', // Điều chỉnh chiều rộng cho các button size
                                                    textAlign: 'center',
                                                }}
                                                onClick={() => handleSelectSize(sz)}
                                            >
                                                {sz}
                                                {selectedSize === sz && <CheckOutlined style={{ position: 'absolute', bottom: '-2px', right: '-2px', color: 'black' }} />}
                                            </Button>
                                        ))}
                                    </div>
                                    {/* Nút Thêm vào giỏ hàng và Mua ngay */}
                                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <Button
                                            type="primary"
                                            style={{
                                                backgroundColor: 'black',
                                                border: 'none',
                                                width: '70%', // Cập nhật chiều dài button
                                                height: '40px',
                                                fontSize: '16px'
                                            }}
                                            onClick={handleAddToCart}
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                        <Button
                                            style={{
                                                backgroundColor: 'white',
                                                color: 'black',
                                                border: '1px solid black',
                                                width: '70%', // Cập nhật chiều dài button
                                                height: '40px',
                                                fontSize: '16px'
                                            }}
                                            onClick={handleBuyNow}
                                        >
                                            Mua ngay
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <hr></hr>
                        <h1 style={{ marginTop: '3%', textAlign: 'center', marginBottom: '2%' }}>XEM THÊM CÁC SẢN PHẨM TƯƠNG TỰ</h1>
                        {/* Phần Xem Thêm các sản phẩm tương tự */}
                        <Carousel slidesToShow={4} dots={false} style={{ margin: '0 2%', marginBottom: '10%' }}>
                            {products.map(product => (
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
                    </div>
                </Layout>
            </Content>

            {/* Hiển thị form khi nhấn "Mua ngay" */}
            {showForm && (
                <div className="overlay" onClick={handleCloseForm}>
                    <div className="buy-now-form">
                        <h2>Thông tin mua hàng</h2>
                        <div className="buy-now-product-info">
                            <img src={product.imgSrc} alt={product.title} className="buy-now-image" />
                            <div className="buy-now-details">
                                <p>Sản phẩm: {product.title}</p>
                                <p className="price">Giá: {product.description}</p>
                                <p>Màu sắc: {selectedColor}</p>
                                <p>Size: {selectedSize}</p>
                            </div>
                        </div>
                        <form>
                            <label>
                                Tên khách hàng:
                                <input type="text" name="name" required />
                            </label>
                            <label>
                                Địa chỉ giao hàng:
                                <input type="text" name="address" required />
                            </label>
                            <label>
                                Số điện thoại:
                                <input type="text" name="phone" required />
                            </label>
                            <button type="submit">Xác nhận mua</button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProductDetail;
