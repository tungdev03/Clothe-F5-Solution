import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, message, DatePicker, InputNumber, Select, Modal, Switch, Row, Col } from 'antd';
import VoucherService from '../../../Service/VoucherManaService';
import moment from 'moment';

const { Option } = Select;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form] = Form.useForm();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Set number of vouchers per page

  // Fetch all vouchers
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await VoucherService.getVouchers();
      const updatedVouchers = response.map(voucher => {
        const currentDate = moment(); // Get current date
        if (voucher.soLuongDung === voucher.soLuongMa || currentDate.isAfter(moment(voucher.ngayKetThuc))) {
          voucher.trangThai = 0; // Set status to inactive
          updateVoucherStatus(voucher); // Update status in the backend
        }
        return voucher;
      });
      setVouchers(updatedVouchers);
    } catch (error) {
      message.error('Lấy thông tin voucher thất bại.');
    }
    setLoading(false);
  };

  // Update voucher status in the backend
  const updateVoucherStatus = async (voucher) => {
    try {
      await VoucherService.updateVoucher(voucher.id, { ...voucher, trangThai: 0 }); // Using the VoucherService update function
    } catch (error) {
      message.error('Cập nhật trạng thái voucher thất bại.');
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

  const onSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DD') : null,
        ngayKetThuc: values.ngayKetThuc ? values.ngayKetThuc.format('YYYY-MM-DD') : null,
      };
  
      // Check if the end date has passed, and set the status accordingly
      const currentDate = moment();
      const isExpired = currentDate.isAfter(moment(values.ngayKetThuc));
      formattedValues.trangThai = isExpired ? 0 : 1; // If expired, set status to inactive (0), otherwise active (1)
  
      if (isEditing && selectedVoucher) {
        // Update existing voucher
        await VoucherService.updateVoucher(selectedVoucher.id, formattedValues);
        message.success('Cập nhật voucher thành công!');
      } else {
        // Create new voucher
        await VoucherService.createVoucher(formattedValues);
        message.success('Tạo voucher mới thành công!');
      }
  
      fetchVouchers(); // Refresh the voucher list
      handleCancel();  // Close the modal
    } catch (error) {
      message.error(isEditing ? 'Cập nhật voucher thất bại.' : 'Tạo voucher thất bại.');
    }
  };

  // Handle the status change directly in the list
  const handleStatusChange = async (checked, record) => {
    try {
      const updatedStatus = checked ? 1 : 0; // If checked, status is 1 (active), otherwise 0 (inactive)
  
      // Update the record with the new status
      const updatedVoucher = { ...record, trangThai: updatedStatus };
  
      // Update the status immediately in the local state (or refresh the data)
      setVouchers(prevVouchers => prevVouchers.map(voucher => 
        voucher.id === record.id ? updatedVoucher : voucher
      ));
  
      // Make the API call to update the status on the backend
      await VoucherService.updateVoucher(record.id, { trangThai: updatedStatus });
  
      message.success('Trạng thái voucher đã được cập nhật!');
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại!');
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
      title: 'Mã Voucher',
      dataIndex: 'maVouCher',
      key: 'maVouCher',
    },
    {
      title: 'Tên Voucher',
      dataIndex: 'tenVouCher',
      key: 'tenVouCher',
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Ngày Kết Thúc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Số Lượng Mã',
      dataIndex: 'soLuongMa',
      key: 'soLuongMa',
    },
    {
      title: 'Số Lượng Đã Dùng',
      dataIndex: 'soLuongDung',
      key: 'soLuongDung',
    },
    {
      title: 'Giá Trị Giảm',
      dataIndex: 'giaTriGiam',
      key: 'giaTriGiam',
    },
    {
      title: 'Điều Kiện Tối Thiểu Hóa Đơn',
      dataIndex: 'dieuKienToiThieuHoaDon',
      key: 'dieuKienToiThieuHoaDon',
    },
    {
      title: 'Hình Thức Giảm',
      dataIndex: 'hinhThucGiam',
      key: 'hinhThucGiam',
    },
    {
      title: 'Loại Voucher',
      dataIndex: 'loaiVouCher',
      key: 'loaiVouCher',
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (text, record) => (
        <Switch
          checked={text === 1}  // Check if the status is active (1)
          onChange={(checked) => handleStatusChange(checked, record)} // Handle status toggle
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showUpdateModal(record)}>Cập nhật</Button>
        </>
      ),
    },
  ];

  // Handle page change
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div>
      <h1>Quản Lý Voucher</h1>

      <Button type="primary" onClick={showModal}>Tạo Voucher</Button>

      {/* Modal for creating/updating voucher */}
      <Modal
        title={isEditing ? "Cập Nhật Voucher" : "Tạo Voucher Mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maVouCher" label="Mã Voucher" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tenVouCher" label="Tên Voucher" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ngayBatDau" label="Ngày Bắt Đầu" rules={[{ required: true }]}>
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ngayKetThuc" label="Ngày Kết Thúc" rules={[{ required: true }]}>
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soLuongMa" label="Số Lượng Mã" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="giaTriGiam" label="Giá Trị Giảm" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dieuKienToiThieuHoaDon" label="Điều Kiện Tối Thiểu Hóa Đơn" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hinhThucGiam" label="Hình Thức Giảm" rules={[{ required: true }]}>
                <Select>
                  <Option value="1">Giảm theo tỷ lệ</Option>
                  <Option value="2">Giảm theo số tiền</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="loaiVouCher" label="Loại Voucher" rules={[{ required: true }]}>
                <Select>
                  <Option value="1">Giảm giá</Option>
                  <Option value="2">Miễn phí vận chuyển</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ghiChu" label="Ghi Chú">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            {isEditing ? 'Cập nhật Voucher' : 'Tạo Voucher'}
          </Button>
        </Form>
      </Modal>

      {/* Voucher Table */}
      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: handleTableChange,
        }}
      />
    </div>
  );
};

export default VoucherManagement;
