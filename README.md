# Paint By Numbers (PBN) Application

This Paint By Numbers (PBN) application allows users to upload images and convert them into paint-by-number templates. It features full user authentication, image processing for creating paint-by-number outlines, and an ArtFeed for community engagement. Users can manage their art profiles and use an image picker for uploads.

## Features

- **User Authentication**: Secure signup, login, and logout functionalities using JWT authentication.
- **Image Processing**: Users can upload images which are then processed into paint-by-number outlines.
- **ArtFeed**: A social feature where users can post their completed artworks, like, and comment on other users' posts.
- **Art Profile**: Users can manage their own art profiles, updating information and keeping track of their submissions and likes.
- **Image Picker**: An intuitive interface for users to select and upload images from Pexel APIL.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose for object data modeling
- **Authentication**: bcrypt.js for password hashing, jsonwebtoken for managing JWTs
- **Image Processing**: Python scripts integrate with Node.js for processing images
- **Storage**: Google Cloud Storage for hosting uploaded and processed images
- **Other**: Dotenv for managing environment variables, multer for handling image uploads

## Getting Started

### Prerequisites

Ensure you have Node.js, MongoDB, and Python installed on your machine. You also need a Google Cloud account with access to storage buckets.

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:mmaguire1992/PBNDISS.git
   cd PBNDISS

   ```
2. **Install Node.js dependencies**
   npm install

3. **Setup environment variables**
   Create a .env file in the root directory with the following contents:
   DB_URI=mongodb://localhost:27017/pbn
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   GOOGLE_CLOUD_KEY_FILENAME=path/to/your/google-credentials.json
   PORT=3000

4. **Start the application**
   npm start

5. **Running Python scripts**
   Install Python dependencies by creating a requirements.txt file and running:

pip install -r requirements.txt

6. **API Endpoints**

User Authentication
POST /api/users/signup - Registers a new user with name, email, and password.
POST /api/users/login - Authenticates a user and returns a JWT.
GET /api/users/logout - Logs out a user and invalidates the user's session.
User Profile Management
PATCH /api/users/changePassword - Allows users to change their password.
DELETE /api/users/deleteAccount - Permanently deletes a user account.
Image Processing
POST /api/images/generatePBN - Converts an uploaded image to a paint-by-number format.
PATCH /api/images/updateImageName - Updates the name of an uploaded image.
DELETE /api/images/deleteImage - Deletes an image from the user's profile.
Image Retrieval and Management
GET /api/images/myImages - Retrieves all images associated with the logged-in user.
POST /api/images/artFeed/upload - Uploads an image to the community ArtFeed.
GET /api/images/artFeed - Retrieves all images from the ArtFeed.
Community Interaction
POST /api/images/artFeed/:imageId/comment - Adds a comment to an ArtFeed image.
PATCH /api/images/artFeed/like/:imageId - Adds a like to an ArtFeed image.

7. **Deployment**
   To deploy this application, you could use platforms like Heroku or Google Cloud Platform. Follow their respective documentation for guidance on deploying Node.js applications.

Author
Michael Maguire

Acknowledgments
Thanks to the Node.js and Python communities for continuous support and numerous packages that make life easier.
