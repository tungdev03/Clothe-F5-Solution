import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Dropdown, Space, Input, Breadcrumb, Carousel, Card, message,Slider } from 'antd';
import logo_v1 from '../../../assets/images/Logo.png';
import './Home.css';
import './Product.css';
import { AppstoreOutlined } from '@ant-design/icons';
import HomeView from '../../../Service/HomeService';
const { Header, Content, Sider } = Layout;
const { Meta } = Card;

const items1 = [
    { key: '/', label: 'Cửa hàng' },
    { key: '/Products', label: 'Sản phẩm' },
    { key: '/contact', label: 'Liên hệ' },
    { key: '/album', label: 'Bộ sưu tập' }
];


const ProductPage = () => {
    const navigate = useNavigate();
    const [TaiKhoan, setUsername] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại// Số sản phẩm hiển thị mỗi trang
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]); // Thêm state cho sản phẩm
    // Tạo state cho từ khóa tìm kiếm và sản phẩm đã lọc
    const [searchTerm, setSearchTerm] = useState("");
    const productsPerPage = 8;
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedSize, setSelectedSize] = useState("all");
    const [selectedColor, setSelectedColor] = useState("all");
    const [selectedPrice, setSelectedPrice] = useState([0, 1000000]);


    useEffect(() => {
        const fetchNewProducts = async () => {
            setLoading(true);
            try {
                const data = await HomeView.ViewProductHome();
                setProducts(data); // Cập nhật danh sách sản phẩm mới từ API
                console.log(data)
            } catch (error) {
                message.error(error || "Không thể tải danh sách sản phẩm.");
            } finally {
                setLoading(true);
            }

        };
        fetchNewProducts();
    }, []);
    useEffect(() => {
    const filtered = products.filter((product) => {
        const matchesSearch = product.tenSp.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesColor =
            selectedColor === 'all' ||
            product.sanPhamChiTiets.some((detail) => detail.mauSac.tenMauSac === selectedColor);
        const matchesSize =
            selectedSize === 'all' ||
            product.sanPhamChiTiets.some((detail) => detail.size.tenSize === selectedSize);
            
        
        // Add the price range filter
        const matchesPrice = product.giaBan >= selectedPrice[0] && product.giaBan <= selectedPrice[1]; // Kiểm tra giá sản phẩm

      

        return matchesSearch && matchesColor && matchesSize && matchesPrice;
    });

    setFilteredProducts(filtered);
}, [searchTerm, selectedColor, selectedSize, selectedPrice, products]);



    useEffect(() => {
        // Check user info from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.TaiKhoan);
        }
    }, []);
    const extractFilters = (products) => {
        const colors = new Set();
        const sizes = new Set();
    
        products.forEach((product) => {
            product.sanPhamChiTiets.forEach((detail) => {
                colors.add(detail.mauSac.tenMauSac);
                sizes.add(detail.size.tenSize);
            });
        });
    
        return {
            colors: Array.from(colors), // Chuyển Set thành Array
            sizes: Array.from(sizes),
        };
    };
    
    // Gọi hàm này trong useEffect để khởi tạo giá trị cho bộ lọc
    const { colors, sizes } = extractFilters(products);
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);
    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleNextPage = () => {
        if (currentPage < Math.ceil(products.length / productsPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    const handleLogoutClick = () => {
        localStorage.removeItem('user');
        setUsername(null);
        navigate('/'); // Redirect to homepage after logout
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
        navigate(key); // Navigate to the corresponding route
    };
    const handlePriceChange = (value) => {
        setSelectedPrice(value);
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
                            <label htmlFor="color">Color:</label>
                            <select
                                id="color"
                                name="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                            >
                                <option value="all">All Colors</option>
                                {colors.map((color) => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-item">
                            <label htmlFor="size">Size:</label>
                            <select
                                id="size"
                                name="size"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
                                <option value="all">All Sizes</option>
                                {sizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* New Price Range Filters */}
                        <div className="filter-item">
                        <label htmlFor="price">Price:</label>
                        <Slider
                            range
                            min={0}
                            max={1000000}
                            step={10000}
                            defaultValue={selectedPrice}
                            onChange={handlePriceChange}
                            value={selectedPrice}
                            tipFormatter={value => `${value.toLocaleString()} VNĐ`}
                            style={{ width: '200px' }}
                        />
                    </div>
                    </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            gap: '16px',
                        }}
                    >
                    {filteredProducts.slice(startIndex, endIndex).map((product) => (
                        <div
                            key={product.id}
                            style={{
                                flex: '0 0 calc(25% - 16px)',
                                boxSizing: 'border-box',
                            }}
                            className="product-card"
                        >
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={product.tenSp}
                                        src={product.imageDefaul}
                                        style={{
                                            width: '100%',
                                            height: "100%",
                                            objectFit: 'cover',
                                        }}
                                    />
                                }
                            >
                                <Meta
                                    title={product.tenSp}
                                    description={`${product.giaBan.toLocaleString()} VNĐ`}
                                />
                            </Card>
                            <div className="overlay">
                                <button
                                    className="view-more-button"
                                    onClick={() => handleViewMore(product.id)}
                                >
                                    Xem thêm
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button
                            disabled={currentPage === 1}
                            onClick={handlePreviousPage}
                            style={{ marginRight: '10px' }}
                        >
                            Trang trước
                        </Button>
                        <span>
                            Trang {currentPage} / {Math.ceil(products.length / productsPerPage)}
                        </span>
                        <Button
                            disabled={currentPage === Math.ceil(products.length / productsPerPage)}
                            onClick={handleNextPage}
                            style={{ marginLeft: '10px' }}
                        >
                            Trang sau
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProductPage;
