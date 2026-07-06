# 🚀 Modern MERN Stack Portfolio with CMS

A premium, interactive, and highly dynamic personal portfolio website built with the **MERN Stack** (React, Vite, Express, and MongoDB Atlas) and styled with modern design patterns (glassmorphism, dark mode, custom glowing gradients, and Framer Motion micro-animations).

This project features a fully integrated secure **Admin CMS Dashboard** supporting CRUD operations for projects, work/education timelines, testimonials, profile info, and a Cloudinary-backed resume upload console. It is fully pre-configured for serverless deployment on **Vercel**.

---

## 🎨 Key Features

*   **Premium Interactive UI**: Stunning dark-themed layout built with Tailwind CSS v4 and fluid scroll-reveal animations using Framer Motion.
*   **Dual Database Architecture**: Fully dynamic MongoDB Atlas backend with an intelligent local JSON file database fallback (`fallback_db.json`) if the database is offline or unconfigured.
*   **Secure Admin CMS (`/admin`)**: Single-page editor console secured via JWT authorization and browser storage.
*   **Dynamic Testimonials CMS**: A reviews section supporting star ratings, custom reviewers, and a premium initials-badge fallback (hashes reviewer names to generate deterministic colored gradients if no avatar is supplied).
*   **Cloudinary Resume/CV Upload**: Direct resume upload module in the CMS. Saves PDF files into a memory buffer and streams them securely to Cloudinary, ensuring zero-disk write operations (perfect for serverless Vercel functions).
*   **Contact Form & Email Inbox**: Interactive message submission form that triggers real-time SMTP emails to you (via Gmail/SMTP) and saves them in the Admin Inbox.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v19), Vite, Tailwind CSS (v4), Framer Motion, Lucide Icons, React Router DOM.
*   **Backend**: Node.js, Express, MongoDB Atlas, Mongoose.
*   **Media & Storage**: Cloudinary (resume PDFs), Multer (in-memory file upload stream).
*   **Authentication & Mail**: JSON Web Tokens (JWT), BcryptJS, Nodemailer (SMTP).
*   **Hosting**: Vercel (Serverless Functions and Static Web Build).

---

## ⚙️ Environment Variables Setup

Before running the server, create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key

# Cloudinary Configuration (For Resume PDF Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP Email Configuration (For Contact Form Alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_TO=your_receiver_email@gmail.com
```

---

## 🚀 Local Development Guide

### 1. Installation
Clone the repository and install all dependencies for both the frontend and backend in one command:
```bash
npm install
```
*(This triggers a root `postinstall` script that automatically runs `npm install` inside the `server/` directory).*

### 2. Database Seeding
To populate your MongoDB database with high-quality mock data, run the seeder:
```bash
cd server
npm run seed
```
This will clear the active database and seed:
*   Default administrator (Username: `admin`, Password: `admin123`)
*   Default profile details (Hero text, About details, Skills categories)
*   Sample projects, timeline milestones, and testimonials.

### 3. Running the Application
Open two terminals to run both servers concurrently:

*   **Start the Backend API Server** (runs on `http://localhost:5000`):
    ```bash
    cd server
    npm start
    ```
*   **Start the Frontend Vite Dev Server** (runs on `http://localhost:5173`):
    ```bash
    npm run dev
    ```

Log in to your Admin Console at `http://localhost:5173/admin` with:
*   **Username**: `admin`
*   **Password**: `admin123` *(We recommend changing your password inside the settings tab upon logging in).*

---

## ☁️ Vercel Production Deployment

The project is structured and pre-configured for a zero-hassle Vercel deployment:

1.  **Push your repository to GitHub** (Git automatically ignores your local `.env` and `fallback_db.json` files).
2.  Go to the [Vercel Dashboard](https://vercel.com) and import your repository.
3.  Add all of your environment variables (listed in the **Environment Variables Setup** section above) under the **Environment Variables** tab in your Vercel project settings.
4.  Click **Deploy**! Vercel will automatically build the frontend static output, bundle the Express server as a serverless function (`api/index.js`), and provide a live URL.
