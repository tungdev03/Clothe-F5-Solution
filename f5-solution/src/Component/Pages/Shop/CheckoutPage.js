import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { Button, message } from "antd";
import Anh from "../Admin/Anh1.png";
import CustomHeader from "../../Layouts/Header/Header";
import AddressFormModal from "../Shop/AddressForm";
import DiaChiService from "../../../Service/DiaChiService";
import GioHangService from '../../../Service/GioHangService';

function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState("Giao hàng");
  
  
  const [discount, setDiscount] = useState(0); 
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [TenNguoiNhan, setTenNguoiNhan] = useState("");
  const [SdtNguoiNhan, setSdtNguoiNhan] = useState("");
  const [NgayNhan, setNgayNhan] = useState("");
  const [GhiChu, setGhiChu] = useState("");
  const [voucherData, setVoucherData] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [error, setError] = useState({
    TenNguoiNhan: "",
    SdtNguoiNhan: "",
    NgayNhan: "",
    GhiChu: "",
  });
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.IdKhachhang); // Set the userId from local storage
        fetchCartData(user.IdKhachhang);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchWards = async () => {
        try {
          const data = await DiaChiService.getAddressById(userId);
          setAddresses(data);
          console.log(data); // Ensure 'data' contains the expected list of addresses
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
      fetchWards();
    }
  }, [userId]);
  useEffect(() => {
    if (voucherData) {
      console.log("Voucher đã áp dụng:", voucherData); // Kiểm tra giá trị voucherData
    }
  }, [voucherData]);

  const handleVoucher = async () => {
    try {
      // Gọi API để lấy dữ liệu voucher dựa trên mã voucher
      const data = await GioHangService.getMaVouchers(voucherCode);
  
      // Kiểm tra nếu không tìm thấy voucher
      if (!data) {
        message.warning("Mã voucher không tồn tại."); // Show a warning message instead of an alert
        return;
      }
  
      // Lấy ngày bắt đầu và ngày kết thúc từ dữ liệu voucher
      const ngayBatDau = new Date(data.ngayBatDau);
      const ngayKetThuc = new Date(data.ngayKetThuc);
      const currentDate = new Date(); // Ngày hiện tại
  
      // Kiểm tra nếu voucher chưa bắt đầu
      if (currentDate < ngayBatDau) {
        message.warning("Voucher chưa đến ngày bắt đầu.");
        return;
      }
  
      // Kiểm tra nếu voucher đã hết hạn
      if (currentDate > ngayKetThuc) {
        message.warning("Voucher đã hết hạn.");
        return;
      }
  
      // Kiểm tra nếu số lượng mã nhỏ hơn hoặc bằng 0
      if (data.soLuongMa <= 0) {
        message.warning("Voucher đã hết số lượng.");
        return;
      }
  
      // Kiểm tra nếu subtotal không đủ điều kiện hóa đơn tối thiểu
      if (subtotal < data.dieuKienToiThieuHoaDon) {
        message.warning(`Tổng giá trị đơn hàng phải lớn hơn hoặc bằng ${data.dieuKienToiThieuHoaDon}.`);
        return;
      }
  
      // Nếu tất cả điều kiện hợp lệ, cập nhật voucher
      setVoucherData(data);
      console.log(data); 
      message.success("Áp dụng voucher thành công!");
      const calculatedDiscount = data.hinhThucGiam === 1
        ? (subtotal * data.giaTriGiam) / 100 // Percentage discount
        : data.giaTriGiam; // Fixed amount discount
      setDiscount(calculatedDiscount);
    } catch (error) {
      console.error("Lỗi khi kiểm tra voucher:", error);
      message.error("Đã xảy ra lỗi trong quá trình kiểm tra voucher.");
    }
  };
  
  
  const fetchCartData = async (userId) => {
    try {
        const data = await GioHangService.getAllGioHang(userId);

        // Kiểm tra nếu giỏ hàng rỗng
        if (!data || data.length === 0) {
            setCartItems([]); // Đảm bảo giỏ hàng được đặt thành mảng trống
            message.info("Giỏ hàng của bạn đang rỗng."); // Hiển thị thông báo
            return;
        }

        // Chuyển đổi dữ liệu giỏ hàng thành cấu trúc mong muốn
        const mappedData = data.map((item) => ({
            Anh: item.hinhAnh || "/images/default-product.jpg", // Hình ảnh mặc định
            TenSanPham: item.tenSp || "Sản phẩm không xác định",
            Size: item.tenSize || "Không có",
            Color: item.tenMauSac || "Không có",
            Price: item.tongTien || 0,
        }));

        console.log("Fetched Cart Data:", data);
        setCartItems(mappedData); // Cập nhật dữ liệu giỏ hàng
    } catch (error) {
        console.error("Failed to fetch cart items:", error);
        message.error("Không thể tải giỏ hàng. Vui lòng thử lại.");
    }
};

