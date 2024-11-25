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
import GioHangService from '../../../Service/GioHangService';
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
    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const data = await HomeView.ViewProductHome();
                setProducts(data); // Cập nhật danh sách sản phẩm mới từ API
                console.log(data)
            } catch (error) {
                message.error(error || "Không thể tải danh sách sản phẩm.");
            } finally {
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
    const [CartId, setCartId] = useState(null);
    const visibleImages = 3;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const data = await HomeView.ViewProductDetail(id); // Gọi API với id
                setProduct(data);
                console.log(data);
                setMainImage(data.imageDefaul || ''); // Ảnh mặc định
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                setProduct(null);
            }
        };
        fetchProductDetails();
    }, [id]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
            handCart(user.IdKhachhang);
        }
    }, []);


    const handCart = async (userId) => {
        try {
            const data = await GioHangService.getByGioHang(userId);
            console.log(data.id);
            setCartId(data.id);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
            message.error("Không thể tải giỏ hàng");
        }
    };
    const findProductDetailId = (color, size) => {
        if (!product || !product.sanPhamChiTiets) return null;
        const detail = product.sanPhamChiTiets.find(
          (item) => item.mauSac === color && item.size === size
        );
        return detail ? detail.id : null;
      };
    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            console.error("Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng.");
          return;
        }
      
        // Tìm IdSpCt dựa trên màu sắc và kích thước
        const idSpCt = findProductDetailId(selectedColor, selectedSize);
        if (!idSpCt) {
          alert("Không tìm thấy sản phẩm chi tiết phù hợp.");
          return;
        }
      
        // Dữ liệu gửi đến API
        const addDto = {
          idGh:CartId,
          idSpCt: idSpCt,
          soLuong: quantity, // Số lượng người dùng đã chọn
        };
      
        try {
          // Gọi API để thêm vào giỏ hàng
          console.log("Kết quả:", addDto);
          const result = await GioHangService.addGioHang(addDto);
          alert("Sản phẩm đã được thêm vào giỏ hàng!");
          console.log("Kết quả:", result);
        } catch (error) {
          console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);
          alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
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
    const handleSelectColor = (color) => setSelectedColor(color);
    const handleSelectSize = (size) => setSelectedSize(size);
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
                                <h2>{product?.tenSp || 'Tên sản phẩm'}</h2>
                                <p>Mã sản phẩm: {product?.maSp || ''}</p>
                                <p>Giá bán: {product?.giaBan || 0} VND</p>
                                <p>Chất liệu: {product?.chatLieu?.tenChatLieu || 'Không rõ'}</p>
                                <div>
                                    <p>Màu sắc:</p>
                                    {product?.mauSac?.map((color) => (
                                        <Button
                                            key={color.id}
                                            shape="circle"
                                            style={{
                                                backgroundColor: color.tenMauSac,
                                                border: selectedColor === color.tenMauSac ? '2px solid black' : '1px solid #ddd',
                                            }}
                                            onClick={() => handleSelectColor(color.tenMauSac)}
                                        >
                                            {selectedColor === color.tenMauSac && <CheckOutlined />}
                                        </Button>
                                    ))}
                                </div>

                                <div>
                                    <p>Size:</p>
                                    {product?.size?.map((size) => (
                                        <Button
                                            key={size.id}
                                            style={{
                                                marginRight: '10px',
                                                border: selectedSize === size.tenSize ? '2px solid black' : '1px solid #ddd',
                                            }}
                                            onClick={() => handleSelectSize(size.tenSize)}
                                        >
                                            {size.tenSize}
                                        </Button>
                                    ))}
                                </div>

                                <p>Số lượng:</p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button onClick={decreaseQuantity} disabled={quantity <= 1}>
                                        <MinusOutlined />
                                    </Button>
                                    <span style={{ margin: '0 20px' }}>{quantity}</span>
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
