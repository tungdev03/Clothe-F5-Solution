import React, { useState, useEffect } from 'react';
import { Table, Button, message, Switch, Input, Row, Col, Dropdown, Space, Drawer, Form, Select } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';
import AuthService from '../../../Service/AuthService';

const { Search } = Input;
const { Option } = Select;

const KhachHangPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [khachHangs, setKhachHangs] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [Keyword, setKeyword] = useState();

  const fetchKhachHangs = async () => {
    setLoading(true);
    try {
      const data = await AdminService.GetCustomer();
      setKhachHangs(data);
      message.success('Lấy danh sách khách hàng thành công!');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhachHangs();
  }, []);

  const handleEdit = async (record) => {
    try {
      const data = await AdminService.getKhachHangById(record.id);
      console.log(data)
      setEditingUser(data);
      form.setFieldsValue({
        ...data,
        gioiTinh: data.gioiTinh ? 'Nam' : 'Nữ', // Chuyển đổi từ boolean thành chuỗi
        ngaySinh: moment(data.ngaySinh).format('YYYY-MM-DD'),
      });
      setIsDrawerVisible(true);
    } catch (error) {
      message.error('Lỗi khi lấy chi tiết khách hàng.');
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      const userValues = {
        id: values.id,
        maKh: values.maKh,
        hoVaTenKh: values.hoVaTenKh,
        gioiTinh: values.gioiTinh === 'Nam', // Chuyển đổi từ chuỗi thành boolean
        ngaySinh: values.ngaySinh,
        taiKhoan: values.taiKhoan || 'string',
        matKhau: values.matKhau || 'string',
        soDienThoai: values.soDienThoai,
        email: values.email,
        trangThai: 0,
      };

      if (editingUser) {
        await AuthService.registerCustomer(userValues);
        message.success('Cập nhật khách hàng thành công!');
      }
      handleDrawerClose();
      fetchKhachHangs();
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleStatusChange = async (khachHang, newStatus) => {
    try {
      const updatedKhachHang = {
        ...khachHang,
        trangThai: newStatus ? 1 : 0,
      };
      await AuthService.registerCustomer(updatedKhachHang);
      message.success('Trạng thái khách hàng đã được cập nhật!');
      fetchKhachHangs();
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
      render: (text) => (text ? 'Nam' : 'Nữ'), // Chuyển đổi boolean thành chuỗi
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
      render: (text) => <img src={text} alt="Khách hàng" width="20px" />,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text, record) => (
        <Switch
          checked={text === 1}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const onSearch = async (value) => {
    setLoading(true)
    try {
      const data = await AdminService.SearchCustomer(value.Keyword, value.IsPublic)
      if (Array.isArray(data)) {
        setKhachHangs(data);
        message.success('Tìm kiếm khách hàng thành công!');
      } else {
        throw new Error('Không có dữ liệu khách hàng');
      }
    }
    catch (error) {
      console.error('Lỗi khi tìm kiếm nhân viên:', error);
      setKhachHangs([]);
      message.error(error.message || 'Lỗi không xác định');
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <h1>Quản lý khách hàng</h1>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Search
            placeholder="Nhập tên hoặc mã khách hàng"
            enterButton
            onSearch={onSearch}
            style={{ height: '40px' }}
            value={Keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Col>
        <Col span={5}>
          <Dropdown
            menu={{
              items: [
                { label: 'Hoạt động', key: '0' },
                { label: 'Ngưng hoạt động', key: '1' },
              ],
            }}
          >
            <Button style={{ height: '40px' }}>
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
            onClick={() => {
              setEditingUser(null);
              setIsDrawerVisible(true);
            }}
            style={{ height: '40px' }}
          >
            Thêm khách hàng mới
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        loading={loading}
        dataSource={khachHangs}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: khachHangs.length,
          onChange: handleTableChange,
        }}
      />

      <Drawer
        title={editingUser ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
        visible={isDrawerVisible}
        onClose={handleDrawerClose}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="maKh"
            label="Mã KH"
            rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng!' }]}
          >
            <Input placeholder="Nhập mã khách hàng" />
          </Form.Item>

          <Form.Item
            name="hoVaTenKh"
            label="Họ và Tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="gioiTinh"
            label="Giới Tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ngaySinh"
            label="Ngày Sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <Input type="false" placeholder="Chọn ngày sinh" />
          </Form.Item>

          <Form.Item
            name="soDienThoai"
            label="Số Điện Thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
          >
            <Input type="email" placeholder="Nhập email" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {editingUser ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default KhachHangPage;
