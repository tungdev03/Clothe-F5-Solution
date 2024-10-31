import http from "../common/http-common"; // Import http từ http-common
const SanPhamService = {
     createSanPham: async (sanPhamData) => {
          try {
               const response = await http.post('SanPham', sanPhamData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateSanPham: async (id, sanPhamData) => {
          try {
              const response = await http.put(`SanPham/${id}`, sanPhamData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getSanPhamById: async (id) => {
          try {
               const response = await http.get(`SanPham/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllSanPham: async () => {
          try {
               const response = await http.get('SanPham'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default SanPhamService;