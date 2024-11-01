<<<<<<< HEAD
import React from 'react'

const NhanVienPage = () => {
  return (
    <div>NhanVienPage</div>
  )
}

export default NhanVienPage
=======
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Switch, Input, Row, Col, Modal, Form, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';

const { Search } = Input;

const NhanVienPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [nhanViens, setNhanViens] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNhanVien, setEditingNhanVien] = useState(null);
  const [form] = Form.useForm();

  const fetchNhanViens = async () => {
    setLoading(true);
    try {
      const data = await AdminService.GetNhanVien();
      if (Array.isArray(data)) {
        setNhanViens(data);
      } else {
        throw new Error("Dữ liệu không hợp lệ");
      }
      message.success('Lấy danh sách nhân viên thành công!');
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi lấy danh sách nhân viên.');
      setNhanViens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNhanViens();
  }, []);

  const handleEdit = (record) => {
    setEditingNhanVien(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (nhanVien, newStatus) => {
    try {
      const updatedNhanVien = {
        ...nhanVien,
        trangThai: newStatus ? 1 : 0,
      };
      await AdminService.UpdateNhanVienStatus(updatedNhanVien); // Giả sử có phương thức này trong AdminService
      message.success('Trạng thái nhân viên đã được cập nhật!');
      fetchNhanViens();
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
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const onSearch = (value) => {
    console.log('Search Value:', value);
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingNhanVien) {
          await AdminService.UpdateNhanVien({ ...editingNhanVien, ...values });
          message.success('Cập nhật nhân viên thành công!');
        } else {
          await AdminService.CreateNhanVien(values);
          message.success('Thêm nhân viên thành công!');
        }
        setIsModalVisible(false);
        fetchNhanViens();
      } catch (error) {
        message.error('Lỗi khi cập nhật dữ liệu nhân viên.');
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingNhanVien(null);
  };

  const handleDelete = async (record) => {
    try {
      await AdminService.DeleteNhanVien(record.id);
      message.success('Xóa nhân viên thành công!');
      fetchNhanViens();
    } catch (error) {
      message.error('Lỗi khi xóa nhân viên.');
    }
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
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm nhân viên mới
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        loading={loading}
        dataSource={nhanViens}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: nhanViens.length,
          onChange: handleTableChange,
        }}
      />

      <Modal
        title={editingNhanVien ? "Sửa thông tin nhân viên" : "Thêm nhân viên"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="maNv" label="Mã NV" rules={[{ required: true, message: 'Nhập mã NV' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="hoVaTenNv" label="Họ và Tên" rules={[{ required: true, message: 'Nhập họ và tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gioiTinh" label="Giới Tính">
            <Input />
          </Form.Item>
          <Form.Item name="ngaySinh" label="Ngày Sinh">
            <Input />
          </Form.Item>
          <Form.Item name="soDienThoai" label="Số Điện Thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Hình Ảnh">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhanVienPage;
>>>>>>> b1014c29395fed23a7a9483ddc99910628e03845
