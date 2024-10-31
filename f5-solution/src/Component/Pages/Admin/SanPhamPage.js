import React, { useEffect, useState } from "react";
import { Table, Button, Switch, Modal, Radio, Form, Input, message, Row, Col, Select, DatePicker } from "antd";
import SanPhamService from "../../../Service/SanPhamService";
import ChatLieuService from "../../../Service/ChatLieuService";
import DanhMucService from "../../../Service/DanhMucService";
import GiamGiaService from "../../../Service/GiamGiaService";
import XuatXuService from "../../../Service/XuatXuService";
import ThuongHieuService from "../../../Service/ThuongHieuService";
import moment from 'moment';

const { Option } = Select;
const SanPhamPage = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [sanPhams, setSanPhams] = useState([]);
    const [chatLieus, setChatLieus] = useState([]);
    const [danhMucs, setDanhMucs] = useState([]);
    const [xuatXus, setXuatXus] = useState([]);
    const [thuongHieus, setThuongHieus] = useState([]);
    const [giamGias, setGiamGias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSanpham, setEditingSanPham] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [form] = Form.useForm();
    const pageSize = 10;

    // Fetch dữ liệu ban đầu
    const fetchSanPham = async (search = '') => {
        setLoading(true);
        try {
            const data = await SanPhamService.getAllSanPham();
            if (search) {
                const filteredData = data.filter(sanPham =>
                    sanPham.tenSanPham.toLowerCase().includes(search.toLowerCase())
                );
                setSanPhams(filteredData);
            } else {
                setSanPhams(data);
            }
            message.success("Lấy danh sách sản phẩm thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách sản phẩm"); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    const fetchGiamgia = async () => {
        const data = await GiamGiaService.getAllGiamGia();
        setGiamGias(data);
    };

    const fetchThuongHieu = async () => {
        const data = await ThuongHieuService.getAllThuongHieu();
        setThuongHieus(data);
    };

    const fetchXuatXu = async () => {
        const data = await XuatXuService.getAllXuatXu();
        setXuatXus(data);
    };

    const fetchChatLieu = async () => {
        const data = await ChatLieuService.getAllChatLieu();
        setChatLieus(data);
    };

    const fetchDanhMuc = async () => {
        const data = await DanhMucService.getAllDanhMuc();
        setDanhMucs(data);
    };


    useEffect(() => {
        fetchSanPham();
        fetchChatLieu();
        fetchDanhMuc();
        fetchXuatXu();
        fetchThuongHieu();
        fetchGiamgia();

    }, []);

    // Hàm xử lý mở modal thêm mới hoặc cập nhật
    const openModal = (record = null) => {
        setModalVisible(true);
        if (record) {
            setEditingSanPham(record);
            form.setFieldValue({
                ...record,
                trangThai: record.trangThai,
            });
        } else {
            setEditingSanPham(null);
            form.resetFields();
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    // Xử lý khi tạo mới 
    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);

            const newSanPham = {
                maSp: values.maSp,
                tenSp: values.tenSp,
                giaBan: values.giaBan,
                giaNhap: values.giaNhap,
                donGiaKhiGiam: values.donGiaKhiGiam,
                moTa: values.moTa,
                idDm: values.idDm,
                idTh: values.idTh,
                idXx: values.idXx,
                idCl: values.idCl,
                idGg: values.idGg,
                theLoai: values.theLoai,
                imageDefaul: values.imageDefaul,
                ngayThemGiamGia: values.ngayThemGiamGia,
                ngayThem: values.ngayThem,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await SanPhamService.createSanPham(newSanPham);
            console.log('Create response:', response);
            message.success("Thêm mới Sản phẩm thành công");

            setModalVisible(false);
            fetchSanPham();
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    // Xử lý khi cập nhật
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);

            const updatedValues = {
                id: editingSanpham.id,
                maSp: values.maSp,
                tenSp: values.tenSp,
                giaBan: values.giaBan,
                giaNhap: values.giaNhap,
                donGiaKhiGiam: values.donGiaKhiGiam,
                moTa: values.moTa,
                idDm: values.idDm,
                idTh: values.idTh,
                idXx: values.idXx,
                idCl: values.idCl,
                idGg: values.idGg,
                theLoai: values.theLoai,
                imageDefaul: values.imageDefaul,
                ngayThemGiamGia: values.ngayThemGiamGia,
                ngayThem: values.ngayThem,
                trangThai: values.trangThai === 1 ? 1 : 0, // Giả sử 1 là true và 0 là false
            };

            const response = await SanPhamService.updateSanPham(editingSanpham.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Sản phẩm thành công");

            setModalVisible(false);
            fetchSanPham();
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
        if (editingSanpham) {
            handleUpdate(); // Nếu đang chỉnh sửa, gọi hàm cập nhật
        } else {
            handleCreate(); // Nếu không, gọi hàm tạo mới
        }
    };

    // Hàm chuyển trạng thá
    const handleStatusChange = async (sanPham, newStatus) => {
        try {
            const updateSanPham = {
                ...sanPham,
                trangThai: newStatus ? 1 : 0,
            };
            await SanPhamService.updateSanPham(sanPham.id, updateSanPham);
            message.success("Chuyển trạng thái Sản phẩm thành công");
            fetchSanPham(); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Màu sắc");
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
            title: "Mã Sản Phẩm",
            dataIndex: "maSp",
            key: "maSp",
        },
        {
            title: "Tên Sản Phẩm",
            dataIndex: "tenSp",
            key: "tenSp",
        },
        {
            title: "Giá Bán",
            dataIndex: "giaBan",
            key: "giaBan",
        },
        {
            title: "Giá Nhập",
            dataIndex: "giaNhap",
            key: "giaNhap",
        },
        {
            title: "Đơn Giá Khi Giảm",
            dataIndex: "donGiaKhiGiam",
            key: "donGiaKhiGiam",
        },
        {
            title: "Danh Mục",
            dataIndex: "idDm",
            key: "idDm",
            render: (idDm) => danhMucs.find(dm => dm.id === idDm)?.tenDanhMuc || '',
        },
        {
            title: "Thương Hiệu",
            dataIndex: "idTh",
            key: "tenTh",
            render: (idTh) => thuongHieus.find(th => th.id === idTh)?.tenThuongHieu || '',
        },
        {
            title: "Xuất Xứ",
            dataIndex: "idXx",
            key: "idXx",
            render: (idXx) => xuatXus.find(xx => xx.id === idXx)?.tenXuatXu || '',
        },
        {
            title: "Chất Liệu",
            dataIndex: "idCl",
            key: "idCl",
            render: (idCl) => chatLieus.find(cl => cl.id === idCl)?.tenChatLieu || '',
        },
        {
            title: "Giảm Giá",
            dataIndex: "idGg",
            key: "idGg",
            render: (idGg) => giamGias.find(gg => gg.id === idGg)?.tenGiamGia || '',
        },
        {
            title: "Thể Loại",
            dataIndex: "theLoai",
            key: "theLoai",
        },
        {
            title: "Hình Ảnh",
            dataIndex: "imageDefaul",
            key: "imageDefaul",

        },
        {
            title: "Ngày Thêm Giảm Giá",
            dataIndex: "ngayThemGiamGia",
            key: "ngayThemGiamGia",
            render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
        {
            title: "Ngày Thêm",
            dataIndex: "ngayThem",
            key: "ngayThem",
            render: (text) => text ? moment(text).format('DD/MM/YYYY') : ''
        },
        {
            title: "Mô tả",
            dataIndex: "moTa",
            key: "moTa",
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
        fetchSanPham(searchTerm);
    };

    return (
        <div>
            <h2>Quản lý Sản Phẩm</h2>
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col>
                    <Input
                        placeholder="Tìm kiếm tên sản phẩm"
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
                        Thêm sản phẩm mới
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={sanPhams}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: sanPhams.length,
                    onChange: (page) => setCurrentPage(page),
                }}
            />

            {/* Modal thêm/sửa Màu Sắc */}
            <Modal
                title={editingSanpham ? "Cập nhật Sản Phẩm" : "Thêm mới Sản Phẩm"}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Mã Sản Phẩm"
                        name="maSp"
                        rules={[{ required: true, message: "Vui lòng nhập Mã Sản Phẩm" }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Tên Sản Phẩm"
                        name="tenSp"
                        rules={[{ required: true, message: "Vui lòng nhập tên Sản Phẩm" }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Giá Bán"
                        name="giaBan"
                        rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Giá Nhập"
                        name="giaNhap"
                        rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item label="Đơn Giá Khi Giảm" name="donGiaKhiGiam">
                        <Input />
                    </Form.Item>


                    <Form.Item label="Danh Mục" name="idDm" rules={[{ required: true }]}>
                        <Select placeholder="Chọn Danh Mục">
                            {danhMucs.map(dm => (
                                <Option key={dm.id} value={dm.id}>{dm.tenDanhMuc}</Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Thương Hiệu" name="idTh" rules={[{ required: true }]}>
                        <Select placeholder="Chọn Thương Hiệu">
                            {thuongHieus.map(th => (
                                <Option key={th.id} value={th.id}>{th.tenThuongHieu}</Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Giảm Giá" name="idGg" rules={[{ required: true }]}>
                        <Select placeholder="Chọn Giảm Giá">
                            {giamGias.map(gg => (
                                <Option key={gg.id} value={gg.id}>{gg.tenGiamGia}</Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Xuất Xứ" name="idXx" rules={[{ required: true }]}>
                        <Select placeholder="Chọn Xuất Xứ">
                            {xuatXus.map(xx => (
                                <Option key={xx.id} value={xx.id}>{xx.tenXuatXu}</Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Chất Liệu" name="idCl" rules={[{ required: true }]}>
                        <Select placeholder="Chọn chất liệu">
                            {chatLieus.map(cl => (
                                <Option key={cl.id} value={cl.id}>{cl.tenChatLieu}</Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Thể Loại" name="theLoai">
                        <Input />
                    </Form.Item>


                    <Form.Item label="Hình Ảnh" name="imageDefaul">
                        <Input />
                    </Form.Item>


                    <Form.Item label="Ngày Thêm Giảm Giá" name="ngayThemGiamGia">
                        <DatePicker
                            format="DD/MM/YYYY"
                            value={dateRange}
                            onChange={handleDateChange}
                            style={{ marginBottom: '20px' }}
                        />
                    </Form.Item>


                    <Form.Item
                        label="Ngày Thêm"
                        name="ngayThem"
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

                    <Form.Item label="Mô tả" name="moTa">
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
export default SanPhamPage;