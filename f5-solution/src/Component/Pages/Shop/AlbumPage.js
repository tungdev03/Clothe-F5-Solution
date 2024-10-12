import React from 'react';
import { Card, Col, Row, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import CustomHeader from '../../Layouts/Header/Header';
import './Album.css';

const { Meta } = Card;

export const albums = [
    {
        id: 1,
        title: 'Đầm hoa xanh DB0422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_51b94bee8a494c27bb444b14b57fe794_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/1_fc4991f52948401abc7698e5f39042e9_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d075521492443070418p1899dt__4__27401355c14740308fd53b0e5a2143bd_master.jpg',
        colors: ['#00A651', '#000000']
    },
    {
        id: 2,
        title: 'Đầm tiệc hoa đỏ DB08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
        colors: ['#FF0000', '#FFFFFF']
    },
    {
        id: 3,
        title: 'Đầm tiệc dáng A D07922',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
        colors: ['#000000', '#FFD700']
    },
    {
        id: 4,
        title: 'Đầm tiệc tafta D0672',
        price: '1,699,000đ',
        imgSrc: 'https://theme.hstatic.net/200000182297/1000887316/14/banner_section_coll_2_2.png?v=1530',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d067221492443020601p1599dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d067221492443020601p1599dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        colors: ['#8A2BE2', '#000000']
    },
];
export const albums1 = [
    {
        id: 1,
        title: 'Đầm Xám Sang Trọng D07922',
        price: '1,699,000đ',
        imgSrc: 'https://theme.hstatic.net/200000182297/1000887316/14/banner_section_coll_4_2.png?v=1549',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/1_fc4991f52948401abc7698e5f39042e9_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d075521492443070418p1899dt__4__27401355c14740308fd53b0e5a2143bd_master.jpg',
        colors: ['#00A651', '#000000']
    },
    {
        id: 2,
        title: 'Áo Vest Nữ D07922',
        price: '1,599,000đ',
        imgSrc: 'https://theme.hstatic.net/200000182297/1000887316/14/banner_section_coll_4_1.png?v=1549',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
        colors: ['#FF0000', '#FFFFFF']
    },
    {
        id: 3,
        title: 'Măng Tô D07822',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/3090418p1499dt_al621021932303010470p399dt_z103321512314910201p699dt_1__39ac76f75f0e4fe7a07c72c19208436a_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/3090418p1499dt_al621021932303010470p399dt_z103321512314910201p699dt_2__48b20874535c43eb804bc2f87f51a9e7_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/3090418p1499dt_al621021932303010470p399dt_z103321512314910201p699dt_4__1347d4c374b44781bf41cafa326a3bd8_master.jpg',
        colors: ['#000000', '#FFD700']
    },
    {
        id: 4,
        title: 'ÁO KHOÁC GẤM AK15112',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/ak151121332481000418p1199dt_z178221542422040274p999dt_1__6c18bf33284345cf879ba49cdabe30c3_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/ak151121332481000418p1199dt_z178221542422040274p999dt_2__7dcb396b6984452d88a98ad834722266_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/ak151121332481000418p1199dt_z178221542422040274p999dt_3__1796df9fd7794b138922f19f62ec7247_master.jpg',
        colors: ['#8A2BE2', '#000000']
    },
];

const AlbumPage = () => {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng

    const handleSeeMoreClickAlbum1 = () => {
        navigate('/album-list/2'); // Điều hướng tới bộ sưu tập Luxe Glow với collectionId là 2
    };

    const handleSeeMoreClickAlbum2 = () => {
        navigate('/album-list/3'); // Điều hướng tới bộ sưu tập Violet Dream với collectionId là 3
    };

    return (
        <div>
            <CustomHeader />

            <div className="album-container">
                {/* Chủ đề đầu tiên */}
                <Row gutter={[16, 16]} className="banner-row">
                    <Col span={24}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt="Banner 1"
                                    src="https://theme.hstatic.net/200000182297/1000887316/14/banner_section_coll_1.png?v=1530"
                                    className="banner-image"
                                />
                            }
                            className="banner-card"
                        >
                            <Meta title="LUXE GLOW | PARTY COLLECTION 2024" />
                        </Card>
                    </Col>
                </Row>

                {/* Các sản phẩm của chủ đề 1 */}
                <Row gutter={[16, 16]}>
                    {albums.map((album) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={album.id}>
                            <Card
                                hoverable
                                cover={
                                    <div className="album-card-image-container">
                                        <img
                                            alt={album.title}
                                            src={album.imgSrc}
                                            className="album-card-image"
                                        />
                                        <div className="color-overlay"></div>
                                       <Link to={`/album/${album.id}`}> <div className="view-more-overlay">
                                            <Button type='light' className="view-more-btn">Xem thêm</Button>
                                        </div></Link>
                                    </div>
                                }
                                className="album-card"
                            >
                                <Meta title={album.title} description={album.price} />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Phần mô tả về bộ sưu tập */}
                <div className="collection-description">
                    <h3>Giới thiệu về bộ sưu tập</h3>
                    <p>
                        Bộ sưu tập LUXE GLOW PARTY COLLECTION 2024 là sự kết hợp hoàn hảo giữa nét sang trọng và hiện đại. 
                        Lấy cảm hứng từ những bữa tiệc lấp lánh, mỗi thiết kế đều được chăm chút tỉ mỉ nhằm mang đến cho phái đẹp những bộ trang phục đẳng cấp.
                        Từ chất liệu cao cấp đến từng đường kim mũi chỉ, tất cả đều làm tôn lên vẻ đẹp kiêu sa và quyến rũ.
                    </p>
                </div>

                {/* Thêm nút Xem thêm bộ sưu tập ở dưới */}
                <div className="collection-button-container">
                    <Button type='dark' className="collection-btn" onClick={handleSeeMoreClickAlbum1}>
                        Xem thêm bộ sưu tập
                    </Button>
                </div>

                {/* ĐIỂM NHẤN GIỮA HAI CHỦ ĐỀ */}
                <div className="transition-section">
                    <h2>Khám phá Bộ Sưu Tập Tiếp Theo</h2>
                    <p>Hãy sẵn sàng cho sự bùng nổ sắc tím của bộ sưu tập Violet Dream.</p>
                </div>

                {/* Chủ đề thứ hai */}
                <Row gutter={[16, 16]} className="banner-row">
                    <Col span={24}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt="Banner 2"
                                    src="https://theme.hstatic.net/200000182297/1000887316/14/banner_section_coll_3.png?v=1530"
                                    className="banner-image"
                                />
                            }
                            className="banner-card"
                        >
                            <Meta title="VIOLET DREAM | AUTUMN COLLECTION 2024" />
                        </Card>
                    </Col>
                </Row>


                {/* Các sản phẩm của chủ đề 2 */}
                <Row gutter={[16, 16]}>
                    {albums1.map((album1) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={album1.id}>
                            <Card
                                hoverable
                                cover={
                                    <div className="album-card-image-container">
                                        <img
                                            alt={album1.title}
                                            src={album1.imgSrc}
                                            className="album-card-image"
                                        />
                                        <div className="color-overlay"></div>
                                       <Link to={`/album/${album1.id}`}> <div className="view-more-overlay">
                                            <Button type='light' className="view-more-btn">Xem thêm</Button>
                                        </div></Link>
                                    </div>
                                }
                                className="album-card"
                            >
                                <Meta title={album1.title} description={album1.price} />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Phần mô tả về bộ sưu tập */}
                <div className="collection-description">
                    <h3>Giới thiệu về bộ sưu tập</h3>
                    <p>
                        Bộ sưu tập Violet Dream Autumn Collection 2024 mang lại sắc màu mới lạ và sự tinh tế, lấy cảm hứng từ thiên nhiên mùa thu.
                    </p>
                </div>

                {/* Thêm nút Xem thêm bộ sưu tập ở dưới */}
                <div className="collection-button-container">
                    <Button type='dark' className="collection-btn" onClick={handleSeeMoreClickAlbum2}>
                        Xem thêm bộ sưu tập
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AlbumPage;
