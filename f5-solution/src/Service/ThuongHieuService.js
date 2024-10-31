import http from "../common/http-common"; // Import http từ http-common
const ThuongHieuService = {
     // Hàm tạo mới thuộc tính
     createThuongHieu: async (thuongHieuData) => {
          try {
               const response = await http.post('ThuongHieu', thuongHieuData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateThuongHieu: async (id, thuongHieuData) => {
          try {
              const response = await http.put(`ThuongHieu/${id}`, thuongHieuData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getThuongHieuById: async (id) => {
          try {
               const response = await http.get(`ThuongHieu/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllThuongHieu: async () => {
          try {
               const response = await http.get('ThuongHieu'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default ThuongHieuService;