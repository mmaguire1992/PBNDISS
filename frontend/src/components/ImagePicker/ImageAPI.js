// Function to fetch images from Pexels API based on a query
const fetchImagesFromApi = async (query) => {
    // Retrieve Pexels API key from environment variables
    const apiKey = process.env.REACT_APP_PEXELS_API_KEY; 
    try {
        // Send request to Pexels API
        const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=100`, {
            headers: new Headers({
                Authorization: apiKey
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse response data
        const data = await response.json();
        // Return the array of photos
        return data.photos;
    } catch (error) {
        // Log error if fetching images fails
        console.error(`Fetching images failed:`, error);
        // Return an empty array
        return [];
    }
};

// Function to fetch category images
export const fetchCategoryImages = async (category) => {
    return fetchImagesFromApi(category);
};

// Function to fetch search images
export const fetchSearchImages = async (searchTerm) => {
    return fetchImagesFromApi(searchTerm);
};
