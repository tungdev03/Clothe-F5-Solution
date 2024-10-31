import React, { useState, useEffect } from 'react';
import { Table, Button, message, Switch, App, Input, Row, Col, Dropdown, Space } from 'antd';
import { EditTwoTone, UserOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';

const { Search } = Input;

const onSearch = (value) => console.log('Search Value:', value);
const KhachHangPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [khachHangs, setKhachHangs] = useState([]);

  const items = [
    {
      label: 'Hoạt động',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'Ngưng hoạt động',
      key: '2',
      icon: <UserOutlined />,
    }
  ];

  const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const fetchKhachHangs = async () => {
    setLoading(true);
    try {
      const data = await AdminService.GetCustomer(); // Lấy dữ liệu từ API thông qua AdminService
      setKhachHangs(data); // Lưu dữ liệu khách hàng vào state
      message.success('Lấy danh sách khách hàng thành công!');
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    fetchKhachHangs(); // Gọi hàm fetch dữ liệu khi component được mount
  }, []);

  const handleStatusChange = async (khachHang, newStatus) => {
    try {
      const updatedKhachHang = {
        ...khachHang,
        trangThai: newStatus ? 1 : 0, // Cập nhật trạng thái
      };
      message.success('Trạng thái khách hàng đã được cập nhật!');
      fetchKhachHangs(); // Cập nhật lại danh sách sau khi thay đổi trạng thái
    } catch (error) {
      message.error('Không thể cập nhật trạng thái khách hàng.');
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
    },
    {
      title: 'Mã KH',
      dataIndex: 'maKh',
      key: 'maKh',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'hoVaTenKh',
      key: 'hoVaTenKh',
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gioiTinh',
      key: 'gioiTinh',
      render: (text) => (text ? 'Nam' : 'Nữ'),
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hình Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text) => <img src={text} alt="Khách hàng" width="50" />,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (text, record) => (
        <>
          <EditTwoTone />
        </>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <App>
      <div>
        <h1>Quản lý khách hàng</h1>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Search
              placeholder="Nhập tên hoặc mã khách hàng"
              onSearch={onSearch}
              enterButton
              style={{ height: '40px' }} // Đặt chiều cao cho ô tìm kiếm
            />
          </Col>
          <Col span={5}>
            <Dropdown menu={menuProps}>
              <Button style={{ height: '40px' }}> {/* Đặt chiều cao cho nút lọc */}
                <Space>
                  Lọc theo trạng thái
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              onClick={() => message.info('Thêm khách hàng mới')}
              style={{ height: '40px' }} // Đặt chiều cao cho nút thêm
            >
              Thêm khách hàng mới
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          loading={loading}
          dataSource={khachHangs} // Hiển thị dữ liệu khách hàng
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: khachHangs.length,
            onChange: handleTableChange,
          }}
        />
      </div>
    </App>
  );
};

export default KhachHangPage;
