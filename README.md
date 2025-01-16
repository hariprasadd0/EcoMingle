# EcoMingle 🌱

A sustainable e-commerce platform empowering eco-conscious shopping by offering verified eco-friendly products and fostering greener choices for a better planet

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

![Ecomingle](https://github.com/user-attachments/assets/59e93572-6ff8-43ad-b2da-d7e75da28f30)
--
![cart](https://github.com/user-attachments/assets/90121bc0-7689-444d-9809-65e2d365adc9)
--
![Cata](https://github.com/user-attachments/assets/c89a280f-45b0-40a5-b89c-a3e73acbea24)
--


## Technology Stack

- **Frontend**: React.js + Material UI
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Stripe
- **Image and pdf upload**: Cloudinary

## Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB
- npm
- Git

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/hariprasadd0/EcoMingle.git
   cd EcoMingle
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env # Configure your environment variables
   npm start
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Configure your environment variables
   npm start
   ```

## Environment Variables

### Frontend (.env)

```plaintext
VITE_BASE_URLL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

### Backend (.env)

```plaintext
FRONTEND_URL=your_frontend_url
PORT=5000
ATLAS_URI=mongodb://localhost:27017/ecomingle
JWT_SECRET=your_jwt_secret
JWT_ACCESS_TOKEN=your_access_token_secret
JWT_ACCESS_EXPIRE=access_token_expiry_time
JWT_REFRESH_TOKEN=your_refresh_token_secret
JWT_REFRESH_EXPIRE=refresh_token_expiry_time
MAIL_USER=your_email_username
MAIL_PASS=your_email_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---
