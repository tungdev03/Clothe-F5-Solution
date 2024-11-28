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
    Radio
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
    const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
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
        } catch (error) {
            message.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    console.log('initialChiTietSanPhams', initialChiTietSanPhams);

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
            console.log(data)
            message.success("Lấy danh sách sản phẩm thành công");
        } catch (error) {
            message.error("Lỗi khi lấy danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (record = null) => {
        try {
            // Mở Drawer và reset trạng thái
            setDrawerVisible(true);
            console.log("Mở modal với record ID:", record?.id);
            setEditingProduct(null);

            // Kiểm tra nếu có `record` và `id`
            if (record && record.id) {
                // Gọi API để lấy chi tiết sản phẩm
                const productDetails = await ProductService.ViewProductDetail(record.id);

                console.log("Chi tiết sản phẩm nhận được từ API:", productDetails);
                if (productDetails) {
                    // Thiết lập giá trị vào form
                    form.setFieldsValue({
                        ...productDetails,
                        maSp: productDetails.maSp || "",
                        trangThai: productDetails.trangThai || 0,
                        sanPhamChiTiets: productDetails.sanPhamChiTiets || [],
                        tenSp: productDetails.tenSp || "",
                        giaNhap: productDetails.giaNhap !== undefined ? productDetails.giaNhap : 0,
                        giaBan: productDetails.giaBan || 0,
                        ngayThem: productDetails.ngayThem ? moment(productDetails.ngayThem) : null,
                        idDm: productDetails.danhMuc?.id || null, // Danh Mục
                        idCl: productDetails.chatLieu?.id || null, // Chất Liệu
                        moTa: productDetails.moTa || "",
                    });
                    setInitialChiTietSanPhams(productDetails.sanPhamChiTiets)

                    // Cập nhật URL hình ảnh
                    setImageUrl(productDetails.imageDefaul || '');

                    // Lưu trạng thái bản ghi đang chỉnh sửa
                    setEditingProduct(record);
                } else {
                    message.error("Không tìm thấy chi tiết sản phẩm.");
                }
            } else {
                console.log("Không có ID sản phẩm, thiết lập để thêm mới sản phẩm.");
                // Nếu không có `record`, reset form để thêm mới sản phẩm
                form.resetFields();
                setInitialChiTietSanPhams([]);
                setImageUrl('');
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            message.error("Lỗi khi tải chi tiết sản phẩm");
        }
    };

    const handleCreateOrUpdate = async (values) => {
        console.log(values)
        // setProducts(update)
        const changeItem = values.sanPhamChiTiets.map((item => {
            console.log('item', item);
            const color = colors.find((cod => cod?.id === item?.mauSac))
            return {
                ...item,
                mauSac: { id: color.id, tenMauSac: color.tenMauSac },
            }
        }))
        console.log('changeItem', changeItem);

        values = {... values, sanPhamChiTiets:changeItem}
        // setProducts((prev=> ))
        const itemProd = products.find((item => {
            return item.id === editingProduct?.id
        }))
        //    const prod = products.map((item => {
        //         console.log('item', item);
        //         return {
        //             ...item,
        //             sanPhamChiTiets: item.id === values.id ? changeItem : item.sanPhamChiTiets
        //         }
        //     }))
        console.log("eeeeê",itemProd);

        try {
            console.log("Dữ liệu từ form trước khi xử lý:", itemProd);
            // const productData = {
            //     ...values,
            //     // id: editingProduct?.id || null,
            //     chiTietSanPhams: values.sanPhamChiTiets?.map(detail => ({
            //         idMauSac: detail.colors?.id || detail.idMs, // Chuyển idMs thành id
            //         idSize: detail.size?.id || detail.idSize, // Chuyển idSize thành id
            //         soLuongTon: detail.soLuongTon || 0,
            //         mauSac: {
            //             ...detail.mauSac,
            //             tenMauSac: detail.mauSac.tenMauSac
            //         }
            //     })) || []
            // };
            // setProducts(productData)

            // Kiểm tra nếu đang chỉnh sửa hay tạo mới
            if (editingProduct && editingProduct.id) {
                console.log("Cập nhật sản phẩm với ID:", editingProduct.id);
                await ProductService.createProduct(itemProd);
                message.success("Sản phẩm đã được cập nhật thành công");
            } else {
                console.log("Tạo mới sản phẩm:");
                await ProductService.createProduct(itemProd);
                console.log("Dữ liệu sản phẩm gửi đi:", itemProd);
                message.success("Sản phẩm đã được tạo thành công");
            }
            // Đặt lại form và đóng drawer
            form.resetFields();
            setDrawerVisible(false);
            fetchData(); // Tải lại dữ liệu
        } catch (error) {
            console.error("Lỗi khi tạo hoặc cập nhật sản phẩm:", error);

            // Kiểm tra lỗi do dữ liệu không đầy đủ từ form
            if (error.message) {
                message.error(error.message);
                return;
            }

            // Xử lý lỗi từ server (nếu có)
            if (error.response && error.response.data) {
                const validationErrors = error.response.data.errors;
                console.error("Lỗi từ server:", validationErrors);

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
    console.log("Dữ liệu sản phẩm sau khi xử lý:", products);




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
        fetchProduct(searchTerm, statusFilter);
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
            render: (value) => (value ? value.toLocaleString() : "N/A"),
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
                                rules={[{ required: false, message: "Vui lòng chọn ngày!" }]}
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
                            // initialValue={initialChiTietSanPhams} // Dữ liệu ban đầu
                            >
                                {(fields, { add, remove }) => {
                                    return (
                                        <>
                                            {fields.map(({ key, name, ...restField }, index) => {
                                                // Lấy dữ liệu hiện tại của sản phẩm chi tiết
                                                const currentChiTiet = fields[key] || {};
                                                const currentProd = initialChiTietSanPhams[key]
                                                console.log('currentProd', currentProd);

                                                return (
                                                    <div key={key} style={{ marginBottom: 16 }}>
                                                        {/* Màu sắc */}
                                                        <Form.Item
                                                            // {...restField}
                                                            label="Màu sắc"
                                                            name={[index, 'mauSac']}
                                                            rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
                                                            initialValue={currentProd?.mauSac?.id}
                                                        >
                                                            <Select placeholder="Chọn Màu Sắc" defaultValue={currentProd.mauSac.id}>
                                                                {colors.map(color => (
                                                                    <Select.Option key={color.id} value={color.id}>
                                                                        {color.tenMauSac}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>

                                                        {/* Kích thước */}
                                                        <Form.Item
                                                            // {...restField}
                                                            label="Kích thước"
                                                            name={[index, 'idSize']}
                                                            rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
                                                            initialValue={currentProd?.size?.id} // Dữ liệu mặc định
                                                        >
                                                            <Select placeholder="Chọn Kích Thước" defaultValue={currentProd.size.id}>
                                                                {sizes.map(size => (
                                                                    <Select.Option key={size.id} value={size.id}>
                                                                        {size.tenSize}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>

                                                        {/* Số lượng tồn */}
                                                        <Form.Item
                                                            // {...restField}
                                                            label="Số lượng tồn"
                                                            name={[index, 'soLuongTon']}
                                                            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn" }]}
                                                            initialValue={currentChiTiet.soLuongTon} // Dữ liệu mặc định
                                                        >
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                placeholder="Nhập số lượng tồn"
                                                                defaultValue={currentChiTiet.soLuongTon}
                                                            />
                                                        </Form.Item>

                                                        {/* Nút xóa */}
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
                                                );
                                            })}

                                            {/* Nút thêm chi tiết */}
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    icon={<PlusOutlined />}
                                                    className="w-full"
                                                >
                                                    Thêm Chi Tiết
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )
                                }}
                            </Form.List>
                            <Form.Item label="Trạng thái" name="trangThai" initialValue={1}>
                                <Radio.Group style={{ display: "flex", flexDirection: "row" }}>
                                    <Radio value={1}>Hoạt động</Radio>
                                    <Radio value={0}>Không hoạt động</Radio>
                                </Radio.Group>
                            </Form.Item>

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