const handlePlaceOrder = async () => {
  let formIsValid = true;
  let errorObj = {
    TenNguoiNhan: "",
    SdtNguoiNhan: "",
    NgayNhan: "",
    GhiChu: "",
  };

  // Kiểm tra các trường nhập liệu bắt buộc
  if (!TenNguoiNhan) {
    formIsValid = false;
    errorObj.TenNguoiNhan = "Vui lòng nhập tên!";
  }

  if (!SdtNguoiNhan) {
    formIsValid = false;
    errorObj.SdtNguoiNhan = "Vui lòng nhập số điện thoại!";
  } else {
    // Kiểm tra định dạng số điện thoại
    const phonePattern = /^(\+84|84|0)(\d{9})$/;
    if (!phonePattern.test(SdtNguoiNhan)) {
      formIsValid = false;
      errorObj.SdtNguoiNhan = "Số điện thoại không hợp lệ!";
    }
  }

  if (!NgayNhan) {
    formIsValid = false;
    errorObj.NgayNhan = "Vui lòng chọn ngày nhận hàng!";
  }

  if (!GhiChu) {
    formIsValid = false;
    errorObj.GhiChu = "Vui lòng nhập !";
  }

  if (!formIsValid) {
    setError(errorObj);
    return; // Dừng lại nếu có lỗi
  }

  setLoading(true);

  const orderData = {
    IdDiaChi: selectedAddress,
    TenNguoiNhan: TenNguoiNhan,
    SdtNguoiNhan: SdtNguoiNhan,
    VoucherId: voucherData?.id || null,
    GhiChu: GhiChu,
    NgayNhanHang: NgayNhan,
  };

  try {
    const response = await GioHangService.placeOrder(userId, orderData);
    message.success("Đặt hàng thành công!");
    console.log(response);
    await fetchCartData(userId); // Cập nhật giỏ hàng sau khi đặt hàng thành công
  } catch (error) {
    setLoading(false);
    message.error("Đặt hàng không thành công. Vui lòng thử lại!");
    console.error(error);
  }
};



