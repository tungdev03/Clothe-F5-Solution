import React from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, DownOutlined } from '@ant-design/icons';
import './AlbumList.css';

const { SubMenu } = Menu;

const AlbumListSidebar = ({ onCategorySelect }) => {
    const handleClick = (e) => {
        if (onCategorySelect) {
            onCategorySelect(e.key); // Truyền danh mục đã chọn lên AlbumPage
        } else {
            console.error("onCategorySelect không được truyền vào AlbumListSidebar.");
        }
    };

    return (
        <div className="album-list-sidebar">
            <Menu
                defaultSelectedKeys={['all']}
                mode="inline"
                style={{ width: 256 }}
                onClick={handleClick}  // Gọi hàm handleClick khi nhấp vào item
            >
                <Menu.Item key="all" icon={<AppstoreOutlined />}>
                    Tất cả sản phẩm
                </Menu.Item>

                <SubMenu key="sub1" title="Đầm" icon={<DownOutlined />}>
                    <Menu.Item key="dam">Tất cả đầm</Menu.Item>
                    <Menu.Item key="dam-du-tiec">Đầm dự tiệc</Menu.Item>
                    <Menu.Item key="dam-dao-pho">Đầm dạo phố</Menu.Item>
                </SubMenu>

                <SubMenu key="sub2" title="Áo" icon={<DownOutlined />}>
                    <Menu.Item key="ao">Tất cả áo</Menu.Item>
                    <Menu.Item key="ao-so-mi">Áo sơ mi</Menu.Item>
                    <Menu.Item key="ao-thun">Áo thun</Menu.Item>
                </SubMenu>

                <SubMenu key="sub3" title="Quần" icon={<DownOutlined />}>
                    <Menu.Item key="quan">Tất cả quần</Menu.Item>
                    <Menu.Item key="quan-dai">Quần dài</Menu.Item>
                    <Menu.Item key="quan-ngan">Quần ngắn</Menu.Item>
                </SubMenu>

                <SubMenu key="sub4" title="Chân váy" icon={<DownOutlined />}>
                    <Menu.Item key="vay-ngan">Váy ngắn</Menu.Item>
                    <Menu.Item key="vay-dai">Váy dài</Menu.Item>
                </SubMenu>
            </Menu>
        </div>
    );
};

export default AlbumListSidebar;
