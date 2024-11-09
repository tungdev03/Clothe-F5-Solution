import React from 'react';
import { Row, Col } from 'antd';
import { Footer } from 'antd/es/layout/layout';

const Footers = () => {
    return (
        <Footer style={{ backgroundColor: 'black', color: 'white', padding: '40px 50px', }}>
            <Row gutter={16}>
                <Col span={8} style={{ paddingLeft: "10%", textAlign: 'left', }}>
                    <h3 style={{ color: 'white' }}>          
                        <span className="brand" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        <span style={{ color: 'orange' }}>F5</span> Fashion
                    </span> - THỜI TRANG CÔNG SỞ</h3>
                    <p>Công ty TNHH Dịch vụ và DTF.</p>
                    <p>Số ĐKKD 0107861393, Sở KHĐT Tp. Hà Nội cấp ngày 11/09/2024</p>
                    <p>Địa chỉ: Lô 1+2, Ô quy hoạch E.2/NO7 đường Lâm Hạ, phường Bồ Đề, quận Long Biên, Hà Nội</p>
                </Col>
                <Col span={8} style={{ paddingLeft: "10%", textAlign: 'left' }}>
                    <h3 style={{ color: 'white' }}>Liên hệ</h3>
                    <p>Chăm sóc khách hàng: 0966841340</p>
                    <p>Mua hàng online: 0364097673</p>
                    <p>Email: nemcskh@stripe-vn.com</p>
                </Col>
                <Col span={8} style={{ paddingLeft: "10%", textAlign: 'left' }}>
                    <h3 style={{ color: 'white' }}>Thông tin</h3>
                    <p>Giới thiệu</p>
                    <p>Hệ thống showroom</p>
                    <p>Liên hệ</p>
                    <p>Chính sách giao nhận - Vận chuyển</p>
                </Col>
            </Row>
        </Footer>
    );
};

export default Footers;
