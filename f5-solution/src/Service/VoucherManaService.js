import http from "../common/http-common"; // Sử dụng http từ http-common

const VOUCHER_API = "VouCher"; // Endpoint cơ bản

const voucherService = {
  // Hàm lấy danh sách voucher
  getVouchers: async () => {
    try {
      const response = await http.get("VouCher");
      return response.data;
    } catch (error) {
      console.error("Get vouchers error:", error);
      throw error;
    }
  },

  // Hàm lấy voucher theo mã
  

  // Hàm tạo voucher mới
  createVoucher: async (voucherData) => {
    try {
      const response = await http.post( "VouCher", voucherData);
      return response.data;
    } catch (error) {
      console.error("Create voucher error:", error);
      throw error;
    }
  },

  // Hàm cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await http.put(`VouCher/${id}`, voucherData);
      return response.data;
    } catch (error) {
      console.error("Update voucher error:", error);
      throw error;
    }
  },
};

export default voucherService;
