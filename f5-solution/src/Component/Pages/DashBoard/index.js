import React from 'react';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Carousel, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo_v1 from '../../../assets/images/Logo.png';

const { Header, Content } = Layout;

const DashBoard = () => {
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
                    defaultSelectedKeys={['1']}
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
                Đây là DashBoard
            </Content>
        </Layout>
    );
};

export default DashBoard;
