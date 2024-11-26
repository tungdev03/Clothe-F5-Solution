import React, { useEffect, useState } from "react";
import {
    Upload,
    Table,
    Button,
    Switch,
    Drawer,
    Form,
    Input,
    message,
    Select,
} from "antd";
import { EditOutlined, PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import "./ProductManagement.css";
import ProductService from "../../../Service/ProductService";
import BrandService from "../../../Service/BrandService";
import OriginalService from "../../../Service/OriginalService";
import MaterialService from "../../../Service/MaterialService";
import CategoryService from "../../../Service/CategoryService";
import DiscountService from "../../../Service/DiscountService";
import ColorService from "../../../Service/ColorService";
import SizeService from "../../../Service/SizeService";

const { Option } = Select;

const ProductManagement = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [dateRange, setDateRange] = useState([moment(), moment()]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [form] = Form.useForm();
    const pageSize = 10;
    const [materials, setMaterials] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([])
    const [categories, setCategories] = useState([]);
    const [originals, setOriginals] = useState([]);
    const [brands, setBrands] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [initialChiTietSanPhams, setInitialChiTietSanPhams] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [
                productData,
                discountData,
                brandData,
                originalData,
                materialData,
                categoryData,
                colorData,
                sizeData,
            ] = await Promise.all([
                ProductService.getAllProduct(),
                DiscountService.getAllDiscount(),
                BrandService.getAllBrand(),
                OriginalService.getAllOriginal(),
                MaterialService.getAllMaterial(),
                CategoryService.getAllCategory(),
                ColorService.getAllColor(),
                SizeService.getAllSize(),
            ]);
            setProducts(productData);
            setDiscounts(discountData);
            setBrands(brandData);
            setOriginals(originalData);
            setMaterials(materialData);
            setCategories(categoryData);
            setColors(colorData);
            setSizes(sizeData);
            message.success("Dữ liệu đã được tải thành công");
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = async (record = null) => {
        setDrawerVisible(true);
    
        if (record && record.id) {
            try {
                const productDetails = await ProductService.ViewProductDetail(record.id);
    
                if (productDetails) {
                    form.setFieldsValue({
                        ...productDetails,
                        maSp: record.maSp || "",
                        trangThai: productDetails.trangThai || 0,
                        sanPhamChiTiets: productDetails.sanPhamChiTiets || [],
                        tenSp: productDetails.tenSp || "",
                        giaNhap: productDetails.giaNhap !== undefined ? productDetails.giaNhap : 0,
                        giaBan: productDetails.giaBan || 0,
                        ngayThem: productDetails.ngayThem ? moment(productDetails.ngayThem) : null,
                        idDm: productDetails.idDm || null, // Danh Mục
                        idCl: productDetails.idCl || null, // Chất Liệu
                        moTa: productDetails.moTa || ""
                    });
                    setImageUrl(productDetails.imageDefaul || '');
                } else {
                    message.error('Không tìm thấy chi tiết sản phẩm.');
                }
            } catch (error) {
                message.error('Lỗi khi tải chi tiết sản phẩm');
            }
        } else {
            setEditingProduct(null);
            form.resetFields();
            setInitialChiTietSanPhams([]);
            setImageUrl('');
        }
    };

    const handleCreateOrUpdate = async () => {
        try {
            const values = await form.validateFields();
            const productData = {
                ...values,
                chiTietSanPhams: values.sanPhamChiTiets?.map(detail => ({
                    idMs: detail.id || null,
                    idSize: detail.id || null,
                    soLuongTon: detail.soLuongTon || 0,
                })) || []
            };

            if (editingProduct && editingProduct.id) {
                await ProductService.updateProduct(editingProduct.id, productData);
                message.success("Sản phẩm đã được cập nhật thành công");
            } else {
                await ProductService.createProduct(productData);
                message.success("Sản phẩm đã được tạo thành công");
            }

            form.resetFields();
            setDrawerVisible(false);
            fetchData();
        } catch (error) {
            if (error.response && error.response.data) {
                const validationErrors = error.response.data.errors;
                for (const key in validationErrors) {
                    if (validationErrors.hasOwnProperty(key)) {
                        message.error(`${key}: ${validationErrors[key].join(", ")}`);
                    }
                }
            } else {
                message.error("Không thể tạo hoặc cập nhật sản phẩm");
            }
        }
    };

    const handleStatusChange = async (product, newStatus) => {
        try {
            const chiTietSanPhams = product.chiTietSanPhams || [];
            const updatedProduct = {
                ...product,
                trangThai: newStatus ? 1 : 0,
                chiTietSanPhams: chiTietSanPhams.map(chiTietSanPham => ({
                    ...chiTietSanPham,
                    trangThai: newStatus ? 1 : 0
                }))
            };

            await ProductService.createProduct(updatedProduct);
            message.success('Chuyển trạng thái thành công');
            fetchData();
        } catch (error) {
            message.error('Lỗi khi chuyển trạng thái: ' + error.message);
        }
    };

    const handleFilter = () => {
        const filteredData = products.filter(product => {
            const matchesSearch = product.tenSp ? product.tenSp.toLowerCase().includes(searchTerm.toLowerCase()) : false;
            const matchesStatus = statusFilter === "all" || (statusFilter === "active" && product.trangThai === 1) || (statusFilter === "inactive" && product.trangThai === 0);
            return matchesSearch && matchesStatus;
        });
        setProducts(filteredData);
    };

    const handleUploadChange = ({ fileList }) => {
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj;
            const reader = new FileReader();
            reader.onloadend = () => {
                form.setFieldsValue({ imageDefaul: reader.result });
                setImageUrl(reader.result);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            form.setFieldsValue({ imageDefaul: '' });
            setImageUrl('');
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
            render: (text) => <img src={text} alt="Product" style={{ width: 80, height: 80 }} />,
            align: "center",
        },
        {
            title: "Tên Sản Phẩm",
            dataIndex: "tenSp",
            key: "tenSp",
            align: "center",
        },
        {
            title: "Số lượng tồn",
            dataIndex: "soLuongTon",
            key: "soLuongTon",
            align: "center",
            render: (text, record) => {
                const totalQuantity = record.sanPhamChiTiets?.reduce((sum, item) => sum + item.soLuongTon, 0);
                return totalQuantity ? totalQuantity : 0;
            },
        },
        {
            title: "Giá Bán",
            dataIndex: "giaBan",
            key: "giaBan",
            render: (text) => text.toLocaleString("vi-VN") + " VNĐ",
            align: "center",
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
                    style={{ backgroundColor: "#ffffff", color: "#000000", marginRight: 10 }}
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
                    <Drawer
                        title={editingProduct ? "Cập nhật Sản Phẩm" : "Thêm mới Sản Phẩm"}
                        placement="right"
                        open={drawerVisible}
                        onClose={() => setDrawerVisible(false)}
                        width={720}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleCreateOrUpdate}
                        >
                            <Form.Item
                                label="Mã Sản Phẩm"
                                name="maSp"
                                rules={[{ required: true, message: "Vui lòng nhập Mã Sản Phẩm" }]}
                            >
                                <Input placeholder="Nhập mã Sản Phẩm" />
                            </Form.Item>

                            <Form.Item
                                label="Hình Ảnh"
                                name="imageDefaul"
                                rules={[{ required: true, message: "Vui lòng tải lên Hình Ảnh" }]}
                            >
                                <Upload
                                    name="image"
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                    maxCount={1}
                                    accept="image/*"
                                    defaultFileList={
                                        editingProduct?.imageDefaul
                                            ? [
                                                {
                                                    uid: '-1',
                                                    name: 'Hình ảnh mặc định',
                                                    status: 'done',
                                                    url: editingProduct.imageDefaul,
                                                },
                                            ]
                                            : []
                                    }
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

                            <Form.Item
                                label="Thể Loại"
                                name="theLoai"
                                rules={[{ required: true, message: "Vui lòng nhập Thể loại của sản phẩm" }]}
                            >
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
                                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                            >
                                <Input type="date" placeholder="Chọn ngày thêm" />
                            </Form.Item>

                            <Form.Item
                                label="Giá Nhập"
                                name="giaNhap"
                                rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
                            >
                                <Input placeholder="Nhập giá nhập" />
                            </Form.Item>

                            <Form.Item
                                label="Đơn Giá Khi Giảm"
                                name="donGiaKhiGiam"
                            >
                                <Input placeholder="Nhập đơn giá khi giảm" />
                            </Form.Item>

                            <Form.Item
                                label="Danh Mục"
                                name="idDm"
                            >
                                <Select placeholder="Chọn Danh Mục">
                                    {categories.map(dm => (
                                        <Option key={dm.id} value={dm.id}>
                                            {dm.tenDanhMuc}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Chất Liệu"
                                name="idCl"
                                rules={[{ required: true, message: "Vui lòng chọn chất liệu" }]}
                            >
                                <Select placeholder="Chọn chất liệu">
                                    {materials.map(cl => (
                                        <Option key={cl.id} value={cl.id}>
                                            {cl.tenChatLieu}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Mô tả" name="moTa">
                                <Input.TextArea placeholder="Nhập mô tả cho sản phẩm" rows={4} />
                            </Form.Item>

                            <Form.List
                                name="sanPhamChiTiets"
                                initialValue={initialChiTietSanPhams}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{ marginBottom: 16 }}>
                                                <Form.Item
                                                    {...restField}
                                                    label="Màu sắc"
                                                    name={[name, 'id']}
                                                    rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
                                                >
                                                    <Select placeholder="Chọn Màu Sắc">
                                                        {colors.map(color => (
                                                            <Select.Option key={color.id} value={color.id}>
                                                                {color.tenMauSac}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    label="Kích thước"
                                                    name={[name, 'id']}
                                                    rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
                                                >
                                                    <Select placeholder="Chọn Kích Thước">
                                                        {sizes.map(size => (
                                                            <Select.Option key={size.id} value={size.id}>
                                                                {size.tenSize}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    label="Số lượng tồn"
                                                    name={[name, 'soLuongTon']}
                                                    rules={[{ required: true, message: "Vui lòng nhập số lượng tồn" }]}
                                                >
                                                    <Input min={0} type="number" style={{ width: "100%" }} />
                                                </Form.Item>

                                                <Form.Item>
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(name)}
                                                        icon={<DeleteOutlined />}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Form.Item>
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                Thêm Chi Tiết
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;