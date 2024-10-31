import React, { useState, useEffect } from 'react';
import { Table, Button, message, Switch, App, Input, Row, Col, Dropdown, Space, Drawer, Form, Select, DatePicker } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';

const { Search } = Input;

const KhachHangPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [khachHangs, setKhachHangs] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

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

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      ngaySinh: moment(record.ngaySinh), // Chuyển đổi ngày thành moment
    }); // Thiết lập giá trị cho form
    setIsDrawerVisible(true); // Mở Drawer
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setEditingUser(null);
    form.resetFields(); // Reset form
  };

  const handleFormSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null, // Định dạng ngày
      };
      if (editingUser) {
        // Cập nhật người dùng
        await AdminService.UpdateCustomer({ ...editingUser, ...formattedValues });
        message.success('Cập nhật khách hàng thành công!');
      } else {
        // Thêm mới người dùng
        await AdminService.AddCustomer(formattedValues);
        message.success('Thêm khách hàng thành công!');
      }
      handleDrawerClose(); // Đóng Drawer sau khi thực hiện
      fetchKhachHangs(); // Cập nhật lại danh sách khách hàng
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleStatusChange = async (record, checked) => {
    try {
      await AdminService.UpdateCustomer({ ...record, trangThai: checked });
      message.success('Cập nhật trạng thái thành công!');
      fetchKhachHangs(); // Cập nhật lại danh sách khách hàng
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái.');
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

  return (
    <App>
      <div>
        <h1>Quản lý khách hàng</h1>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Search
              placeholder="Nhập tên hoặc mã khách hàng"
              onSearch={(value) => console.log('Search Value:', value)}
              enterButton
              style={{ height: '40px' }}
            />
          </Col>
          <Col span={5}>
            <Dropdown menu={{ items: [{ label: 'Hoạt động', key: '1' }, { label: 'Ngưng hoạt động', key: '2' }] }}>
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
                setEditingUser(null); // Reset người dùng để thêm mới
                setIsDrawerVisible(true); // Mở Drawer
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
              <Input />
            </Form.Item>
            <Form.Item
              name="hoVaTenKh"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gioiTinh"
              label="Giới Tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Select>
                <Select.Option value={0}>Nam</Select.Option>
                <Select.Option value={1}>Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="ngaySinh"
              label="Ngày Sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="soDienThoai"
              label="Số Điện Thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </App>
  );
};

export default KhachHangPage;
