import http from "../common/http-common"; // Import http từ http-common
const MaterialService = {
     // Hàm tạo mới thuộc tính
     createMaterial: async (materialData) => {
          try {
               const response = await http.post('ChatLieu', materialData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateMaterial: async (id, materialData) => {
          try {
              const response = await http.put(`ChatLieu/${id}`, materialData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getMaterialById: async (id) => {
          try {
               const response = await http.get(`ChatLieu/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
     
     // Hàm lấy danh sách tất cả các Chất liệu
     getAllMaterial: async () => {
          try {
               const response = await http.get('ChatLieu'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default MaterialService;