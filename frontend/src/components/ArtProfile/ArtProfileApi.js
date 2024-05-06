import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:4000/api';

// Function to fetch user's images
export const fetchImages = async (token) => {
    try {
        // Send GET request to fetch user's images
        const response = await axios.get(`${API_BASE_URL}/myImages`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        // Handle error if fetching images fails
        throw new Error('Failed to fetch images. Please try again later.');
    }
};

// Function to update image name
export const updateImageName = async (imageId, newName, token) => {
    try {
        // Send PATCH request to update image name
        const response = await axios.patch(`${API_BASE_URL}/updateImageName`, {
            imageId,
            newName,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        // Handle error if updating image name fails
        console.error('Error updating image name:', error);
        throw new Error('Failed to update image name. Please try again later.');
    }
};

// Function to delete an image
export const deleteImage = async (imageId, token) => {
    try {
        // Send DELETE request to delete image
        const response = await axios.delete(`${API_BASE_URL}/deleteImage`, {
            data: { imageId },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        // Handle error if deleting image fails
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image. Please try again later.');
    }
};
