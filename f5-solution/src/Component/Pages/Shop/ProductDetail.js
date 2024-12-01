import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Layout, Menu, Dropdown, Input, Space, Card, Carousel, message } from 'antd';
import {
    UpOutlined,
    DownOutlined,
    LogoutOutlined,
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
    const [TaiKhoan, setUsername] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [CartId, setCartId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [sLuong, setSPCt] = useState(null);
    const visibleImages = 3;
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.TaiKhoan);
            setUserId(user.IdKhachhang);
            handCart(user.IdKhachhang);
            console.log(user.IdKhachhang);
        }
        
    }, []);
    
    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const data = await HomeView.ViewProductHome();
                setProducts(data);
            } catch (error) {
                message.error(error || "Không thể tải danh sách sản phẩm.");
            }
        };
        fetchNewProducts();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!id) {
                return;
            }

            setLoading(true);

            try {
                const data = await HomeView.ViewProductDetail(id);
                if (data) {
                    setProduct(data);
                    console.log(data)
                    setMainImage(data.imageDefaul || '');
                } else {
                    setProduct(null);
                    message.error('Lỗi: Không có dữ liệu sản phẩm.');
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                setProduct(null);
                message.error('Lỗi khi lấy chi tiết sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);
    const handleLoginClick = () => {
        navigate('/login');
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
    const handleLogoutClick = () => {
        // Xử lý đăng xuất
        localStorage.removeItem('user');
        setUsername(null); // Reset lại state username
        navigate('/'); // Điều hướng tới trang chủ sau khi đăng xuất
    };
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log(user)
            setUsername(user.TaiKhoan);
        }
    }, []);
    useEffect(() => {
        if (selectedColor && product && Array.isArray(product.size) && Array.isArray(product.mauSac)) {
            const sanPhamChiTietIds = product.mauSac
                .filter(color => color.mauSacId === selectedColor)
                .map(color => color.sanPhamChiTietId);

            const filteredSizes = product.size.filter(size =>
                sanPhamChiTietIds.includes(size.sanPhamChiTietId)
            );

            setAvailableSizes(filteredSizes);
            setSelectedSize('');
            setSelectedProductId('');
        } else {
            setAvailableSizes(product?.size || []);
        }
    }, [selectedColor, product]);

    const handleSelectColor = (mauSacId) => {
        if (mauSacId === selectedColor) {
            setSelectedColor('');
        } else {
            setSelectedColor(mauSacId);
            console.log(mauSacId);
        }
    };

    const handleSelectSize = (sizeId) => {
        setSelectedSize(sizeId);
        const selectedProductDetail = product.size.find(size => size.sizeId === sizeId);
        if (selectedProductDetail) {
            setSelectedProductId(selectedProductDetail.sanPhamChiTietId);
            setSPCt(selectedProductDetail.soLuongTon)
            console.log(selectedProductDetail);
        }
    };
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
    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            message.warning("Vui lòng chọn màu sắc và size trước khi mua.");
            return;
        }
        if(quantity>sLuong)
            {
                message.warning("Số lượng trong kho không đủ.");
                return;
            }
        const addDto = {
            idGh: CartId,
            idSpCt: selectedProductId,
            soLuong: quantity,
        };
    
        try {
            console.log("Payload gửi lên API:", addDto);
            const result = await GioHangService.addGioHang(addDto); // Thêm `await` để xử lý bất đồng bộ
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
            console.log("Kết quả trả về từ API:", result);
        } catch (error) {
            console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);
    
            if (error.response) {
                console.error("Chi tiết lỗi từ API:", error.response.data);
                console.error("Status code:", error.response.status);
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
            } else {
                console.error("Lỗi khi gửi yêu cầu:", error.message);
            }
    
            alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
    };
    
    const handleBuyNow = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        if (!selectedColor || !selectedSize) {
            message.warning("Vui lòng chọn màu sắc và size trước khi mua.");
            return;
        }
        if(quantity>sLuong)
        {
            message.warning("Số lượng trong kho không đủ.");
            return;
        }
    
        const addDto = {
            idGh: CartId,
            idSpCt: selectedProductId,
            soLuong: quantity,
        };
    
        try {
            console.log("Payload gửi lên API:", addDto);
            const result = await GioHangService.addGioHang(addDto); // Thêm vào giỏ hàng
            console.log("Kết quả trả về từ API:", result);
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
            // Chuyển hướng đến trang giỏ hàng
            navigate(`/cart/${storedUser.TaiKhoan}`);
        } catch (error) {
            console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);
    
            if (error.response) {
                console.error("Chi tiết lỗi từ API:", error.response.data);
                console.error("Status code:", error.response.status);
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
            } else {
                console.error("Lỗi khi gửi yêu cầu:", error.message);
            }
    
            alert("Đã xảy ra lỗi khi mua sản phẩm.");
        }
    };
    

    const handleViewMore = (id) => {
        navigate(`/Products/${id}`);
    };

    // Lọc ra danh sách các màu sắc không trùng lặp
    const uniqueColorsMap = new Map();
    if (product && Array.isArray(product.mauSac)) {
        product.mauSac.forEach(mauSac => {
            if (!uniqueColorsMap.has(mauSac.mauSacId)) {
                uniqueColorsMap.set(mauSac.mauSacId, mauSac);
            }
        });
    }
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
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const uniqueColors = Array.from(uniqueColorsMap.values());

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

    if (loading) {
        return <div>Loading...</div>;
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
                    defaultSelectedKeys={['/']}
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

            <Content>
                <Layout>
                    <div style={{ padding: '10px', marginLeft: '15%', marginRight: '15%' }}>
                        <Row gutter={16}>
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

                            <Col span={10}>
                                <img src={mainImage} alt={product?.tenSp || ''} style={{ width: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                            </Col>
                            <Col span={10}>
                                <h2 style={{ margin: "15px", fontWeight: 500 }}>{product?.tenSp || 'Tên sản phẩm'}</h2>
                                <p style={{ margin: "15px", fontWeight: 500 }}>Mã sản phẩm: {product?.maSp || ''}</p>
                                <p style={{ margin: "0px 0px 0px 15px", fontWeight: 500, fontSize: "25px" }}>Giá bán: <span style={{ color: "red" }}>{product?.giaBan.toLocaleString() || 0}</span> VND</p>
                                <p style={{ margin: "15px", fontWeight: 500 }}>Chất liệu: {product?.chatLieu?.tenChatLieu || 'Không rõ'}</p>
                                <div className="product-detail">
                                    {product && (
                                        <>
                                            <p>Màu sắc:</p>
                                            <div className="color-options">
                                                {uniqueColors.map((mauSac) => (
                                                    <Button
                                                        key={mauSac.mauSacId}
                                                        className={`color-button ${selectedColor === mauSac.mauSacId ? 'selected' : ''}`}
                                                        style={{ backgroundColor: mauSac.mauSacTen }}
                                                        onClick={() => handleSelectColor(mauSac.mauSacId)}
                                                    >
                                                        {selectedColor === mauSac.mauSacId && <CheckOutlined />}
                                                    </Button>
                                                ))}
                                            </div>
                                            <div className="size-options" style={{ marginTop: '20px' }}>
                                                <p>Size:</p>
                                                {availableSizes.map(size => (
                                                    <Button
                                                        key={size.sizeId}
                                                        style={{
                                                            marginRight: '10px',
                                                            border: selectedSize === size.sizeId ? '2px solid black' : '1px solid #ddd',
                                                        }}
                                                        onClick={() => handleSelectSize(size.sizeId)}
                                                    >
                                                        {size.sizeTen}
                                                    </Button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <p style={{ margin: '15px', fontWeight: 500 }}>Số lượng:</p>
                                <div style={{ margin: '15px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                    <Button onClick={decreaseQuantity} disabled={quantity <= 1}>
                                        <MinusOutlined />
                                    </Button>
                                    <span style={{ padding: '0 15px', fontWeight: 500 }}>{quantity}</span>
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
                                        width: '100%',
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
                        <Carousel slidesToShow={4} dots={false} style={{ margin: '0 2%', marginBottom: '10%' }}>
                            {products.map((product) => (
                                <div key={product.id} style={{ padding: '0 10px' }} className="product-card">
                                    <Card
                                        hoverable
                                        cover={<img alt={product.tenSp} src={product.imageDefaul} style={{ width: '100%', objectFit: 'contain', height: 'auto' }} />}
                                    >
                                        <Meta title={product.tenSp} description={`${product.giaBan.toLocaleString()} VNĐ`} />
                                    </Card>
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