import React, { useState, useEffect } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    FileTextOutlined,
    TeamOutlined,
    TagsOutlined
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, theme, ConfigProvider } from 'antd';
import StatisticsPage from './StatisticsPage';
import logo from '../../../assets/images/Logo.png';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [currentContent, setCurrentContent] = useState(<StatisticsPage />); // Mặc định hiển thị StatisticsPage

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick = (key) => {
        switch (key) {
            case '1-1':
                setCurrentContent(<StatisticsPage />);
                break;
            // Thêm các case cho các trang khác mà bạn muốn hiển thị
            // Ví dụ:
            // case '2-1':
            //     setCurrentContent(<ProductManagementPage />);
            //     break;
            // case '2-2':
            //     setCurrentContent(<AddProductPage />);
            //     break;
            default:
                break;
        }
    };

    return (
        <Layout>
            <ConfigProvider
                theme={{
                    Layout: {
                        siderBg: 'red'
                    }
                }}
            />
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Avatar src={logo} size={200} />
                    <h2 style={{ textAlign: "center", margin: 0 }}>F5 Fashion</h2>
                    <hr style={{ width: '100%', marginTop: '5px' }} />
                </div>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.ItemGroup key="g1" title="Tổng quan" icon={<AppstoreOutlined />}>
                        <Menu.Item key="1-1" onClick={() => handleMenuClick('1-1')}>
                            Thống kê
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g2" title="Sản phẩm" icon={<ShoppingCartOutlined />}>
                        <Menu.Item key="2-1" onClick={() => handleMenuClick('2-1')}>
                            Quản lý sản phẩm
                        </Menu.Item>
                        <Menu.Item key="2-2" onClick={() => handleMenuClick('2-2')}>
                            Thêm sản phẩm
                        </Menu.Item>
                        <SubMenu key="sub1" title="Quản lý thuộc tính">
                            <Menu.Item key="2-3-1" onClick={() => handleMenuClick('2-3-1')}>
                                Quản lý màu sắc
                            </Menu.Item>
                            <Menu.Item key="2-3-2" onClick={() => handleMenuClick('2-3-2')}>
                                Quản lý kích cỡ
                            </Menu.Item>
                            <Menu.Item key="2-3-3" onClick={() => handleMenuClick('2-3-3')}>
                                Quản lý chất liệu
                            </Menu.Item>
                        </SubMenu>
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g3" title="Hóa đơn" icon={<FileTextOutlined />}>
                        <Menu.Item key="3-1" onClick={() => handleMenuClick('3-1')}>
                            Quản lý hóa đơn
                        </Menu.Item>
                        <Menu.Item key="3-2" onClick={() => handleMenuClick('3-2')}>
                            Bán tại quầy
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g4" title="Tài khoản" icon={<TeamOutlined />}>
                        <Menu.Item key="4-1" onClick={() => handleMenuClick('4-1')}>
                            Nhân viên
                        </Menu.Item>
                        <Menu.Item key="4-2" onClick={() => handleMenuClick('4-2')}>
                            Khách hàng
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.ItemGroup key="g5" title="Khuyến mại" icon={<TagsOutlined />}>
                        <Menu.Item key="5-1" onClick={() => handleMenuClick('5-1')}>
                            Quản lý sản phẩm giảm giá
                        </Menu.Item>
                        <Menu.Item key="5-2" onClick={() => handleMenuClick('5-2')}>
                            Quản lý voucher giảm giá
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {/* Hiển thị nội dung dựa trên lựa chọn menu */}
                    {currentContent}
                </Content>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
