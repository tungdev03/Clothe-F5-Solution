import http from "../common/http-common"; // Import http từ http-common
const BrandService = {
     // Hàm tạo mới thuộc tính
     createBrand: async (brandData) => {
          try {
               const response = await http.post('ThuongHieu', brandData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateBrand: async (id, brandData) => {
          try {
              const response = await http.put(`ThuongHieu/${id}`, brandData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getBrandById: async (id) => {
          try {
               const response = await http.get(`ThuongHieu/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllBrand: async () => {
          try {
               const response = await http.get('ThuongHieu'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default BrandService;