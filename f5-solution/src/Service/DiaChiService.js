import http from "../common/http-common"; // Import http from http-common

const AddressService = {
    // Get all addresses
    getAllAddresses: async () => {
        try {
            const response = await http.get('DiaChi'); // API endpoint to get all addresses
            return response.data; // Return the data from the response
        } catch (error) {
            throw error.response?.data || 'Lỗi không xác định'; // Handle errors
        }
    },

    // Get address by ID
    getAddressById: async (id) => {
        try {
            const response = await http.get(`DiaChi/${id}`); // API endpoint to get an address by ID
            return response.data; // Return the data from the response
        } catch (error) {
            throw error.response?.data || 'Lỗi khi lấy thông tin địa chỉ'; // Handle errors
        }
    },

    // Add a new address
    addAddress: async (addressData) => {
        try {
            const response = await http.post('DiaChi', addressData); // API endpoint to add a new address
            return response.data; // Return the added address
        } catch (error) {
            throw error.response?.data || 'Lỗi khi thêm địa chỉ mới'; // Handle errors
        }
    },

    // Update an existing address
    updateAddress: async (addressData) => {
        try {
            const response = await http.put('DiaChi', addressData); // API endpoint to update an address
            return response.data; // Return the updated address
        } catch (error) {
            throw error.response?.data || 'Lỗi khi cập nhật địa chỉ'; // Handle errors
        }
    },

    // Delete an address by ID
    deleteAddress: async (id) => {
        try {
            const response = await http.delete(`DiaChi/${id}`); // API endpoint to delete an address by ID
            return response.data; // Return the result of the deletion
        } catch (error) {
            throw error.response?.data || 'Lỗi khi xóa địa chỉ'; // Handle errors
        }
    }
};

// Export AddressService
export default AddressService;