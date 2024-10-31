import http from "../common/http-common"; // Import http từ http-common
const MauSacService = {
     // Hàm tạo mới thuộc tính
     createMauSac: async (mauSacData) => {
          try {
               const response = await http.post('MauSac', mauSacData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateMauSac: async (id, mauSacData) => {
          try {
              const response = await http.put(`MauSac/${id}`, mauSacData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getMauSacById: async (id) => {
          try {
               const response = await http.get(`MauSac/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllMauSac: async () => {
          try {
               const response = await http.get('MauSac'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default MauSacService;