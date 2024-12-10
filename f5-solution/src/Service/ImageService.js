import http from "../common/http-common";

const ImageService = {
  createImage: async (imageData) => {
    try {
      const response = await http.post('Image', imageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  updateImage: async (id, imageData) => {
    try {
      const response = await http.put(`Image/${id}`, imageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  getAllImages: async () => {
    try {
      const response = await http.get('Image');
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  getNamebyId: async (imageId) => {
    try {
      const response = await http.get(`Image/GetNameById/${imageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },

  deleteImage: async (id) => {
    try {
      const response = await http.delete(`Image/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Lỗi không xác định";
    }
  },
};

export default ImageService;
