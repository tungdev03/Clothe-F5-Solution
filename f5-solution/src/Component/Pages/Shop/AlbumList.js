import React from 'react';
import { Card, Col, Row, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams for route params
import CustomHeader from '../../Layouts/Header/Header'; 
import AlbumListSidebar from './AlbumListSiteBar'; 
import './AlbumList.css';

const { Meta: Meta2 } = Card;

export const albums2 = [
    {
        id: 1,
        title: 'Đầm tiệc đỏ đính hoa 3D D06932',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_51b94bee8a494c27bb444b14b57fe794_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
    },
    {
        id: 2,
        title: 'Đầm hoa xanh D08422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
    },
    {
        id: 3,
        title: 'Đầm tiệc hoa đỏ D08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
    },
    {
        id: 4,
        title: 'Đầm tiệc đỏ đính hoa 3D D06932',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_51b94bee8a494c27bb444b14b57fe794_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
    },
    {
        id: 5,
        title: 'Đầm hoa xanh D08422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
    },
    {
        id: 6,
        title: 'Đầm tiệc hoa đỏ D08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
    },
    {
        id: 7,
        title: 'Đầm tiệc đỏ đính hoa 3D D06932',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_51b94bee8a494c27bb444b14b57fe794_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
    },
    {
        id: 8,
        title: 'Đầm hoa xanh D08422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
    },
    {
        id: 9,
        title: 'Đầm tiệc hoa đỏ D08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
    }
];

export const albums3 = [
    {
        id: 1,
        title: 'Đầm tiệc đỏ đính hoa 3D D06932',
        price: '1,599,000đ',
        imgSrc: 'https://theme.hstatic.net/200000182297/1000887316/14/banner_section_coll_4_1.png?v=1549',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
    },
    {
        id: 2,
        title: 'Đầm hoa xanh D08422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
    },
    {
        id: 3,
        title: 'Đầm tiệc hoa đỏ D08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
    },
    {
        id: 4,
        title: 'Đầm tiệc đỏ đính hoa 3D D06932',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_51b94bee8a494c27bb444b14b57fe794_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
    },
    {
        id: 5,
        title: 'Đầm hoa xanh D08422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
    },
    {
        id: 6,
        title: 'Đầm tiệc hoa đỏ D08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
    },
    {
        id: 7,
        title: 'Đầm tiệc đỏ đính hoa 3D D06932',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_51b94bee8a494c27bb444b14b57fe794_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
    },
    {
        id: 8,
        title: 'Đầm hoa xanh D08422',
        price: '1,699,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/10_59ebf29de6f243839c72ddfa9f69a4da_master.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d084221492443060401p1699dt__6__c104eca6f7864df2ad10fa9987085f85_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__8__348731bcb213432686e718036df63cee_master.jpg',
    },
    {
        id: 9,
        title: 'Đầm tiệc hoa đỏ D08322',
        price: '1,599,000đ',
        imgSrc: 'https://product.hstatic.net/200000182297/product/d079221492443020457p1599dt__9__2fbe1bbd7e6042f7a1e374905444a437_1024x1024.jpg',
        imgSrc1: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_caf940b812d147bb9454321f5e8bcafa_master.jpg',
        imgSrc2: 'https://product.hstatic.net/200000182297/product/d069321492443020601p1599dt_3__97436b2958144028b646be5f6b84f392_master.jpg',
    }
];

const AlbumList = () => {
    const navigate = useNavigate();
    const { collectionId } = useParams(); // Get collectionId from the URL

    // Select the appropriate album list based on collectionId
    const albumsToShow = collectionId === '2' ? albums2 : albums3;

    const handleViewMoreClick = (id) => {
        navigate(`/album-detail/${id}`);
    };

    return (
        <div>
            <CustomHeader />
            
            <div className="album-list-container1">
                <AlbumListSidebar />
                <div className="album-list-content1">
                    <Row gutter={[16, 16]}>
                        {albumsToShow.map((album) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={album.id}>
                                <Card
                                    hoverable
                                    className="album-card1"
                                    cover={
                                        <div className="album-card-image-container1">
                                            <img alt={album.title} src={album.imgSrc} className="album-card-image1" />
                                            <Button className="view-more-btn1" onClick={() => handleViewMoreClick(album.id)}>
                                                Xem thêm
                                            </Button>
                                        </div>
                                    }
                                >
                                    <Meta2 title={album.title} description={album.price} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default AlbumList;