const handleDeliveryMethodChange = async (method) => { 
  setDeliveryMethod(method);

  if (method === "Nhận tại cửa hàng") {
    // Thiết lập các giá trị mặc định cho nhận tại cửa hàng
    const IdCuaHang = "00000000-0000-0000-0000-000000000000"; // Đặt GUID mặc định của cửa hàng
    setAddresses([{ id: IdCuaHang, diaChiChiTiet: "Cửa hàng BBQ - 123 Đường ABC, Quận 1, TP. Hồ Chí Minh" }]);
    setGhiChu("Nhận tại cửa hàng");
    setNgayNhan(new Date().toISOString().split("T")[0]); // Gán ngày hiện tại
  } else if (method === "Giao hàng") {
    try {
      // Lấy danh sách địa chỉ của khách hàng từ máy chủ
      const data = await DiaChiService.getAddressById(userId);
      if (data && data.length > 0) {
        setAddresses(data); // Cập nhật danh sách địa chỉ
        setSelectedAddress(data[0].id); // Đặt mặc định địa chỉ đầu tiên
      } else {
        setAddresses([]); // Xóa danh sách địa chỉ nếu không có
        message.info("Bạn chưa có địa chỉ nào, hãy thêm mới.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      message.error("Không thể tải danh sách địa chỉ. Vui lòng thử lại!");
    }

    // Xóa ghi chú và ngày nhận (nếu cần)
    setGhiChu("");
    setNgayNhan("");
  }
};



  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveAddress = (address) => {
    setIsModalVisible(false);
  };

  const handleSelectAddress = (id) => {
    console.log("Selected Address ID:", id);
    setSelectedAddress(id); // Set the selected address ID
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.Price, 0);
  const total = subtotal - discount;
  return (
    <div>
      <CustomHeader />
        <div className="checkout-container">
          <div className="checkout-form">
            <h1>Thanh Toán</h1>

            {/* Contact Information */}
            <div className="section">
                <h2>1. Thông Tin Liên Hệ</h2>
                <div className="input-row">
                <div className="input-group">
                      <label>Tên</label>
                      <input
                        type="text"
                        value={TenNguoiNhan}
                        onChange={(e) => setTenNguoiNhan(e.target.value)}
                        placeholder="Nhập tên"
                        required
                      />
                      {error.TenNguoiNhan && <span className="error-message">{error.TenNguoiNhan}</span>}
                    </div>
                    <div className="input-group">
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      value={SdtNguoiNhan}
                      onChange={(e) => setSdtNguoiNhan(e.target.value)}
                      placeholder="+84 xxx-xxx-xxx"
                      required
                      pattern="^(\+84|84|0)(\d{9})$"
                      title="Vui lòng nhập số điện thoại hợp lệ"
                      aria-required="true"
                    />
                    {error.SdtNguoiNhan && <span className="error-message">{error.SdtNguoiNhan}</span>}
                  </div>
                </div>
              </div>


            {/* Delivery Method */}
            <div className="section">
              <h2>2. Phương Thức Giao Hàng</h2>
              <div className="delivery-options">
                <button
                  className={deliveryMethod === "Nhận tại cửa hàng" ? "active" : ""}
                  onClick={() => handleDeliveryMethodChange("Nhận tại cửa hàng")}
                >
                  Nhận tại cửa hàng
                </button>
                <button
                  className={deliveryMethod === "Giao hàng" ? "active" : ""}
                  onClick={() => handleDeliveryMethodChange("Giao hàng")}
                >
                  Giao hàng
                </button>
              </div>

              {deliveryMethod === "Nhận tại cửa hàng" ? (
                <div className="store-info">
                  <h3>Thông Tin Cửa Hàng</h3>
                  <p>Cửa hàng BBQ - 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                  <iframe
                    title="Store Location"
                    src="https://www.google.com/maps/embed?pb=..."
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              ) : (
                <div className="input-fields">
                  <div className="input-row">
                  <div className="input-group">
                  <label>Ngày giao hàng</label>
                  <input 
                    type="date" 
                    value={NgayNhan} 
                    onChange={(e) => setNgayNhan(e.target.value)} 
                    disabled={deliveryMethod !== "Giao hàng"} 
                    required
                    min={new Date().toISOString().split("T")[0]} // Không cho phép chọn ngày quá khứ
                    aria-required="true"
                  />
                  {error.NgayNhan && <span className="error-message">{error.NgayNhan}</span>}
                </div>
                <div className="input-group">
                <label>Ghi chú (giờ thuận tiện)</label>
                <input 
                  type="text" 
                  value={GhiChu} 
                  onChange={(e) => setGhiChu(e.target.value)} 
                  placeholder="Khung giờ thuận tiện"
                  required
                />
                {error.GhiChu && <span className="error-message">{error.GhiChu}</span>}
              </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Địa chỉ</label>
                      <div>
                        {addresses.length > 0 ? (
                          addresses.map((address) => (
                            <button key={address.id} className={selectedAddress === address.id ? "selected" : ""} onClick={() => handleSelectAddress(address.id)}>
                              {address.diaChiChiTiet || 'No address available'}
                            </button>
                          ))
                        ) : (
                          <button>No address available</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="input-group">
                    <Button type="primary" onClick={handleOpenModal}>
                      Địa chỉ Khác
                    </Button>
                  </div>
                  <AddressFormModal visible={isModalVisible} onClose={handleCloseModal} onSave={handleSaveAddress} />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Đơn Hàng</h2>
            <div>
              {loading ? (
                <div className="loading-spinner">
                  <p>Loading cart items...</p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div className="order-item" key={index}>
                    <img src={item.Anh} alt={item.TenSanPham || "Product"} />
                    <div>
                      <p>{item.TenSanPham}</p>
                      <p>Size: {item.Size} | Màu sắc: {item.Color}</p>
                      <p>{item.Price}₫</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo Code */}
            <div className="section">
      <h2>3. Mã Khuyến Mãi</h2>
      <div className="promo-container">
        <div>
          <input
            type="text"
            placeholder="Nhập mã voucher"
            value={voucherCode} // Bind the input to voucherCode state
            onChange={(e) => setVoucherCode(e.target.value)} // Update voucherCode state when typing
          />
        </div>
        <button onClick={handleVoucher}>Áp dụng</button> {/* Trigger the handleVoucher function */}
      </div>
    </div>

            {/* Payment Method */}
            <div className="section">
              <h2>4. Phương Thức Thanh Toán</h2>
              <div className="payment-methods">
                <button onClick={() => setPaymentMethod("Credit Card")}>Thẻ tín dụng</button>
                <button onClick={() => setPaymentMethod("Cash on Delivery")}>Thanh toán khi nhận hàng</button>
              </div>
            </div>

            <div className="summary-total">
              <p>Tổng cộng: {subtotal}₫</p>
              <p>Giảm giá: {discount}₫</p>
              <p>Thành tiền: {total}₫</p>
            </div>

            <Button type="primary" onClick={handlePlaceOrder} loading={loading}>
              Đặt Hàng
            </Button>
          </div>
        </div>
    </div>
  );
}

export default Checkout;
