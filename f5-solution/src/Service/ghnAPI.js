import axios from "axios";

const GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const TOKEN = "70ed3014-b831-11ef-9747-3a0e216697cc"; // Thay bằng token của bạn

// Cấu hình Axios
const axiosInstance = axios.create({
  baseURL: GHN_API_URL,
  headers: {
    "Content-Type": "application/json",
    Token: TOKEN,
  },
});

const ghnAPI = {
  // Lấy danh sách tỉnh/thành phố
  getProvinces: async () => {
    try {
      const response = await axiosInstance.get("/master-data/province");
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy tỉnh/thành phố:", error);
      return null;
    }
  },

  // Lấy danh sách quận/huyện
  getDistricts: async (provinceId) => {
    try {
      const response = await axiosInstance.post("/master-data/district", { province_id: provinceId });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy quận/huyện:", error);
      return null;
    }
  },

  // Lấy danh sách phường/xã
  getWards: async (districtId) => {
    try {
      const response = await axiosInstance.post("/master-data/ward", { district_id: districtId });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy phường/xã:", error);
      return null;
    }
  },

  // Tính phí vận chuyển
  calculateShippingFee: async (data) => {
    try {
      const response = await axiosInstance.post("/v2/shipping-order/fee", data);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi tính phí vận chuyển:", error);
      return null;
    }
  },
};

export default ghnAPI;
