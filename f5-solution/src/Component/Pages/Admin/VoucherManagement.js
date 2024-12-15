import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, notification, DatePicker, InputNumber, Select, Modal, Switch, Row, Col } from 'antd';
import moment from 'moment';
import voucherService from '../../../Service/VoucherManaService'; // Import voucherService

const { Option } = Select;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState(''); // State to hold the search input

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Set number of vouchers per page

  // Fetch all vouchers
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const data = await voucherService.getVouchers();
      const updatedVouchers = data.map(voucher => {
        const currentDate = moment(); // Get current date
        if (voucher.soLuongDung === voucher.soLuongMa || currentDate.isAfter(moment(voucher.ngayKetThuc))) {
          voucher.trangThai = 0; // Set status to inactive
          updateVoucherStatus(voucher); // Update status in the backend
        }
        return voucher;
      });
      setVouchers(updatedVouchers);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách voucher.',
      });
    }
    setLoading(false);
  };

  // Update voucher status in the backend
  const updateVoucherStatus = async (voucher) => {
    try {
      await voucherService.updateVoucher(voucher.id, {
        ...voucher,
        trangThai: 0, // Set status to inactive
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật trạng thái voucher.',
      });
    }
  };

  // Call fetchVouchers when component mounts
  useEffect(() => {
    fetchVouchers();
  }, []);

  // Open modal for create
  const showModal = () => {
    setIsModalVisible(true);
    setIsEditing(false); // Set form to create mode
    form.resetFields(); // Reset form fields
  };

  // Open modal for update
  const showUpdateModal = (voucher) => {
    setSelectedVoucher(voucher);
    setIsEditing(true); // Set form to update mode
    setIsModalVisible(true);

    // Pre-fill form with selected voucher data
    form.setFieldsValue({
      ...voucher,
      ngayBatDau: voucher.ngayBatDau ? moment(voucher.ngayBatDau) : null,
      ngayKetThuc: voucher.ngayKetThuc ? moment(voucher.ngayKetThuc) : null,
    });
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Clear form when modal closes
    setSelectedVoucher(null); // Clear selected voucher
  };

  // Submit new voucher
  const onSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DD') : null,
        ngayKetThuc: values.ngayKetThuc ? values.ngayKetThuc.format('YYYY-MM-DD') : null,
      };

      if (isEditing && selectedVoucher) {
        // Update existing voucher
        await voucherService.updateVoucher(selectedVoucher.id, formattedValues);
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật voucher thành công!',
        });
      } else {
        // Create new voucher
        await voucherService.createVoucher(formattedValues);
        notification.success({
          message: 'Thành công',
          description: 'Tạo voucher mới thành công!',
        });
      }

      fetchVouchers(); // Refresh the voucher list
      handleCancel();  // Close the modal
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: isEditing ? 'Không thể cập nhật voucher.' : 'Không thể tạo voucher.',
      });
    }
  };

  // Handle the status change directly in the list
  const handleStatusChange = async (voucher, newStatus) => {
    try {
      const updatedVoucher = {
        ...voucher,
        trangThai: newStatus ? 1 : 0, // Update the status to 1 (active) or 0 (inactive)
      };
      await voucherService.updateVoucher(voucher.id, updatedVoucher);
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật trạng thái voucher thành công!',
      });
      fetchVouchers(); // Refresh the voucher list
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật trạng thái voucher.',
      });
    }
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: 'STT', // Add a header for the sequence number
      dataIndex: 'index', // New index field
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Generate sequential number based on page
      width: 70, // Set width for better alignment
    },
    {
      title: 'Ma Voucher',
      dataIndex: 'maVouCher',
      key: 'maVouCher',
    },
    {
      title: 'Ten Voucher',
      dataIndex: 'tenVouCher',
      key: 'tenVouCher',
    },
    {
      title: 'Ngay Bat Dau',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Ngay Ket Thuc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'So Luong Ma',
      dataIndex: 'soLuongMa',
      key: 'soLuongMa',
    },
    {
      title: 'So Luong Da Dung',
      dataIndex: 'soLuongDung',
      key: 'soLuongDung',
    },
    {
      title: 'Gia Tri Giam',
      dataIndex: 'giaTriGiam',
      key: 'giaTriGiam',
    },
    {
      title: 'Dieu Kien Toi Thieu Hoa Don',
      dataIndex: 'dieuKienToiThieuHoaDon',
      key: 'dieuKienToiThieuHoaDon',
    },
    {
      title: 'Hinh Thuc Giam',
      dataIndex: 'hinhThucGiam',
      key: 'hinhThucGiam',
    },
    {
      title: 'Loai Voucher',
      dataIndex: 'loaiVouCher',
      key: 'loaiVouCher',
    },
    {
      title: 'Ghi Chu',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
    },
    {
      title: 'Trang Thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text, record) => (
        <Switch
          checked={text === 1} // Check if the status is active (1)
          onChange={(checked) => handleStatusChange(record, checked)} // Handle status toggle
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showUpdateModal(record)}>Sửa</Button>
        </>
      ),
    },
  ];

  // Handle page change
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value); // Update the search text
  };

  // Filter vouchers based on search text
  const filteredVouchers = vouchers.filter(voucher => {
    return voucher.maVouCher.toLowerCase().includes(searchText.toLowerCase()) || 
           voucher.tenVouCher.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div>
      <h1>Quản Lý Voucher</h1>

      {/* Search Input */}
      <Input
        placeholder="Tìm kiếm theo mã hoặc tên voucher"
        value={searchText}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 20 }}
      />

      <Button type="primary" onClick={showModal}>Tạo Voucher</Button>

      {/* Modal for creating/updating voucher */}
      <Modal
        title={isEditing ? "Sửa Voucher" : "Tạo Voucher"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maVouCher" label="Mã Voucher" rules={[{ required: true }]} >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tenVouCher" label="Tên Voucher" rules={[{ required: true }]} >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ngayBatDau" label="Ngày Bắt Đầu">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ngayKetThuc" label="Ngày Kết Thúc">
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soLuongMa" label="Số Lượng Mã" rules={[{ required: true, message: 'Vui lòng nhập Số Lượng Mã!' }]} >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="giaTriGiam" label="Giá Trị Giảm" rules={[{ required: true, message: 'Vui lòng nhập Giá Trị Giảm!' }]} >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dieuKienToiThieuHoaDon" label="Điều Kiện Tối Thiểu Hóa Đơn" rules={[{ required: true }]}>
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hinhThucGiam" label="Hình Thức Giảm">
                <Select>
                  <Option value={1}>Giảm Giá Theo Phần Trăm</Option>
                  <Option value={2}>Giảm Giá Theo Số Tiền</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="loaiVouCher" label="Loại Voucher">
                <Select>
                  <Option value={1}>Giảm Giá</Option>
                  <Option value={2}>Miễn Phí Vận Chuyển</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ghiChu" label="Ghi Chú">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Sửa Voucher" : "Tạo Voucher"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Table to display vouchers */}
      <Table
        columns={columns}
        dataSource={filteredVouchers} // Use filtered vouchers
        loading={loading}
        rowKey="id" // Assuming 'id' is the unique identifier for each voucher
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredVouchers.length, // Use filtered vouchers' length
          onChange: handleTableChange,
        }}
      />
    </div>
  );
};

export default VoucherManagement;
