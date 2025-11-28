# Full-Stack E-Commerce Platform

A modern MERN e-commerce system featuring payments, authentication, product management, real-time updates and a clean modular codebase.

---

# Introduction

This is a **full-stack e-commerce application** built with the MERN stack on the backend and **React + TailwindCSS** on the frontend.  
It includes a complete authentication system, admin product management, order handling, secure media uploads and real-time communication.

The platform supports **PayPal, Stripe, and Ecocash UI**, file uploads via Cloudinary, protected routes and scalable architecture.

---

# Features

### Authentication

- JWT authentication
- Email & password login
- Google OAuth (Frontend)
- Secure password hashing with bcrypt
- Password reset flow

### Products

- Get all products
- Admin create/edit/delete
- Cloudinary image uploads
- Product search and filtering

### Orders

- Create orders
- Update order status
- Fetch user orders
- Payment UI (PayPal + Stripe + Ecocash)

### Real-Time Features

- Socket.io integration
- Real-time notifications
- Live cart/order updates (optional extension)

### Communication

- EmailJS integration
- Contact form support
- Cloudinary media handling

---

# Tech Stack

## Frontend

- **React + Vite**
- **React Router**
- **TailwindCSS**
- **Axios**
- **React Context**
- **EmailJS**
- **Socket.io-client**
- **Cloudinary upload support**
- **PayPal + Stripe + Ecocash UI**

## Backend

- **Express (.jsx)**
- **MongoDB + Mongoose**
- **JWT Auth**
- **Bcrypt**
- **Multer**
- **Cloudinary SDK**
- **Helmet**
- **CORS**
- **Rate Limiting**
- **Socket.io**
- **Nodemon**

---

# Project Structure

## 🖥️ Frontend (`client`)

src/
components/
contexts/
pages/
routes/
services/
utils/
App.css
App.jsx
main.jsx
.env

## Backend (`server`)

config/
controllers/
middleware/
models/
routes/
socket/
utils/
app.jsx
index.jsx
.babelrc
.env

---

# Setup Instructions

## Clone the repository

git clone https://github.com/TinasheMuzenda/muzz-vogue.git
cd muzzVogue

## Install Dependencies

**Client**
cd client
npm install

**Server**
cd server
npm install

# .env Configuration

## Backend .env

PORT=7000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

EMAILJS_SERVICE_ID=xxxx
EMAILJS_TEMPLATE_ID=xxxx
EMAILJS_PUBLIC_KEY=xxxx

## Frontend .env

VITE_API_URL=http://localhost:7000/api
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com

# Running the App

## Start Backend

cd server
npm run muzz

## Start Frontend

cd client
npm run muzz

## Visit:

http://localhost:5173

Testing — Postman
AUTH

POST /api/auth/register

POST /api/auth/login

POST /api/auth/google

POST /api/auth/reset

USER

GET /api/users/me

PUT /api/users/me

POST /api/users/avatar

PUT /api/users/change-password

PRODUCTS

GET /api/products

POST /api/products (admin)

POST /api/products/upload

PUT /api/products/:id

DELETE /api/products/:id

ORDERS

POST /api/orders

PUT /api/orders/:id/status

GET /api/orders/user

🧪 Testing — Jest
Install Jest
npm install --save-dev jest supertest

Add Script (package.json)
"test": "jest --env=node"

Example Test Files
tests/auth.test.js
tests/products.test.js
tests/orders.test.js

Run Tests
npm test

# **Design Decisions**

1. .jsx Backend
   Keeps both frontend and backend readable for React developers.

2. React Context over Redux
   Lightweight, simpler, and perfect for this project.

3. Cloudinary for Media
   Optimized image hosting + fast uploads + CDN delivery.

4. Vite + React
   Ultra-fast development and HMR.

5. Modular Backend
   Each controller/middleware/model is isolated → maintainable and scalable.

6. API Service Layer (Frontend)
   All Axios calls centralized → cleaner UI components.

7. Tailwind + Custom Palette
   Consistent UI theme and easier design system scaling.

# Final Notes

This project is built with modern industry standards and a fully modular architecture suitable for scaling, learning, or production use.

**Made by Tinashe Innocent Muzenda (MUZZ)**

# Contact

If you want to reach out or collaborate:
Email: tmuzendat@gmail.com
GitHub: https://github.com/TinasheMuzenda
LinkedIn: https://linkedin.com/in/TinasheMuzenda
