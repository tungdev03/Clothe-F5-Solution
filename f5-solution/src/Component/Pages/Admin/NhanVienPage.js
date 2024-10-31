import React, { useState, useEffect } from 'react';
import { Table, Button, message, Switch, Input, Row, Col } from 'antd';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';

const { Search } = Input;

const NhanVienPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [nhanViens, setNhanViens] = useState([]); // Quản lý dữ liệu nhân viên

  // Hàm fetch dữ liệu nhân viên từ API
  const fetchNhanViens = async () => {
    setLoading(true);
    try {
      const data = await AdminService.GetNhanVien(); // Lấy dữ liệu từ API
      if (Array.isArray(data)) {
        setNhanViens(data); // Lưu dữ liệu nhân viên vào state
      } else {
        throw new Error("Dữ liệu không hợp lệ");
      }
      message.success('Lấy danh sách nhân viên thành công!');
    } catch (error) {
      console.error(error); // Log lỗi
      message.error('Lỗi khi lấy danh sách nhân viên.'); // Thông báo lỗi cho người dùng
      setNhanViens([]); // Đặt lại danh sách nhân viên khi có lỗi
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    fetchNhanViens(); // Gọi hàm fetch dữ liệu khi component được mount
  }, []);

  const handleStatusChange = async (nhanVien, newStatus) => {
    try {
      const updatedNhanVien = {
        ...nhanVien,
        trangThai: newStatus ? 1 : 0, // Cập nhật trạng thái
      };
      message.success('Trạng thái nhân viên đã được cập nhật!');
      fetchNhanViens(); // Cập nhật lại danh sách sau khi thay đổi trạng thái
    } catch (error) {
      message.error('Không thể cập nhật trạng thái nhân viên.');
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
      title: 'Mã NV',
      dataIndex: 'maNv',
      key: 'maNv',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'hoVaTenNv',
      key: 'hoVaTenNv',
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
      render: (text) => <img src={text} alt="Nhân viên" width="50" />,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text, record) => (
        <Switch
          checked={text === 1} // Kiểm tra trạng thái
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link">Cập Nhật</Button>
        </>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const onSearch = (value) => {
    console.log('Search Value:', value);
    // Thực hiện tìm kiếm nếu cần
  };

  return (
    <div>
      <h1>Quản lý nhân viên</h1>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Search
            placeholder="Nhập tên hoặc mã nhân viên"
            onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={() => message.info('Thêm nhân viên mới')}>
            Thêm nhân viên mới
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        loading={loading}
        dataSource={nhanViens} // Hiển thị dữ liệu nhân viên
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: nhanViens.length,
          onChange: handleTableChange,
        }}
      />
    </div>
  );
};

export default NhanVienPage;
