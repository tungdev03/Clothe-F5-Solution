import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from 'react-router-dom';
import { Button, message,notification } from "antd";
import Anh from "../Admin/Anh1.png";
import CustomHeader from "../../Layouts/Header/Header";
import AddressFormModal from "../Shop/AddressForm";
import DiaChiService from "../../../Service/DiaChiService";
import GioHangService from '../../../Service/GiohangService';
import GHN from '../../../Service/ghnAPI';
import vnPayService from '../../../Service/VNpayServices';
function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState("Giao hàng");

  const navigate = useNavigate();
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

  const [codFee, setCodFee] = useState(0); // Phí COD
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

  const [reloadAddresses, setReloadAddresses] = useState(false);

useEffect(() => {
  const fetchAddresses = async () => {
    if (userId) {
      try {
        const data = await DiaChiService.getAddressById(userId);
        setAddresses(data); 
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
  };

 
  if (reloadAddresses) {
    fetchAddresses();
    setReloadAddresses(false); 
  } else {
    fetchAddresses();
  }
}, [userId, reloadAddresses]); 
  useEffect(() => {
    if (voucherData) {
      console.log("Voucher đã áp dụng:", voucherData); 
    }
  }, [voucherData]);

  const handleVoucher = async () => {
    try {
      // Gọi API để lấy dữ liệu voucher dựa trên mã voucher
      const data = await GioHangService.getMaVouchers(voucherCode);

      // Kiểm tra nếu không tìm thấy voucher
      if (!data) {
        message.warning("Mã voucher không tồn tại."); 
        return;
      }

      // Lấy ngày bắt đầu và ngày kết thúc từ dữ liệu voucher
      const ngayBatDau = new Date(data.ngayBatDau);
      const ngayKetThuc = new Date(data.ngayKetThuc);
      const currentDate = new Date(); // Ngày hiện tại

      // Kiểm tra nếu voucher chưa bắt đầu
      if (currentDate < ngayBatDau) {
        notification.warning({ message: "Voucher chưa đến ngày bắt đầu."});
        return;
      }

      // Kiểm tra nếu voucher đã hết hạn
      if (currentDate > ngayKetThuc) {
        notification.warning({ message: "Voucher đã hết hạn."});
        return;
      }

      // Kiểm tra nếu số lượng mã nhỏ hơn hoặc bằng 0
      if (data.soLuongMa <= 0) {
        notification.warning({ message: "Voucher đã hết số lượng."});
        return;
      }

      // Kiểm tra nếu subtotal không đủ điều kiện hóa đơn tối thiểu
      if (subtotal < data.dieuKienToiThieuHoaDon) {
        notification.warning({ message: `Tổng giá trị đơn hàng phải lớn hơn hoặc bằng ${data.dieuKienToiThieuHoaDon}.`});
        return;
      }

      // Nếu tất cả điều kiện hợp lệ, cập nhật voucher
      setVoucherData(data);
      console.log(data);
      notification.success({ message: "Áp dụng voucher thành công!"});
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
      IdDiaChi: selectedAddress.id,
      TenNguoiNhan: TenNguoiNhan,
      SdtNguoiNhan: SdtNguoiNhan,
      VoucherId: voucherData?.id || null,
      GhiChu: GhiChu,
      TienShip: codFee||0,
      NgayNhanHang: NgayNhan,
    };

    console.log(orderData);
    try {
      const response = await GioHangService.placeOrder(userId, orderData);
      notification.success({ message: "Đặt hàng thành công!"});
      console.log(response);
      await fetchCartData(userId); // Cập nhật giỏ hàng sau khi đặt hàng thành công
      const orderId = userId
      navigate(`/order/${orderId}`);
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
      setSelectedAddress([{ id: IdCuaHang, diaChiChiTiet: "Cửa hàng BBQ - 123 Đường ABC, Quận 1, TP. Hồ Chí Minh" }]);
      setGhiChu("Nhận tại cửa hàng");
      setNgayNhan(new Date().toISOString().split("T")[0]); // Gán ngày hiện tại
    } else if (method === "Giao hàng") {
      try {
        // Lấy danh sách địa chỉ của khách hàng từ máy chủ
        const data = await DiaChiService.getAddressById(userId);
        if (data && data.length > 0) {
          setAddresses(data); // Cập nhật danh sách địa chỉ
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



  const handlePayment = async () => {
    let formIsValid = true;
    let errorObj = {
      TenNguoiNhan: "",
      SdtNguoiNhan: "",
      NgayNhan: "",
      GhiChu: "",
    };
  
    // Kiểm tra các trường nhập liệu bắt buộc
    if (!TenNguoiNhan || TenNguoiNhan.trim() === "") {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được để trống!";
    } else if (/\d/.test(TenNguoiNhan)) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được chứa số!";
    } else if (/[^a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(TenNguoiNhan)) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được chứa ký tự đặc biệt!";
    } else if (TenNguoiNhan.length < 2) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên phải có ít nhất 2 ký tự!";
    } else if (TenNguoiNhan.length > 50) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được vượt quá 50 ký tự!";
    } else if (TenNguoiNhan.trim() !== TenNguoiNhan || /\s{2,}/.test(TenNguoiNhan)) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được chứa khoảng trắng thừa!";
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
      errorObj.GhiChu = "Vui lòng nhập ghi chú!";
    }
  
    if (!formIsValid) {
      setError(errorObj);
      return; // Dừng lại nếu có lỗi
    }
  
    setLoading(true);
  
    try {
      // Gọi API VNPay để lấy URL thanh toán
      const orderData = {
        IdDiaChi: selectedAddress.id,
        TenNguoiNhan: TenNguoiNhan,
        SdtNguoiNhan: SdtNguoiNhan,
        VoucherId: voucherData?.id || null,
        GhiChu: GhiChu,
        TienShip: codFee || 0,
        NgayNhanHang: NgayNhan,
      };
  
      // Gọi API VNPayPayment và lấy URL thanh toán
      const paymentResponse = await vnPayService.VNPayPayment(userId, orderData);
       console.log("hhhhhhh", paymentResponse);
       window.location.href = paymentResponse;
    
      await fetchCartData(userId); // Cập nhật giỏ hàng sau khi đặt hàng thành công
      const orderId = userId
      navigate(`/order/${orderId}`);
    } catch (error) {
      setLoading(false);
      setError("Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveAddress = (address) => {
    setIsModalVisible(false); // Close the modal after saving the address
    setReloadAddresses(true); // Set reloadAddresses to true to trigger a re-fetch of the addresses
  };

  const calculateShipping = async (recipientAddress) => {
    setError(""); // Reset error message

    try {
        // Lấy thông tin địa chỉ của người nhận
        const recipientIds = await getAddressIds(recipientAddress);
        console.log('Provinces:', recipientIds);

        // Đặt sản phẩm mặc định (quần áo)
        const defaultItem = {
            name: "Quần Áo",                  // Tên sản phẩm
            quantity: 1,                       // Số lượng
            weight: 200,                       // Trọng lượng sản phẩm (gram)
            length: 10,                        // Chiều dài sản phẩm (cm)
            width: 20,                         // Chiều rộng sản phẩm (cm)
            height: 20                         // Chiều cao sản phẩm (cm)
        };

        // Tính tổng trọng lượng và kích thước của đơn hàng
        const totalWeight = defaultItem.weight * defaultItem.quantity;  // Tổng trọng lượng
        const totalLength = defaultItem.length * defaultItem.quantity; // Tổng chiều dài
        const totalWidth = defaultItem.width * defaultItem.quantity;   // Tổng chiều rộng
        const totalHeight = defaultItem.height * defaultItem.quantity; // Tổng chiều cao

        // Dữ liệu gửi yêu cầu tính phí vận chuyển
        const shippingData = {
            service_type_id: 2,  // ID loại dịch vụ vận chuyển
            from_district_id: 1442,  // ID quận/huyện của cửa hàng
            from_ward_code: "21211", // Mã phường xã của cửa hàng
            to_district_id: recipientIds.districtId,  // ID quận/huyện của người nhận
            to_ward_code: recipientIds.wardId,        // Mã phường xã của người nhận
            height: totalHeight,                           // Chiều cao tổng của gói hàng
            length: totalLength,                            // Chiều dài tổng của gói hàng
            weight: totalWeight,                           // Trọng lượng tổng của gói hàng
            width: totalWidth,                               // Chiều rộng tổng của gói hàng
            insurance_value: 0,                     // Giá trị bảo hiểm
            coupon: null,                           // Mã giảm giá (nếu có)
            items: [defaultItem]                      // Mảng sản phẩm mặc định (quần áo)
        };

        // Gửi yêu cầu đến GHN API để tính phí vận chuyển
        const response = await GHN.calculateShippingFee(shippingData);
        
        // Log phản hồi để debug
        console.log('Shipping Fee Response:', response);

        // Kiểm tra và lấy các phí từ phản hồi trả về
        if (response) {
          const shippingFee = response.total || response.service_fee || 0;  // Sử dụng 'total' hoặc 'service_fee'
          const codFee = response.service_fee || 0;   // Giả sử phí COD có thể tương đương phí dịch vụ

          if (shippingFee) {
             
              setCodFee(codFee);            // Lưu phí COD (nếu có)
          } else {
              console.error("Phí vận chuyển không tìm thấy trong phản hồi:", response);
              setError("Không thể tính phí vận chuyển.");
          }
      } else {
          setError("Không có phản hồi từ API GHN.");
      }

    } catch (error) {
        console.error("Lỗi khi tính phí vận chuyển và COD:", error);
        setError("Không thể tính phí vận chuyển. Vui lòng thử lại.");
    }
};





// Function to get address IDs (province, district, ward)
const getAddressIds = async (selected) => {
    const provinceId = await getProvinceId(selected.tinhThanh);
    const districtId = await getDistrictId(provinceId, selected.quanHuyen);
    const wardId = await getWardId(districtId, selected.phuongXa);
    return { provinceId, districtId, wardId };
};

// Function to get Province ID from GHN
const getProvinceId = async (tinhThanh) => {
    try {
        // Clean up the province name if it includes "Thành phố"
        const cleanedTinhThanh = tinhThanh.replace(/^(Thành phố |Tỉnh )/, '').trim();

        console.log('Searching for province:', cleanedTinhThanh);

        // Get the list of provinces from GHN API
        const provinces = await GHN.getProvinces();
        console.log('Provinces:', provinces);

        // Find the province by name
        const province = provinces.find(p => p.ProvinceName === cleanedTinhThanh);

        if (province) {
            console.log('Province found:', province.ProvinceID);
            return province.ProvinceID;
        } else {
            console.error('Province not found:', cleanedTinhThanh);
            return null;
        }
    } catch (error) {
        console.error('Error when fetching provinces:', error);
        return null;
    }
};

// Function to get District ID from GHN
const getDistrictId = async (provinceId, quanHuyen) => {
    try {
        console.log('Searching for district:', quanHuyen);

        const districts = await GHN.getDistricts(provinceId);
        console.log('Districts:', districts);

        const district = districts.find(d => d.DistrictName === quanHuyen);

        if (district) {
            console.log('District found:', district.DistrictID);
            return district.DistrictID;
        } else {
            console.error('District not found:', quanHuyen);
            return null;
        }
    } catch (error) {
        console.error('Error when fetching districts:', error);
        return null;
    }
};

// Function to get Ward ID from GHN
const getWardId = async (districtId, phuongXa) => {
    try {
        console.log('Searching for ward:', phuongXa);

        const wards = await GHN.getWards(districtId);
        console.log('Wards:', wards);

        const ward = wards.find(w => w.WardName === phuongXa);

        if (ward) {
            console.log('Ward found:', ward.WardCode);
            return ward.WardCode;
        } else {
            console.error('Ward not found:', phuongXa);
            return null;
        }
    } catch (error) {
        console.error('Error when fetching wards:', error);
        return null;
    }
};

// Function to handle address selection
const handleSelectAddress = (id) => {
    const selected = addresses.find(address => address.id === id);

    if (selected) {
        const { diaChiChiTiet, phuongXa, quanHuyen, tinhThanh } = selected;

        // Validate the selected address
        if (!diaChiChiTiet || !phuongXa || !quanHuyen || !tinhThanh) {
            console.error("Thông tin địa chỉ không đầy đủ:", selected);
            setError("Địa chỉ không hợp lệ. Vui lòng chọn địa chỉ khác.");
            return;
        }

        console.log("Selected Address ID:", selected.id);
        console.log("Selected District Name:", quanHuyen);

        setSelectedAddress(selected); // Update the selected address
        calculateShipping({ diaChiChiTiet, phuongXa, quanHuyen, tinhThanh }); // Pass full address to shipping calculation
    }
};

  const subtotal = cartItems.reduce((acc, item) => acc + item.Price, 0);
  const total = subtotal - discount+codFee;
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
                      <button
                        key={address.id}
                        className={selectedAddress?.id === address.id ? "selected" : ""}
                        onClick={() => handleSelectAddress(address.id)}
                      >
                        {address.diaChiChiTiet && address.phuongXa && address.quanHuyen&&address.tinhThanh 
                          ? `${address.diaChiChiTiet}, ${address.phuongXa}, ${address.quanHuyen},${address.tinhThanh}`
                          : 'Chưa có địa chỉ, Vui lòng thêm địa chỉ'}
                      </button>
                    ))
                  ) : (
                    <button>Chưa có địa chỉ, Vui lòng thêm địa chỉ</button>
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


          <div className="summary-total">
            <p>Tổng cộng: {subtotal}₫</p>
            <p>Giảm giá: {discount}₫</p>
            <p>Phí ship: {codFee ? `${codFee} ₫` : '0₫'}</p>
            <h3>Thành tiền: {total}₫</h3>
          </div>

          <Button type="primary" onClick={handlePlaceOrder} loading={loading}>
            Đặt Hàng
          </Button>
          <Button onClick={handlePayment}
            disabled={loading}>
            Thanh toán VNPay
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
