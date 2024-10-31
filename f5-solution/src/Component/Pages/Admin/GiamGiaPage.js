import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col, DatePicker } from "antd";
import moment from 'moment';
import GiamGiaService from '../../../Service/GiamGiaService';

const GiamGiaPage = () => {
    const [giamGias, setGiamGias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State để lưu từ khóa tìm kiếm
    const [editingGiamGia, setEditingGiamGia] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchGiamgia = async (search = '') => {
        setLoading(true);
        try {
            // Lấy danh sách tất cả các Giảm giá có thể tìm kiếm theo tên
            const data = await GiamGiaService.getAllGiamGia();
            if (search) {
                const filteredData = data.filter(giamGia =>
                    giamGia.tenGiamGia.toLowerCase().includes(search.toLowerCase())
                );
                setGiamGias(filteredData);
            } else {
                setGiamGias(data);
            }
            message.success("Lấy danh sách giảm giá thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách giảm giá"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    useEffect(() => {
        fetchGiamgia();
    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật
    const openModal = (record = null) => {
        setModalVisible(true);
        if (record) {
            setEditingGiamGia(record);
            // Chuyển đổi trangThai từ số thành boolean cho checkbox
            form.setFieldsValue({
                ...record,
                trangThai: record.trangThai, // 1 thành true, 0 thành false
            });
        } else {
            setEditingGiamGia(null);
            form.resetFields();
        }
    };

    // Xử lý khi tạo mới
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newGiamGia = {
                maGiamGia: values.maGiamGia,
                tenGiamGia: values.tenGiamGia,
                ngayTao: values.ngayTao,
                ngayCapNhat: values.ngayCapNhat,
                ngayBatDau: values.ngayBatDau,
                ngayKetThuc: values.ngayKetThuc,
                giaTriGiam: values.giaTriGiam,
                hinhThucGiam: values.hinhThucGiam,
                ghiChu: values.ghiChu,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await GiamGiaService.createGiamGia(newGiamGia);
            console.log('Create response:', response);
            message.success("Thêm mới Giảm Giá thành công");

            setModalVisible(false);
            fetchGiamgia();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    
    // Xử lý khi cập nhật 
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);

            const updatedValues = {
                id: editingGiamGia.id,
                maGiamGia: values.maGiamGia,
                tenGiamGia: values.tenGiamGia,
                ngayTao: values.ngayTao,
                ngayCapNhat: values.ngayCapNhat,
                ngayBatDau: values.ngayBatDau,
                ngayKetThuc: values.ngayKetThuc,
                giaTriGiam: values.giaTriGiam,
                hinhThucGiam: values.hinhThucGiam,
                ghiChu: values.ghiChu,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await GiamGiaService.updateGiamGia(editingGiamGia.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Giảm Giá thành công");

            setModalVisible(false);
            fetchGiamgia();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi submit form
    const handleOk = () => {
        if (editingGiamGia) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };

    // Hàm chuyển trạng thái 
    const handleStatusChange = async (giamGia, newStatus) => {
        try {
            const updateGiamGia = {
                ...giamGia,
                trangThai: newStatus ? 1 : 0,
            };
            await GiamGiaService.updateGiamGia(giamGia.id, updateGiamGia);
            message.success("Chuyển trạng thái Giảm Giá thành công");
            fetchGiamgia(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Giảm Giá");
        }
    };

    // Cấu hình các cột trong bảng
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
        },
        {
            title: "Mã Giảm Giá",
            dataIndex: "maGiamGia",
            key: "maGiamGia",
        },
        {
            title: "Tên Giảm Giá",
            dataIndex: "tenGiamGia",
            key: "tenGiamGia",
        },
        {
            title: "Ngày Tạo",
            dataIndex: "ngayTao",
            key: "ngayTao",
            render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
        {
            title: "Ngày Cập Nhật",
            dataIndex: "ngayCapNhat",
            key: "ngayCapNhat",
              render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
        {
            title: "Ngày Bắt Đầu",
            dataIndex: "ngayBatDau",
            key: "ngayBatDau",
              render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
        {

            title: "Ngày Kết Thúc",
            dataIndex: "ngayKetThuc",
            key: "ngayKetThuc",
              render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
        {

            title: "Giá Trị Giảm",
            dataIndex: "giaTriGiam",
            key: "giaTriGiam",
        },
        {

            title: "Hình Thức Giảm",
            dataIndex: "hinhThucGiam",
            key: "hinhThucGiam",
        },
        {
            title: "Ghi Chú",
            dataIndex: "ghiChu",
            key: "ghiChu",
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
            title: "Hành động",
            key: "action",
            render: (text, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => openModal(record)}
                        style={{ marginRight: 10 }}
                    >
                        Sửa
                    </Button>
                </>
            ),
        },
    ];

    // Hàm xử lý tìm kiếm
    const handleSearch = () => {
        fetchGiamgia(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Giảm Giá</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên giảm giá"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state tìm kiếm
                        style={{ width: 800 }} // Chiều rộng của input
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleSearch}>
                        Tìm kiếm
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={() => openModal()}
                        style={{ marginLeft: 10, width: 300 }} // Thêm margin-left cho nút Thêm mới
                    >
                        Thêm giảm giá mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={giamGias}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: giamGias.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa */}
            <Modal
                title={editingGiamGia ? "Cập nhật Giảm Giá" : "Thêm mới Giảm Giá"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                 <Form form={form} layout="vertical" style={{ width: '100%', margin: '0 auto' }}>
                    <Form.Item
                        label="Mã Giảm Giá"
                        name="maGiamGia"
                        rules={[{ required: true, message: "Vui lòng nhập mã Giảm Giá" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên Giảm Giá"
                        name="tenGiamGia"
                        rules={[{ required: true, message: "Vui lòng nhập tên Giảm Giá" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        
                        label="Ngày Tạo"
                        name="ngayTao"
                        initialValue={moment()} // Thiết lập giá trị mặc định là ngày hiện tại
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={dateRange}
                            onChange={handleDateChange}
                            style={{ marginBottom: '20px' }}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        
                        label="Ngày Cập Nhật"
                        name="ngayCapNhat"                      
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={dateRange}
                            onChange={handleDateChange}
                            style={{ marginBottom: '20px' }}
                        />
                    </Form.Item>
                    <Form.Item
                        
                        label="Ngày Bắt Đầu"
                        name="ngayBatDau"
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={dateRange}
                            onChange={handleDateChange}
                            style={{ marginBottom: '20px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        
                        label="Ngày Kết Thúc"
                        name="ngayKetThuc"

                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={dateRange}
                            onChange={handleDateChange}
                            style={{ marginBottom: '20px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá Trị Giảm"
                        name="giaTriGiam"                       
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hình Thức Giảm"
                        name="hinhThucGiam"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ghi Chú" name="ghiChu">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="trangThai"
                    >
                        <Radio.Group>
                            <Radio value={1}>Hoạt động</Radio>
                            <Radio value={0}>Không hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form> 

            </Modal>
        </div>
    );
};
export default GiamGiaPage;