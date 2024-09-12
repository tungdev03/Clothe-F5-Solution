import React, { useState, useEffect } from 'react';
import { UserOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Carousel, Card, Dropdown, Space, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo_v1 from '../../../assets/images/Logo.png';

const { Header, Content } = Layout;
const { Meta } = Card;



const cardStyle = {
  width: '100%', // Chiều rộng cố định của mỗi Card
  height: '250px', // Chiều cao cố định của mỗi Card
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const imgStyle = {
  width: '100%',
  height: '200px', // Chiều cao cố định cho ảnh
  objectFit: 'cover', // Giúp hình ảnh giữ tỷ lệ mà không bị méo
};

const metaStyle = {
  margin: '0',  // Giảm khoảng cách giữa tiêu đề và mô tả
  padding: '0', // Loại bỏ padding không cần thiết
};
const items1 = [
  { key: '/home', label: 'Cửa hàng' },
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
const f5Blogs = [
  { id: 1, title: "F5 Blog 1", imgSrc: "https://file.hstatic.net/200000182297/article/342544079_185591394364106_3474506149512152400_n__1__7b5ebc8e82e84130a3effdf0c7599fa1_large.jpg" },
  { id: 2, title: "F5 Blog 2", imgSrc: "https://file.hstatic.net/200000182297/article/327890757_8735259056545354_6482098786089923519_n_ee711d5e3b9f4541b8c10fed967c16ca_large.jpg" },
  { id: 3, title: "F5 Blog 3", imgSrc: "https://file.hstatic.net/200000182297/article/315854475_2623148267823058_3203710229884569157_n_3baa02b3ee4348339faec98be869be0d_large.jpg" },
  { id: 4, title: "F5 Blog 4", imgSrc: "https://file.hstatic.net/200000182297/article/285634743_2457803104357576_4449744498852558662_n_a415bf75ede64fc997cbc67f348f8153_large.jpg" },
];

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  useEffect(() => {
    // Kiểm tra thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      console.log(user.username)// Lấy tên người dùng từ thông tin đã lưu
    }
  }, []);
  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleLogoutClick = () => {
    // Xử lý đăng xuất
    localStorage.removeItem('user');
    setUsername(null); // Reset lại state username
    navigate('/'); // Điều hướng tới trang chủ sau khi đăng xuất
  };
  const handleProfileClick = () => {
    navigate('/'); // Điều hướng đến trang thông tin cá nhân
  };
  const handleMenuClick = ({ key }) => {
    navigate(key); // Điều hướng đến đường dẫn tương ứng với key
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
  return (
    <Layout>
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
          defaultSelectedKeys={[items1]}
          onClick={handleMenuClick}
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
            <Button type="link" icon={<UserOutlined />} style={{ fontSize: '16px' }} onClick={handleLoginClick}>
              Đăng nhập
            </Button>
          )}
        </div>
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Layout style={{ padding: '24px 0' }}>

          <Content style={{ padding: '0 24px', minHeight: 280 }}>

            {/* Carousel cho khuyến mãi */}
            <Carousel autoplay>
              <div>
                <img src='https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img2_master.jpg?v=1496' alt="Banner 1" style={{ width: '100%' }} />
              </div>
              <div>
                <img src='https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img2_master.jpg?v=1496' alt="Banner 2" style={{ width: '100%' }} />
              </div>
              <div>
                <img src='https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img3_master.jpg?v=1497' alt="Banner 2" style={{ width: '100%' }} />
              </div>
            </Carousel>

            {/* Hàng sản phẩm nổi bật */}
            <h1 style={{ marginTop: '24px', textAlign: 'center' }}>SẢN PHẨM MỚI</h1>
            <Carousel autoplay slidesToShow={5} dots={false} style={{ margin: '0 5%' }}>
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
                    <button className="view-more-button">Xem thêm</button>
                  </div>
                </div>
              ))}
            </Carousel>

            {/* Adjusted space for Banner 3 */}
            <div style={{ margin: '40px 0' }}>
              <Carousel autoplay>
                <div>
                  <img src='https://media.canifa.com/Simiconnector/BannerSlider/a/o/aogio_topbanner_desktop-12aug.webp' alt="Banner 3" style={{ width: '100%' }} />
                </div>
              </Carousel>
            </div>

            {/* Hàng đồ đông mới */}
            <h1 style={{ marginTop: '24px', textAlign: 'center' }}>ĐỒ ĐÔNG MỚI</h1>
            <Carousel autoplay slidesToShow={5} dots={false} style={{ margin: '0 5%' }}>
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
                    <button className="view-more-button">Xem thêm</button>
                  </div>
                </div>
              ))}
            </Carousel>

            {/* F5 BLOG */}
            <h1 style={{ marginTop: '24px', textAlign: 'center', fontFamily: "gmv_din_pro-bold !important" }}>F5 BLOG</h1>
            <h3 style={{ marginTop: '5px', textAlign: 'center' }}>ĐÓN ĐẦU XU HƯỚNG, ĐỊNH HÌNH PHONG CÁCH</h3>
            <Carousel autoplay slidesToShow={3} dots={false} style={{ margin: '0 20%', marginTop: "3%" }}>
              {f5Blogs.map(blog => (
                <div key={blog.id} style={{ padding: '0 10px' }}>
                  <Card
                    hoverable
                    style={cardStyle}
                    cover={<img alt={blog.title} src={blog.imgSrc} style={imgStyle} />}
                  >
                    <Meta title={blog.title} description={blog.description} style={metaStyle} />
                  </Card>
                </div>
              ))}
            </Carousel>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Home;
