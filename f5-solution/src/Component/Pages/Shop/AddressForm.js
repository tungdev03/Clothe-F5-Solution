import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "vn-provinces";
import  DiaChiService  from "../../../Service/DiaChiService"; // Import the addAddress function from your services
import '../Shop/AddressForm.css'; // Ensure CSS file is properly imported

function AddressFormModal({ visible, onClose, onSave }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(""); // Detailed address
  const [userId, setUserId] = useState(null); // User ID to associate with the address

  // Fetch user information from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
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

  const handleSave = async () => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    // Prepare the address object with the necessary fields
    const address = {
      IdKh: userId,  // User ID taken from localStorage
      DiaChiChiTiet: selectedAddress,  // Detailed address from the input field
      PhuongXa: wards.find((w) => w.code === selectedWard)?.name || "",  // Ward name
      QuanHuyen: districts.find((d) => d.code === selectedDistrict)?.name || "",  // District name
      TinhThanh: provinces.find((p) => p.code === selectedProvince)?.name || "",  // Province name
    };

    try {
      // Call the addAddress API method to save the address
      const newAddress = await DiaChiService.addAddress(address);
      message.success("Địa chỉ đã được thêm thành công.");
      onSave(newAddress); // Pass the newly added address to the parent component
      onClose(); // Close the modal after saving
    } catch (error) {
      message.error(error || "Lỗi khi thêm địa chỉ mới.");
    }
  };

  return (
    <Modal title="Chọn Địa Chỉ" visible={visible} onCancel={onClose} onOk={handleSave}>
      <div>
        <div className="form-group">
          <label>Tỉnh/Thành phố</label>
          <select 
            value={selectedProvince} 
            onChange={(e) => setSelectedProvince(e.target.value)} 
            className="select-custom-width"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quận/Huyện</label>
          <select 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(e.target.value)} 
            disabled={!selectedProvince} 
            className="select-custom-width"
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Xã/Phường</label>
          <select 
            value={selectedWard} 
            onChange={(e) => setSelectedWard(e.target.value)} 
            disabled={!selectedDistrict} 
            className="select-custom-width"
          >
            <option value="">Chọn xã/phường</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Địa chỉ chi tiết</label>
          <input
            type="text"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            placeholder="Nhập địa chỉ chi tiết"
            className="select-custom-width"
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddressFormModal;