import http from "../common/http-common"; // Import http từ http-common
const ProductService = {
     createProduct: async (productData) => {
          try {
               const response = await http.post('SanPham', productData);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }         
     },
     
     updateProduct: async (id, productData) => {
          try {
              const response = await http.put(`SanPham/${id}`, productData);
              return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";             
          }     
     },

     // Hàm lấy thông tin thuộc tính theo Id
     getProductById: async (id) => {
          try {
               const response = await http.get(`SanPham/${id}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },

     // Hàm lấy danh sách tất cả các Chất liệu
     getAllProduct: async () => {
          try {
               const response = await http.get('SanPham/GetAll'); // Gọi API để lấy danh sách
               return response.data;
          } catch (error) {
               throw error.response?.data || "Lỗi không xác định";
          }
     },
};

export default ProductService;