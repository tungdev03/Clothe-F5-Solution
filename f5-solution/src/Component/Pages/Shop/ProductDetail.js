import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Layout, Menu, Dropdown, Input, Space, Card, Carousel, message } from 'antd';
import {
    UpOutlined,
    DownOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    CheckOutlined,
    PlusOutlined,
    MinusOutlined,
} from '@ant-design/icons';
import './Home.css';
import logo_v1 from '../../../assets/images/Logo.png';
import { Content } from 'antd/es/layout/layout';
import HomeView from '../../../Service/HomeService';
const { Header } = Layout;
const { Meta } = Card;

const items1 = [
    { key: '/', label: 'Cửa hàng' },
    { key: '/Products', label: 'Sản phẩm' },
    { key: '/contact', label: 'Liên hệ' },
    { key: '/album', label: 'Bộ sưu tập' },
];

const ProductDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [username, setUsername] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Loader state

    console.log('ID:', id);
    console.log('Product:', product);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const data = await HomeView.ViewProductHome();
                setProducts(data); // Cập nhật danh sách sản phẩm mới từ API
            } catch (error) {
                message.error(error || "Không thể tải danh sách sản phẩm.");
            }
        };
        fetchNewProducts();
    }, []);

    // State cho form mua hàng
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const visibleImages = 3;
    const [availableSizes, setAvailableSizes] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!id) {
                return;
            }

            setLoading(true); // Bắt đầu loading

            try {
                const data = await HomeView.ViewProductDetail(id); // Gọi API với id
                if (data) {
                    setProduct(data);
                    setMainImage(data.imageDefaul || ''); // Ảnh mặc định
                } else {
                    setProduct(null);
                    message.error('Lỗi: Không có dữ liệu sản phẩm.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                setProduct(null);
                message.error('Lỗi khi lấy chi tiết sản phẩm.');
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };
        fetchProductDetails();
    }, [id]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
        }
    }, []);

    // Cập nhật danh sách sizes có sẵn khi chọn màu sắc
    useEffect(() => {
        if (selectedColor && product) {
            const filteredSizes = product.sanPhamChiTiets
                .find((detail) => detail.mauSacId === selectedColor)
                .map((detail) => ({
                    sizeId: detail.sizeId,
                    sizeTen: detail.sizeTen,
                }));

            setAvailableSizes(filteredSizes); // Cập nhật danh sách kích thước khả dụng
            console.log(filteredSizes)
            setSelectedSize(''); // Reset size khi đổi màu
        }
    }, [selectedColor, product]);

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            alert('Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng.');
            return;
        }
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ ...product, selectedColor, selectedSize, quantity });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    const handleBuyNow = () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn màu sắc và size trước khi mua.");
            return;
        }
    };

    const handleViewMore = (id) => {
        navigate(`/Products/${id}`);
    };

    // const handleSelectColor = (color) => setSelectedColor(color.mauSacId);
    const handleSelectColor = (mauSacId) => {
        setSelectedColor(mauSacId);
    
        // Kiểm tra và tìm thông tin màu sắc
        const selectedColorInfo = product?.mauSac?.find((mauSac) => mauSac.mauSacId === mauSacId);
    
        if (!selectedColorInfo) {
            console.warn("Không tìm thấy màu sắc tương ứng.");
            return;
        }
    
        console.log("Màu sắc đã chọn:", selectedColorInfo.mauSacTen);
    };
    const handleSelectSize = (size) => setSelectedSize(size.sizeId);
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const userMenu = (
        <Menu>
            <Menu.Item key="1" onClick={() => navigate('/profile')}>
                Thông tin cá nhân
            </Menu.Item>
            <Menu.Item
                key="2"
                danger
                onClick={() => {
                    localStorage.removeItem('user');
                    setUsername(null);
                    navigate('/');
                }}
            >
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    if (loading) {
        return <div>Loading...</div>; // Hiển thị loading khi đang fetch data
    }

    return (
        <Layout>
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
                        <h2>
                            <span style={{ color: 'orange' }}>F5</span> Fashion
                        </h2>
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
                    <Button type="link" icon={<ShoppingCartOutlined />} style={{ fontSize: '16px' }}>
                        Giỏ hàng
                    </Button>
                    {username ? (
                        <Dropdown overlay={userMenu} placement="bottomRight">
                            <Button type="link">
                                <Space>
                                    <span style={{ fontSize: '16px' }}>Xin chào, {username}</span>
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button
                            type="link"
                            icon={<UserOutlined />}
                            style={{ fontSize: '16px' }}
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </Button>
                    )}
                </div>
            </Header>

            <Content>
                <Layout>
                    <div style={{ padding: '10px', marginLeft: '15%', marginRight: '15%' }}>
                        <Row gutter={16}>
                            {/* Hình ảnh bên trái */}
                            <Col span={4} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
                                {product?.images?.slice(startIndex, startIndex + visibleImages).map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.tenImage}
                                        alt={product.tenSp}
                                        style={{
                                            maxWidth: '87%',
                                            maxHeight: '87%',
                                            cursor: 'pointer',
                                            border: mainImage === img.tenImage ? '2px solid #1890ff' : '1px solid #ddd',
                                        }}
                                        onClick={() => setMainImage(img.tenImage)}
                                    />
                                ))}
                            </Col>

                            {/* Hình ảnh chính */}
                            <Col span={10}>
                                <img src={mainImage} alt={product?.tenSp || ''} style={{ width: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                            </Col>
                            {/* Chi tiết sản phẩm */}
                            <Col span={10}>
                                <h2 style={{ margin: "15px", fontWeight: 500 }}>{product?.tenSp || 'Tên sản phẩm'}</h2>
                                <p style={{ margin: "15px", fontWeight: 500 }}>Mã sản phẩm: {product?.maSp || ''}</p>
                                <p style={{ margin: "0px 0px 0px 15px", fontWeight: 500, fontSize: "25px" }}>Giá bán: <span style={{ color: "red" }}>{product?.giaBan.toLocaleString() || 0}</span> VND</p>
                                <p style={{ margin: "15px", fontWeight: 500 }}>Chất liệu: {product?.chatLieu?.tenChatLieu || 'Không rõ'}</p>
                                <div style={{ margin: "60px 0px 0px 15px", fontWeight: 500 }}>
                                    <p>Màu sắc:</p>
                                    {product?.mauSac?.map((mauSac) => (
                                        <Button
                                            key={mauSac.id}
                                            shape="circle"
                                            style={{
                                                backgroundColor: mauSac.mauSacTen,
                                                border: selectedColor === mauSac.mauSacId ? '2px solid black' : '1px solid #ddd',
                                            }}
                                            onClick={() => handleSelectColor(mauSac.mauSacId)}
                                        >
                                            {selectedColor === mauSac.mauSacId && <CheckOutlined />}
                                        </Button>
                                    ))}
                                </div>

                                <div style={{ margin: "15px", fontWeight: 500 }}>
                                    <p>Size:</p>
                                    {product.size.map((size) => (
                                        <Button
                                            key={size.sizeId}
                                            style={{
                                                marginRight: '10px',
                                                border: selectedSize === size.sizeId ? '2px solid black' : '1px solid #ddd',
                                            }}
                                            onClick={() => setSelectedSize(size.sizeId)}
                                        >
                                            {size.sizeTen}
                                        </Button>
                                    ))}
                                </div>
                                <p style={{ margin: "15px", fontWeight: 500 }}>Số lượng:</p>
                                <div style={{ margin: "15px", fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                    <Button onClick={decreaseQuantity} disabled={quantity <= 1}>
                                        <MinusOutlined />
                                    </Button>
                                    <span style={{ padding: "15px", fontWeight: 500 }}>{quantity}</span>
                                    <Button onClick={increaseQuantity}>
                                        <PlusOutlined />
                                    </Button>
                                </div>

                                <Button type="primary" onClick={handleAddToCart}>
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        border: '1px solid black',
                                        width: '100%', // Cập nhật chiều dài button
                                        height: '40px',
                                        fontSize: '16px'
                                    }}
                                    onClick={handleBuyNow}
                                >
                                    Mua ngay
                                </Button>
                            </Col>
                        </Row>
                        <h1 style={{ marginTop: '3%', textAlign: 'center', marginBottom: '2%' }}>XEM THÊM CÁC SẢN PHẨM TƯƠNG TỰ</h1>
                        {/* Phần Xem Thêm các sản phẩm tương tự */}
                        <Carousel slidesToShow={4} dots={false} style={{ margin: '0 2%', marginBottom: '10%' }}>
                            {products.map(product => (
                                <div key={product.id} style={{ padding: '0 10px' }} className="product-card">
                                    <Card
                                        hoverable
                                        cover={<img alt={product.tenSp} src={product.imageDefaul} style={{ width: '100%', objectFit: 'contain', height: 'auto' }} />}
                                    >
                                        <Meta title={product.tenSp} description={`${product.giaBan.toLocaleString()} VNĐ`} />
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
        </Layout>
    );
};

export default ProductDetail;