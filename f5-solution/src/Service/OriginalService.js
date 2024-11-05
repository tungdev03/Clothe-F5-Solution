import http from "../common/http-common"; // Import http từ http-common
const OriginalService = {
     // Hàm tạo mới thuộc tính
     createOriginal: async (originalData) => {
          try {
               const response = await http.post('XuatXu', originalData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateOriginal: async (id, originalData) => {
          try {
              const response = await http.put(`XuatXu/${id}`, originalData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getOriginalById: async (id) => {
          try {
               const response = await http.get(`XuatXu/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllOriginal: async () => {
          try {
               const response = await http.get('XuatXu'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default OriginalService;