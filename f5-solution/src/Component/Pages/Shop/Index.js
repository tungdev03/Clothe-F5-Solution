import React from 'react';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Carousel, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo_v1 from '../../../assets/images/Logo.png';

const { Header, Content } = Layout;
const { Meta } = Card;

const items1 = [
  { key: '1', label: 'Cửa hàng' },
  { key: '2', label: 'Sản phẩm' },
  { key: '3', label: 'Liên hệ' },
  { key: '4', label: 'Bộ sưu tập' }
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
];

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          padding: '0 10px',
        }}
      >
        <div className="logo-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo_v1} alt="logo" style={{ height: '150px', marginRight: '3px' }} />
          <span className="brand" style={{ fontSize: '18px', fontWeight: 'bold' }}>
            <span style={{ color: 'orange' }}>F5</span> Fashion
          </span>
        </div>

        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items1}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        />

        <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button type="link" icon={<UserOutlined />} style={{ fontSize: '16px' }} onClick={handleLoginClick}>
            Đăng nhập
          </Button>
          <Button type="link" icon={<ShoppingCartOutlined />} style={{ fontSize: '16px' }}>Giỏ hàng</Button>
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
            </Carousel>

            {/* Hàng sản phẩm nổi bật */}
            <h1 style={{ marginTop: '24px', textAlign: 'center' }}>SẢN PHẨM MỚI</h1>
            <Carousel autoplay slidesToShow={5} dots={false} style={{ margin: '0 5%' }}>
              {products.map(product => (
                <div key={product.id} style={{ padding: '0 10px' }}>
                  <Card
                    hoverable
                    cover={<img alt={product.title} src={product.imgSrc} style={{ width: '100%', objectFit: 'contain', height: 'auto' }} />}
                  >
                    <Meta title={product.title} description={product.description} />
                  </Card>
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
                <div key={product.id} style={{ padding: '0 10px' }}>
                  <Card
                    hoverable
                    cover={<img alt={product.title} src={product.imgSrc} style={{ width: '100%', objectFit: 'contain', height: 'auto' }} />}
                  >
                    <Meta title={product.title} description={product.description} />
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
