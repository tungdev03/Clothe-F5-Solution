import http from "../common/http-common"; // Import http từ http-common
const DanhMucService = {
     // Hàm tạo mới thuộc tính
     createXuatXu: async (xuatXuData) => {
          try {
               const response = await http.post('XuatXu', xuatXuData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateXuatXu: async (id, xuatXuData) => {
          try {
              const response = await http.put(`XuatXu/${id}`, xuatXuData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getXuatXuById: async (id) => {
          try {
               const response = await http.get(`XuatXu/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllXuatXu: async () => {
          try {
               const response = await http.get('XuatXu'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default DanhMucService;