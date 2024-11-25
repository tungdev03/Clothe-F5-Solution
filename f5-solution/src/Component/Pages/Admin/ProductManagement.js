import React, { useEffect, useState } from "react";
import { Upload, Table, Button, Switch, Modal, Radio, Form, Input, message, Select, DatePicker } from "antd";
import { EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import "./ProductManagement.css";
import ProductService from "../../../Service/ProductService";
import BrandService from "../../../Service/BrandService";
import OriginalService from "../../../Service/OriginalService";
import MaterialService from "../../../Service/MaterialService";
import CategoryService from "../../../Service/CategoryService";
import DiscountService from "../../../Service/DiscountService";

const { Option } = Select;

const ProductManagement = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [dateRange, setDateRange] = useState([moment(), moment()]); // Khởi tạo với giá trị mặc định là ngày hiện tại
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
    const [form] = Form.useForm();
    const pageSize = 10;
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [originals, setOriginals] = useState([]);
    const [brands, setBrands] = useState([]);
    const [discounts, setDiscounts] = useState([]);

    const fetchProduct = async (search = "", status = "all") => {
        setLoading(true);
        try {
            const data = await ProductService.getAllProduct();
            const filteredData = data.filter(product => {
                const matchesSearch = product.tenSp ? product.tenSp.toLowerCase().includes(search.toLowerCase()) : false;
                const matchesStatus = status === "all" || (status === "active" && product.trangThai === 1) || (status === "inactive" && product.trangThai === 0);
                return matchesSearch && matchesStatus;
            });
            setProducts(filteredData);
            message.success("Lấy danh sách sản phẩm thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscount = async () => {
        const data = await DiscountService.getAllDiscount();
        setDiscounts(data);
    };

    const fetchBrand = async () => {
        const data = await BrandService.getAllBrand();
        setBrands(data);
    };

    const fetchOriginal = async () => {
        const data = await OriginalService.getAllOriginal();
        setOriginals(data);
    };

    const fetchMaterial = async () => {
        const data = await MaterialService.getAllMaterial();
        setMaterials(data);
    };

    const fetchCategory = async () => {
        const data = await CategoryService.getAllCategory();
        setCategories(data);
    };


    useEffect(() => {
        fetchProduct();
        fetchMaterial();
        fetchCategory();
        fetchOriginal();
        fetchBrand();
        fetchDiscount();

    }, []);


    const openModal = (record = null) => {
        setModalVisible(true);
        setEditingProduct(record);
        if (record) {
            form.setFieldsValue({ ...record, trangThai: record.trangThai });
        } else {
            form.resetFields();
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for create:', values);
            const newProduct = {
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
            const response = await ProductService.createProduct(newProduct);
            console.log('Create response:', response);
            message.success("Thêm mới Sản Phẩm thành công");
            setModalVisible(false);
            fetchProduct(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };


    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Submitting values for update:', values);
            const updatedValues = {
                id: editingProduct.id,
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
            const response = await ProductService.updateProduct(editingProduct.id, updatedValues);
            console.log('Update response:', response);
            message.success("Cập nhật Sản Phẩm thành công");
            setModalVisible(false);
            fetchProduct(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data);
                message.error(`Lỗi: ${error.response.data}`);
            } else {
                message.error("Lỗi không xác định khi xử lý dữ liệu");
            }
        }
    };

    const handleOk = async () => {
        if (editingProduct) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleStatusChange = async (product, newStatus) => {
        try {
            const updateProduct = {
                ...product,
                trangThai: newStatus ? 1 : 0,
            };
            await ProductService.updateProduct(product.id, updateProduct);
            message.success("Chuyển trạng thái Sản Phẩm thành công");
            fetchProduct(searchTerm, statusFilter); // Reload lại dữ liệu sau khi cập nhật
        } catch (error) {
            message.error("Lỗi khi chuyển trạng thái Danh Mục");
        }
    };

    const handleFilter = () => {
        fetchProduct(searchTerm, statusFilter); // Gọi hàm lọc khi người dùng nhấn nút Lọc
    };



    const handleUploadChange = ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj; // Lấy tệp gốc
            
            const reader = new FileReader();
            reader.onloadend = () => {
                // Cập nhật giá trị hình ảnh trong form là URL
                form.setFieldsValue({ imageDefaul: reader.result }); // Lưu trữ URL hình ảnh
                setImageUrl(reader.result); // Cập nhật state với URL hình ảnh
            };

            if (file) {
                reader.readAsDataURL(file); // Đọc tệp dưới dạng URL
            }
        } else {
            // Nếu không có tệp nào, đặt giá trị hình ảnh về null hoặc chuỗi rỗng
            form.setFieldsValue({ imageDefaul: '' });
            setImageUrl(''); // Reset lại URL hình ảnh
        }
    };


    const handleDateChange = (dates) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange(dates); // Cập nhật state với ngày chọn
        } else {
            setDateRange(null); // Đặt lại nếu không có ngày nào hợp lệ
        }
    };


    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
            width: 70,
            align: "center",
        },
        {
            title: "Mã Sản Phẩm",
            dataIndex: "maSp",
            key: "maSp",
            align: "center",
        },
        {
            title: "Hình Ảnh",
            dataIndex: "imageDefaul",
            key: "imageDefaul",
            render: (text) => <img src={text} alt="Product" style={{ width: 80, height: 80 }} />, // Hiển thị hình ảnh
            align: "center",

        },
        {
            title: "Tên Sản Phẩm",
            dataIndex: "tenSp",
            key: "tenSp",
            align: "center",
        },
        {
            title: "Thể Loại",
            dataIndex: "theLoai",
            key: "theLoai",
            align: "center",
        },
        {
            title: "Giá Bán",
            dataIndex: "giaBan",
            key: "giaBan",
            align: "center",
            render: (text) => text.toLocaleString("vi-VN") + " VNĐ", // Định dạng giá
        },
        {
            title: "Ngày Thêm",
            dataIndex: "ngayThem",
            key: "ngayThem",
            render: (text) => text ? moment(text).format('DD/MM/YYYY') : '',
            align: "center",
        },
        {
            title: "Trạng Thái",
            dataIndex: "trangThai",
            key: "trangThai",
            render: (text, record) => (
                <Switch checked={text === 1} onChange={(checked) => handleStatusChange(record, checked)} />
            ),
            align: "center",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button
                    className="button-s"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => openModal(record)}
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        marginRight: 10,
                    }}
                >
                    Sửa
                </Button>
            ),
            align: "center",
        },
    ];

    return (
        <div className="product-management">
            <h2>Quản Lý Sản Phẩm</h2>
            <div className="product-management-container">
                <div className="sidebar">
                    <h2>Bộ lọc</h2>
                    <Input
                        placeholder="Tìm kiếm tên sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <Select
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: "100%", marginTop: 10 }}
                    >
                        <Option value="all">Tất cả</Option>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Ngừng hoạt động</Option>
                    </Select>


                    <Button className="button" type="primary" onClick={handleFilter} style={{ marginTop: 10 }}>
                        Lọc
                    </Button>
                </div>

                <div className="main-content">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ marginBottom: "20px" }}
                        onClick={() => openModal()}
                        className="button"
                    >
                        Thêm sản phẩm mới
                    </Button>

                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: products.length,
                            onChange: (page) => setCurrentPage(page),
                        }}
                    />

                    <Modal
                        title={editingProduct ? "Cập nhật Sản Phẩm" : "Thêm mới Sản Phẩm"}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        <Form form={form} layout="vertical" onFinish={handleOk}>
                            <Form.Item
                                label="Mã Sản Phẩm"
                                name="maSp"
                                rules={[{ required: true, message: "Vui lòng nhập Mã Sản Phẩm" }]}
                            >
                                <Input placeholder="Nhập tên Sản Phẩm" />
                            </Form.Item>


                            <Form.Item
                                label="Hình Ảnh"
                                name="imageDefaul"
                                rules={[{ required: true, message: "Vui lòng tải lên Hình Ảnh" }]}
                            >
                                <Upload
                                    name="image"
                                    listType="picture"
                                    beforeUpload={(file) => {
                                        return false; // Ngăn chặn upload tự động
                                    }}
                                    onChange={handleUploadChange} // Gọi hàm xử lý thay đổi khi có tệp được chọn
                                    maxCount={1} // Giới hạn chỉ một file
                                    accept="image/*" // Chấp nhận chỉ các file hình ảnh
                                >
                                    <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                                </Upload>
                            </Form.Item>


                            <Form.Item
                                label="Tên Sản Phẩm"
                                name="tenSp"
                                rules={[{ required: true, message: "Vui lòng nhập tên Sản Phẩm" }]}
                            >
                                <Input placeholder="Nhập tên Sản Phẩm" />
                            </Form.Item>


                            <Form.Item label="Thể Loại"
                                name="theLoai"
                                rules={[{ required: true, message: "Vui lòng nhập Thể loại của sản phẩm" }]}>
                                <Input placeholder="Thể loại Nam hoặc Nữ" />
                            </Form.Item>


                            <Form.Item
                                label="Giá Bán"
                                name="giaBan"
                                rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
                            >
                                <Input placeholder="Nhập giá bán Sản Phẩm" />
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


                            <Form.Item
                                label="Giá Nhập"
                                name="giaNhap"
                                rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
                            >
                                <Input placeholder="Nhập giá bán" />
                            </Form.Item>


                            <Form.Item label="Đơn Giá Khi Giảm" name="donGiaKhiGiam">
                                <Input placeholder="Nhập đơn giá khi giảm" />
                            </Form.Item>


                            <Form.Item label="Danh Mục" name="idDm" rules={[{ required: true }]}>
                                <Select placeholder="Chọn Danh Mục">
                                    {categories.map(dm => (
                                        <Option key={dm.id} value={dm.id}>{dm.tenDanhMuc}</Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <Form.Item label="Thương Hiệu" name="idTh" rules={[{ required: true }]}>
                                <Select placeholder="Chọn Thương Hiệu">
                                    {brands.map(th => (
                                        <Option key={th.id} value={th.id}>{th.tenThuongHieu}</Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <Form.Item label="Giảm Giá" name="idGg" rules={[{ required: true }]}>
                                <Select placeholder="Chọn Giảm Giá">
                                    {discounts.map(gg => (
                                        <Option key={gg.id} value={gg.id}>{gg.tenGiamGia}</Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <Form.Item label="Xuất Xứ" name="idXx" rules={[{ required: true }]}>
                                <Select placeholder="Chọn Xuất Xứ">
                                    {originals.map(xx => (
                                        <Option key={xx.id} value={xx.id}>{xx.tenXuatXu}</Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <Form.Item label="Chất Liệu" name="idCl" rules={[{ required: true }]}>
                                <Select placeholder="Chọn chất liệu">
                                    {materials.map(cl => (
                                        <Option key={cl.id} value={cl.id}>{cl.tenChatLieu}</Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <Form.Item label="Ngày Thêm Giảm Giá" name="ngayThemGiamGia">
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    value={dateRange}
                                    onChange={handleDateChange}
                                    style={{ marginBottom: '20px' }}
                                />
                            </Form.Item>


                            <Form.Item label="Mô tả" name="moTa">
                                <Input.TextArea placeholder="Nhập mô tả cho sản phẩm" rows={4} />
                            </Form.Item>

                            <Form.Item label="Trạng thái" name="trangThai" initialValue={1}>
                                <Radio.Group style={{ display: "flex", flexDirection: "row" }}>
                                    <Radio value={1}>Hoạt động</Radio>
                                    <Radio value={0}>Không hoạt động</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <Button
                                        onClick={() => setModalVisible(false)}
                                        style={{ flex: 1, height: '40px' }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ flex: 1, height: '40px' }}
                                    >
                                        Lưu
                                    </Button>
                                </div>
                            </Form.Item>


                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
