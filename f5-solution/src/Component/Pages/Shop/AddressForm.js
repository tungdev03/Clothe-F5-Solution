import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-provinces";
import DiaChiService from "../../../Service/DiaChiService"; // Import the addAddress function from your services
import "../Shop/AddressForm.css"; // Ensure CSS file is properly imported

function AddressFormModal({ visible, onClose, onSave }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(""); // Detailed address
  const [userId, setUserId] = useState(null); // User ID to associate with the address

  // Validation states
  const [errors, setErrors] = useState({});

  // Fetch user information from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.IdKhachhang); // Set the userId from local storage
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const data = await getDistrictsByProvinceCode(selectedProvince);
        setDistricts(data);
        setWards([]); // Reset wards when province changes
        setSelectedDistrict("");
        setSelectedWard("");
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const data = await getWardsByDistrictCode(selectedDistrict);
        setWards(data);
        setSelectedWard("");
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  const validateField = (fieldName, value) => {
    let error = "";
    if (fieldName === "selectedProvince" && !value) error = "Vui lòng chọn tỉnh/thành phố.";
    if (fieldName === "selectedDistrict" && !value) error = "Vui lòng chọn quận/huyện.";
    if (fieldName === "selectedWard" && !value) error = "Vui lòng chọn xã/phường.";
    if (fieldName === "selectedAddress" && !value.trim()) error = "Vui lòng nhập địa chỉ chi tiết.";
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSave = async () => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    // Check all fields before saving
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      message.error("Vui lòng kiểm tra và nhập đầy đủ thông tin.");
      return;
    }

    const provinceName = provinces.find((p) => p.code === selectedProvince)?.name || "";
    const address = {
      IdKh: userId,
      DiaChiChiTiet: selectedAddress,
      PhuongXa: wards.find((w) => w.code === selectedWard)?.name || "",
      QuanHuyen: districts.find((d) => d.code === selectedDistrict)?.name || "",
      TinhThanh: provinceName,
    };

    try {
      const newAddress = await DiaChiService.addAddress(address);
      message.success("Địa chỉ đã được thêm thành công.");
      onSave(newAddress);
      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
      message.error(error || "Lỗi khi thêm địa chỉ mới.");
    }
  };

  return (
    <Modal
      title="Chọn Địa Chỉ"
      visible={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Hủy"
    >
      <div>
        <div className="form-group">
          <label>Tỉnh/Thành phố</label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            onBlur={(e) => validateField("selectedProvince", e.target.value)}
            className={`select-custom-width ${errors.selectedProvince ? "error" : ""}`}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.selectedProvince && <p className="error-message">{errors.selectedProvince}</p>}
        </div>

        <div className="form-group">
          <label>Quận/Huyện</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            onBlur={(e) => validateField("selectedDistrict", e.target.value)}
            disabled={!selectedProvince}
            className={`select-custom-width ${errors.selectedDistrict ? "error" : ""}`}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.selectedDistrict && <p className="error-message">{errors.selectedDistrict}</p>}
        </div>

        <div className="form-group">
          <label>Xã/Phường</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            onBlur={(e) => validateField("selectedWard", e.target.value)}
            disabled={!selectedDistrict}
            className={`select-custom-width ${errors.selectedWard ? "error" : ""}`}
          >
            <option value="">Chọn xã/phường</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
          {errors.selectedWard && <p className="error-message">{errors.selectedWard}</p>}
        </div>

        <div className="form-group">
          <label>Địa chỉ chi tiết</label>
          <input
            type="text"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            onBlur={(e) => validateField("selectedAddress", e.target.value)}
            placeholder="Nhập địa chỉ chi tiết"
            className={`select-custom-width ${errors.selectedAddress ? "error" : ""}`}
          />
          {errors.selectedAddress && <p className="error-message">{errors.selectedAddress}</p>}
        </div>
      </div>
    </Modal>
  );
}

export default AddressFormModal;
