import React, { useState } from "react";
import "./Checkout.css";
import Anh from "../Admin/Anh1.png";
import CustomHeader from "../../Layouts/Header/Header";

function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState("Giao hàng");
  const [promoMode, setPromoMode] = useState(null); // 'input' hoặc 'select'
  const [promoCode, setPromoCode] = useState("");
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const provinces = {
    "Hà Nội": {
      districts: {
        "Quận Ba Đình": ["Phường Cống Vị", "Phường Đội Cấn", "Phường Liễu Giai"],
        "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Buồm", "Phường Chương Dương"],
        "Quận Tây Hồ": ["Phường Quảng An", "Phường Nhật Tân", "Phường Thụy Khuê"],
        "Quận Long Biên": ["Phường Gia Thụy", "Phường Cự Khối", "Phường Bồ Đề"],
        // Thêm các quận khác ở Hà Nội
      }
    },
    "TP. Hồ Chí Minh": {
      districts: {
        "Quận 1": ["Phường Bến Nghé", "Phường Nguyễn Thái Bình", "Phường Đa Kao"],
        "Quận 2": ["Phường An Phú", "Phường Bình Trưng Đông", "Phường Thạnh Mỹ Lợi"],
        "Quận 3": ["Phường Võ Thị Sáu", "Phường Tân Định", "Phường Nguyễn Thái Bình"],
        "Quận 4": ["Phường 1", "Phường 2", "Phường 3"],
        // Thêm các quận khác ở TP.HCM
      }
    },
    "Đà Nẵng": {
      districts: {
        "Quận Hải Châu": ["Phường Thuận Phước", "Phường Phước Ninh", "Phường Hòa Thuận Tây"],
        "Quận Sơn Trà": ["Phường Mỹ An", "Phường Thọ Quang", "Phường An Hải Tây"],
        "Quận Ngũ Hành Sơn": ["Phường Hòa Quý", "Phường Khuê Mỹ", "Phường Mỹ An"],
        "Quận Liên Chiểu": ["Phường Hòa Minh", "Phường Liên Chiểu", "Phường Thanh Khê"],
        // Thêm các quận khác ở Đà Nẵng
      }
    },
    "Cần Thơ": {
      districts: {
        "Quận Ninh Kiều": ["Phường Cái Khế", "Phường An Hội", "Phường An Lạc"],
        "Quận Bình Thủy": ["Phường Bình Thủy", "Phường Long Hòa", "Phường Trà An"],
        "Quận Cái Răng": ["Phường Hưng Phú", "Phường Lê Bình", "Phường Cái Răng"],
        "Quận Ô Môn": ["Phường Phước Thới", "Phường Thới An", "Phường Trường Lạc"],
        // Thêm các quận khác ở Cần Thơ
      }
    },
    "An Giang": {
      districts: {
        "Thành phố Long Xuyên": ["Phường Mỹ Long", "Phường Mỹ Quý", "Phường Bình Đức"],
        "Huyện Châu Đốc": ["Xã Châu Phú", "Xã Vĩnh Tế", "Xã Tân An"],
        "Huyện Tân Châu": ["Xã Tân Lập", "Xã Tân Phú", "Xã Tân Thành"],
        "Huyện Phú Tân": ["Xã Phú Hữu", "Xã Phú Thạnh", "Xã Phú Sơn"],
        // Thêm các quận khác ở An Giang
      }
    },
    "Bà Rịa - Vũng Tàu": {
      districts: {
        "Thành phố Vũng Tàu": ["Phường 1", "Phường 2", "Phường 3"],
        "Huyện Long Điền": ["Xã Phước Hưng", "Xã An Nhứt", "Xã Bình Giã"],
        "Huyện Xuyên Mộc": ["Xã Phước Tỉnh", "Xã Bình Châu", "Xã Hòa Hiệp"],
        // Thêm các quận khác ở Bà Rịa - Vũng Tàu
      }
    },
    "Bắc Giang": {
      districts: {
        "Thành phố Bắc Giang": ["Phường Xương Giang", "Phường Trần Phú", "Phường Lê Lợi"],
        "Huyện Lạng Giang": ["Xã Tân Thanh", "Xã Thái Hòa", "Xã Dương Đức"],
        "Huyện Yên Dũng": ["Xã Nội Hoàng", "Xã Tiến Thắng", "Xã Tiến Dũng"],
        // Thêm các quận khác ở Bắc Giang
      }
    },
    "Bắc Kạn": {
      districts: {
        "Thành phố Bắc Kạn": ["Phường Xuất Hóa", "Phường Sông Cầu", "Phường Phùng Chí Kiên"],
        "Huyện Ba Bể": ["Xã Phúc Lộc", "Xã Hà Hiệu", "Xã Cao Trĩ"],
        "Huyện Chợ Mới": ["Xã Đồng Thắng", "Xã An Thắng", "Xã Yên Hòa"],
        // Thêm các quận khác ở Bắc Kạn
      }
    },
    "Bạc Liêu": {
      districts: {
        "Thành phố Bạc Liêu": ["Phường 1", "Phường 2", "Phường 3"],
        "Huyện Hòa Bình": ["Xã Hòa Bình", "Xã Vĩnh Hưng", "Xã Tân Long"],
        "Huyện Đông Hải": ["Xã Vĩnh Lộc", "Xã Long Điền", "Xã Hòa Tân"],
        // Thêm các quận khác ở Bạc Liêu
      }
    },
    "Bến Tre": {
      districts: {
        "Thành phố Bến Tre": ["Phường 1", "Phường 2", "Phường 3"],
        "Huyện Châu Thành": ["Xã Tân Phú", "Xã Phú Hưng", "Xã Quới Sơn"],
        "Huyện Ba Tri": ["Xã An Nhơn", "Xã An Bình", "Xã Định Thủy"],
        // Thêm các quận khác ở Bến Tre
      }
    },
    "Bình Dương": {
      districts: {
        "Thành phố Thủ Dầu Một": ["Phường Phú Hòa", "Phường Hiệp Thành", "Phường Tương Bình Hiệp"],
        "Huyện Dĩ An": ["Phường An Bình", "Phường Tân Đông Hiệp", "Phường Bình Thắng"],
        "Huyện Bến Cát": ["Xã An Tây", "Xã Phú An", "Xã Chánh Phú Hòa"],
        // Thêm các quận khác ở Bình Dương
      }
    },
    "Bình Định": {
      districts: {
        "Thành phố Quy Nhơn": ["Phường Ghềnh Ráng", "Phường Quang Trung", "Phường Trần Phú"],
        "Huyện Hoài Nhơn": ["Xã Hoài Mỹ", "Xã Hoài Châu", "Xã Hoài Đức"],
        "Huyện Phù Cát": ["Xã Cát Tường", "Xã Cát Chánh", "Xã Cát Minh"],
        // Thêm các quận khác ở Bình Định
      }
    },
    // Tiếp tục thêm các tỉnh thành còn lại...
  };
  

  // Mock dữ liệu sản phẩm
  const product = {
    id: 1,
    name: "Áo Thun Nike Nam",
    size: "X1",
    color: "Đỏ",
    price: 139,
    discount: selectedPromo ? selectedPromo.discount : 0, // Discount theo mã khuyến mãi
    image: "https://via.placeholder.com/80",
  };

  // Tính tổng tiền
  const totalPrice = product.price - (product.price * product.discount) / 100;

  // Mock mã khuyến mãi
  const promoOptions = [
    { id: "promo1", code: "SALE50", discount: 50 },
    { id: "promo2", code: "SALE30", discount: 30 },
    { id: "promo3", code: "SALE10", discount: 10 },
  ];

  return (
    <div>
      <CustomHeader />
    <div className="checkout-container">
      
      <div className="checkout-form">
        <h1>Thanh Toán</h1>

        {/* Thông tin liên hệ */}
        <div className="section">
          <h2>1. Thông Tin Liên Hệ</h2>
          <div className="input-row">
            <div className="input-group">
              <label>Họ</label>
              <input type="text" placeholder="Nhập họ" />
            </div>
            <div className="input-group">
              <label>Tên</label>
              <input type="text" placeholder="Nhập tên" />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Số điện thoại</label>
              <input type="text" placeholder="+84 xxx-xxx-xxx" />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="example@gmail.com" />
            </div>
          </div>
        </div>

        {/* Phương thức giao hàng */}
        <div className="section">
          <h2>2. Phương Thức Giao Hàng</h2>
          <div className="delivery-options">
            <button
              className={deliveryMethod === "Nhận tại cửa hàng" ? "active" : ""}
              onClick={() => setDeliveryMethod("Nhận tại cửa hàng")}
            >
              Nhận tại cửa hàng
            </button>
            <button
              className={deliveryMethod === "Giao hàng" ? "active" : ""}
              onClick={() => setDeliveryMethod("Giao hàng")}
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9695258488194!2d106.653628!3d10.776678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMTDCsDQ2JzM2LjAiTiAxMDbCsDM5JzIwLjYiRQ!5e0!3m2!1sen!2s!4v1687981246015"
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
                  <input type="date" disabled={deliveryMethod !== "Giao hàng"} />
                </div>
                <div className="input-group">
                  <label>Khung giờ thuận tiện</label>
                  <input
                    type="text"
                    placeholder="1 pm - 6 pm"
                    disabled={deliveryMethod !== "Giao hàng"}
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Thành phố</label>
                  <select disabled={deliveryMethod !== "Giao hàng"}>
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Quận/Huyện</label>
                  <select disabled={deliveryMethod !== "Giao hàng"}>
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Phường/Xã</label>
                  <select disabled={deliveryMethod !== "Giao hàng"}>
                    <option>Hà Nội</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ giao hàng"
                    disabled={deliveryMethod !== "Giao hàng"}
                  />
                </div>
                {/* <div className="input-group">
                  <label>Mã bưu điện</label>
                  <input
                    type="text"
                    placeholder="45463"
                    disabled={deliveryMethod !== "Giao hàng"}
                  />
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="order-summary">
        <h2>Đơn Hàng</h2>
        <div className="order-item">
          <img src={product.image} alt="Sản phẩm" />
          <div>
            <p>{product.name}</p>
            <p>Kích thước: {product.size}</p>
            <p>Màu sắc: {product.color}</p>
          </div>
          <p>{product.price}$</p>
        </div>

        {/* Mã khuyến mãi */}
        <div className="promo-code">
          <h3>Mã Khuyến Mãi</h3>
          <div className="promo-options">
            <button onClick={() => setPromoMode("input")}>Nhập mã khuyến mãi</button>
            <button onClick={() => setPromoMode("select")}>Chọn mã khuyến mãi</button>
          </div>
          {promoMode === "input" && (
            <div className="promo-input">
              <input
                type="text"
                placeholder="Nhập mã khuyến mãi"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={() => alert(`Áp dụng mã: ${promoCode}`)}>Áp dụng</button>
            </div>
          )}
          {promoMode === "select" && (
            <div className="promo-select">
              <h4>Chọn mã khuyến mãi:</h4>
              {promoOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedPromo(option)}
                  className={`promo-item ${
                    selectedPromo && selectedPromo.id === option.id ? "active" : ""
                  }`}
                >
                  {option.code} - Giảm {option.discount}%
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tổng cộng */}
        <div className="price-breakdown">
          <p>
            Tạm tính: <span>{product.price}$</span>
          </p>
          <p>
            Giảm giá ({product.discount}%):{" "}
            <span>-{(product.price * product.discount) / 100}$</span>
          </p>
          <p>
            Phí giao hàng: <span>Miễn phí</span>
          </p>
          <h3>
            Tổng cộng: <span>{totalPrice}$</span>
          </h3>
        </div>

        {/* Phương thức thanh toán */}
        <div className="section">
          <h2>Chọn Phương Thức Thanh Toán</h2>
          <div className="payment-methods">
            <img
              src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
              alt="VNPay"
              onClick={() => setPaymentMethod("VNPay")}
            />
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png"
              alt="MoMo"
              onClick={() => setPaymentMethod("MoMo")}
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTdCon4JkMPIbQxhsM96S9uOgkHLd21dukRw&s"
              alt="Apple Pay"
              onClick={() => setPaymentMethod("Apple Pay")}
            />
          </div>
          {paymentMethod && (
            <div className="qrcode">
              <h4>Quét mã QR để thanh toán qua {paymentMethod}</h4>
              <img
                src={Anh}
                alt={`QR code for ${paymentMethod}`}
              />
            </div>
          )}
        </div>
        <button className="checkout-button">Đặt Hàng →</button>
        <p className="terms">
          Bằng việc xác nhận đơn hàng, tôi đồng ý với{" "}
          <a href="#">điều khoản sử dụng</a>.
        </p>
      </div>
    </div>
    </div>
  );
}

export default Checkout;
