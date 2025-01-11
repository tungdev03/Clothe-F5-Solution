import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Layout, Menu, Dropdown, Input, Space, Card, Carousel, message,notification } from 'antd';
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
import GioHangService from '../../../Service/GiohangService';
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
    const [errorMessage, setErrorMessage] = useState("");
    const [CartId, setCartId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [filteredSizes, setfilteredSizes] = useState('');
    const [soLuong, setSoluong] = useState(0);
   
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
                console.log(data)
                if (data) {
                    const convertData = {
                        ...data,
                      
                    }
                    setProduct(convertData);
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
        localStorage.removeItem('user');
        setUsername(null);
        navigate('/');
    };
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log(user)
            setUsername(user.TaiKhoan);
        }
    }, []);
    const [filteredProducts, setFilteredProducts] = useState([]);
    useEffect(() => {
        if (product && Array.isArray(product.size) && Array.isArray(product.mauSac)) {
            // Nếu chưa chọn màu, bạn cần kết hợp tất cả các size mà không bị trùng lặp
            if (!selectedColor) {
                // Dùng Set để loại bỏ các size trùng lặp
                const uniqueSizes = Array.from(new Set(product.size.map(size => size.sizeId)))
                    .map(sizeId => product.size.find(size => size.sizeId === sizeId));
                setAvailableSizes(uniqueSizes);
            } else {
                // Nếu đã chọn màu, lọc các size theo màu
                const sanPhamChiTietIds = product.mauSac
                    .filter(color => color.mauSacId === selectedColor)
                    .map(color => color.sanPhamChiTietId);

                // Lọc size dựa trên các sanPhamChiTietId đã lọc được
                const filteredSizes = product.size.filter(size =>
                    sanPhamChiTietIds.includes(size.sanPhamChiTietId)
                );

                // Loại bỏ các size trùng lặp
                const uniqueSizes = Array.from(new Set(filteredSizes.map(size => size.sizeId)))
                    .map(sizeId => filteredSizes.find(size => size.sizeId === sizeId));

                setAvailableSizes(uniqueSizes);
            }
        }
    }, [selectedColor, product]);

    // Hàm xử lý khi người dùng chọn màu
    const handleSelectColor = (mauSac) => {
        const mauSacId = mauSac.mauSacId;
       

        if (mauSacId === selectedColor) {
            // Hủy chọn màu nếu đã chọn màu này
            setSelectedColor('');
            setFilteredProducts([]); // Xóa sản phẩm đã lọc
            setAvailableSizes([]); // Xóa size đã lọc
        } else {
            // Lưu màu đã chọn
            setSelectedColor(mauSacId);
            

            // Lọc sản phẩm theo màu sắc đã chọn
            const filteredProductsByColor = product.mauSac.filter(color => color.mauSacId === mauSacId);
            setFilteredProducts(filteredProductsByColor);

            // Lọc các size tương ứng với sanPhamChiTietId đã lọc
            const sanPhamChiTietIds = filteredProductsByColor.map(item => item.sanPhamChiTietId);
            const filteredSizes = product.size.filter(size =>
                sanPhamChiTietIds.includes(size.sanPhamChiTietId)
            );
            setfilteredSizes(filteredSizes);
            // Loại bỏ các size trùng lặp
            const uniqueSizes = Array.from(new Set(filteredSizes.map(size => size.sizeId)))
                .map(sizeId => filteredSizes.find(size => size.sizeId === sizeId));

            // Cập nhật lại danh sách size có sẵn
            setAvailableSizes(uniqueSizes);
        }
    };

    // Hàm xử lý khi người dùng chọn size
    const handleSelectSize = (sizeId) => {
        // Cập nhật size được chọn
        setSelectedSize(sizeId);
        console.log('Filtered sizes:', filteredSizes);
        console.log('Selected size ID:', sizeId);
    
        // Kiểm tra điều kiện trước khi lọc
        if (selectedColor && Array.isArray(filteredSizes)) {
            const filteredProductsWithSize = filteredSizes.filter(product =>
                product.sizeId === sizeId
            );
    
            if (filteredProductsWithSize.length > 0) {
                // Lấy ID sản phẩm đầu tiên từ kết quả lọc
                setSelectedProductId(filteredProductsWithSize[0].sanPhamChiTietId);
                setSoluong(filteredProductsWithSize[0].soLuongTon);
                console.log('Updated selected product ID:', filteredProductsWithSize[0].sanPhamChiTietId);
            } else {
                notification.warning({ message: "Vui lòng chọn màu sắc và size"})
           
            }
        } else {
            console.warn('Color not selected or filteredSizes is not valid.');
        }
    };
    
    const handCart = async (userId) => {
        try {
            const data = await GioHangService.getByGioHang(userId);
            setCartId(data.id);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
            message.error("Không thể tải giỏ hàng");
        }
       
    };
    const handleAddToCart = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            notification.warning({ message: "Vui lòng đăng nhập trước khi mua hàng!" });
            navigate('/Login'); // Điều hướng đến trang đăng nhập
            return;
        }
        if (!selectedColor || !selectedSize) {
            setErrorMessage("Vui lòng chọn màu sắc và size trước khi mua.");
            notification.warning({ message: "Vui lòng chọn màu sắc và size trước khi mua."});
            return;
        }
        if (quantity>soLuong) {
            setErrorMessage("Số lượng trong kho không đủ.");
            notification.warning({ message: "Số lượng trong kho không đủ."});
            return;
        }

        const addDto = {
            idGh: CartId,
            idSpCt: selectedProductId,
            soLuong: quantity,
        };
    
        try {
            console.log("Payload gửi lên API:", addDto);
            if (addDto.idGh == null) {
                notification.warning({ message: "Vui lòng đăng nhập trước khi mua hàng!" });
                navigate('/Login');
                return;
            }
            const result = await GioHangService.addGioHang(addDto); // Call the backend API
    
            notification.success({ message: "Sản phẩm đã được thêm vào giỏ hàng"})
           
            console.log("Kết quả trả về từ API:", result);
            setErrorMessage(""); // Clear the error message if everything is fine
        } catch (error) {
            console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);
    
            // Handle specific errors from the backend API
            if (error.response) {
                console.error("Chi tiết lỗi từ API:", error.response.data);
                if (error.response.data && error.response.data.message) {
                    // Show error message from backend (e.g. stock error)
                    setErrorMessage(error.response.data.message);
                } else {
                    // Fallback to a generic error message
                    setErrorMessage("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
                }
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
                setErrorMessage("Không nhận được phản hồi từ server.");
            } else {
                console.error("Lỗi khi gửi yêu cầu:", error.message);
                setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu.");
            }
        }
    };
    
    const handleBuyNow = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
    
        // Kiểm tra nếu chưa đăng nhập
        if (!storedUser) {
            notification.warning({ message: "Vui lòng đăng nhập trước khi mua hàng!" });
            navigate('/Login'); // Điều hướng đến trang đăng nhập
            return;
        }
    
        // Kiểm tra nếu chưa chọn màu sắc và size
        if (!selectedColor || !selectedSize) {
            setErrorMessage("Vui lòng chọn màu sắc và size trước khi mua.");
            notification.warning({ message: "Vui lòng chọn màu sắc và size trước khi mua." });
            return;
        }
    
        // Kiểm tra số lượng vượt quá số lượng trong kho
        if (quantity > soLuong) {
            setErrorMessage("Số lượng trong kho không đủ.");
            notification.warning({ message: "Số lượng trong kho không đủ." });
            return;
        }
    
        // Tạo dữ liệu payload để gửi đến API
        const addDto = {
            idGh: CartId,
            idSpCt: selectedProductId,
            soLuong: quantity,
        };
    
        try {
            console.log("Payload gửi lên API:", addDto);
    
            // Kiểm tra nếu giỏ hàng (`idGh`) chưa được khởi tạo
            if (addDto.idGh == null) {
                notification.warning({ message: "Vui lòng đăng nhập trước khi mua hàng!" });
                navigate('/Login');
                return;
            }
    
            // Gọi API thêm vào giỏ hàng
            const result = await GioHangService.addGioHang(addDto);
    
            console.log("Kết quả trả về từ API:", result);
            notification.success({ message: "Sản phẩm đã được thêm vào giỏ hàng" });
    
            setErrorMessage(""); // Xóa thông báo lỗi nếu mọi thứ ổn
            navigate(`/cart/${storedUser.TaiKhoan}`); // Điều hướng về trang giỏ hàng
        } catch (error) {
            console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);
    
            // Xử lý các lỗi từ API
            if (error.response) {
                console.error("Chi tiết lỗi từ API:", error.response.data);
                if (error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message); // Hiển thị thông báo lỗi cụ thể từ server
                } else {
                    setErrorMessage("Đã xảy ra lỗi khi mua sản phẩm."); // Thông báo lỗi chung
                }
            } else if (error.request) {
                console.error("Không nhận được phản hồi từ server:", error.request);
                setErrorMessage("Không nhận được phản hồi từ server."); // Thông báo lỗi phản hồi server
            } else {
                console.error("Lỗi khi gửi yêu cầu:", error.message);
                setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu."); // Thông báo lỗi gửi yêu cầu
            }
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
    
    const uniqueSizesMap = new Map();
    if (product && Array.isArray(product.size)) {
        product.size.forEach(size => {
        
            // Nếu chưa có sizeId này trong map, thì thêm vào
            if (!uniqueSizesMap.has(size.sizeId)) {
                uniqueSizesMap.set(size.sizeId, size);
            }
        });
    }
    const handleOncartClick = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser.TaiKhoan) {
            message.info("Vui lòng đăng nhập để xem giỏ hàng");
            navigate('/Login');
        } else {
            navigate(`/cart/${storedUser.TaiKhoan}`);
        }
    }
    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const uniqueColors = Array.from(uniqueColorsMap.values());
    const uniqueSizes = Array.from(uniqueSizesMap.values());
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
                                            {uniqueColors.map((mauSac, index) => (
                                                <Button
                                                    key={mauSac.mauSacId}
                                                    className={`color-button ${selectedColor === mauSac.mauSacId ? 'selected' : ''}`}
                                                    style={{ backgroundColor: mauSac.mauSacTen }}
                                                    onClick={() => handleSelectColor(mauSac)}
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
                            
                                <p style={{ margin: '15px', fontWeight: 500 }}>Số lượng trong kho: {soLuong}</p>
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