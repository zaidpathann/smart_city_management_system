# 🏙️ SmartCity — Civic Portal

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](YOUR_VERCEL_URL)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](YOUR_RENDER_URL)

### Full-Stack MERN Application | MongoDB + Express + React + Node.js

## 🌐 Live Demo

- **Frontend:** YOUR_VERCEL_URL
- **Backend API:** YOUR_RENDER_URL

A complete Smart City civic management platform with role-based access control for citizens and administrators.

---

## 📁 Project Structure

```
smartcity/
├── backend/                    # Node.js + Express API Server
│   ├── config/
│   │   ├── imagekit.js         # ImageKit cloud storage setup
│   │   └── multer.js           # Multer file upload config
│   ├── middleware/
│   │   └── auth.js             # JWT auth + admin guard middleware
│   ├── models/                 # MongoDB Mongoose schemas
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── Announcement.js
│   │   ├── Feedback.js
│   │   ├── Parking.js
│   │   ├── ServiceRequest.js
│   │   └── Report.js
│   ├── routes/                 # Express REST API routes
│   │   ├── userRoutes.js       # /api/users
│   │   ├── complaintRoutes.js  # /api/complaints
│   │   ├── announcementRoutes.js # /api/announcements
│   │   ├── feedbackRoutes.js   # /api/feedback
│   │   ├── parkingRoutes.js    # /api/parking
│   │   ├── serviceRoutes.js    # /api/services
│   │   └── reportRoutes.js     # /api/reports
│   ├── server.js               # Express app entry point
│   ├── package.json
│   └── .env.example            # Environment variable template
│
└── frontend-react/             # React SPA (Vite)
    ├── index.html              # HTML shell
    ├── vite.config.js          # Vite build config
    ├── package.json
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Router + app shell
        ├── css/
        │   └── style.css       # Full custom dark theme
        ├── context/
        │   └── AuthContext.jsx # JWT session management (React Context)
        ├── services/
        │   └── api.js          # All HTTP API calls (axios)
        ├── utils/
        │   └── helpers.js      # Shared badge/date helpers
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── RouteGuards.jsx # RequireUser / RequireAdmin
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── AddComplaint.jsx
            ├── AddReport.jsx
            ├── AddService.jsx
            ├── AddFeedback.jsx
            ├── Parking.jsx
            ├── Emergency.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminComplaints.jsx
                ├── AdminAnnouncements.jsx
                ├── AdminParking.jsx
                ├── AdminFeedback.jsx
                ├── AdminReports.jsx
                ├── AdminServices.jsx
                └── AdminUsers.jsx
```

---

## 🚀 Deployment

| Service | Platform | Status |
|----------|----------|--------|
| Frontend | Vercel | ✅ Live |
| Backend API | Render | ✅ Live |
| Database | MongoDB Atlas | ✅ Connected |

The application is deployed with the frontend hosted on **Vercel**, the backend hosted on **Render**, and the database hosted on **MongoDB Atlas**.

---

## ⚙️ Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | v6+ | https://mongodb.com/try/download/community |
| npm | v8+ | Comes with Node.js |

---

## 🚀 Step-by-Step Setup

### Step 1 — Clone / Extract the Project

```bash
# If using the ZIP file:
unzip smartcity.zip
cd smartcity
```

### Step 2 — Set Up the Backend

```bash
cd backend
npm install
```

### Step 3 — Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# MongoDB (use localhost for local MongoDB)
MONGO_URI=mongodb://localhost:27017/smartcity

# JWT Secret — change this to any long random string
JWT_SECRET=my_super_secret_key_change_this_123

# Server port
PORT=5000

# ImageKit (get free credentials at https://imagekit.io)
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id_here
```

> **Note on ImageKit:** Create a free account at [imagekit.io](https://imagekit.io).
> Go to Dashboard → Developer Options to find your keys.
> **If you skip ImageKit**, complaints/reports will still work — images just won't be stored.

### Step 4 — Start MongoDB

```bash
# On macOS / Linux:
mongod

# On Windows (run as Administrator):
net start MongoDB

# Or with MongoDB Compass, just open the app — it starts automatically.
```

### Step 5 — Start the Backend Server

```bash
# In the /backend directory:
node server.js

# Or with auto-restart on changes:
npx nodemon server.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 6 — Start the React Frontend

```bash
cd frontend-react
npm install
npm run dev
# Opens at http://localhost:3000
```

For a production build:

```bash
npm run build      # outputs static files to frontend-react/dist
npm run preview    # serve the production build locally
```

---

## 🌐 Accessing the Application

| URL | Description |
|-----|-------------|
| YOUR_VERCEL_URL | Live React Frontend |
| YOUR_RENDER_URL | Live Backend API |
| YOUR_RENDER_URL/api/users | Users API |
| http://localhost:3000 | Local Frontend |
| http://localhost:5000 | Local Backend |

---

## 👤 First-Time Setup — Create an Admin Account

1. Open the frontend in your browser
2. Click **Register**
3. Fill in your details and set **Role: Administrator**
4. Click **Create Account**
5. You'll be redirected to the **Admin Dashboard**

> For a **citizen account**, register with Role: **Citizen (User)**

---

## 🔑 Role-Based Features

### 👤 Citizen (User) Features
| Feature | Route |
|---------|-------|
| Dashboard with stats | `/dashboard` |
| File a Complaint (with image) | `/add-complaint` |
| Report Cleanliness Issue (with image) | `/add-report` |
| Request Utility Service | `/add-service` |
| Submit Feedback & Rating | `/add-feedback` |
| View Smart Parking | `/parking` |
| Emergency Contacts | `/emergency` |
| View City Announcements | Dashboard |
| View Air Quality Index (AQI) | Dashboard |

### 🛡️ Admin Features
| Feature | Route |
|---------|-------|
| Admin Overview Dashboard | `/admin` |
| Manage All Complaints | `/admin/complaints` |
| Post/Delete Announcements | `/admin/announcements` |
| Manage Parking Locations | `/admin/parking` |
| View Citizen Feedback | `/admin/feedback` |
| Manage Cleanliness Reports | `/admin/reports` |
| Manage Service Requests | `/admin/services` |
| View All Users | `/admin/users` |

---

### Production Base URL

```
YOUR_RENDER_URL
```

## 📡 REST API Reference

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | None | Register new user |
| POST | `/api/users/login` | None | Login |
| GET | `/api/users/profile` | User | Get own profile |
| GET | `/api/users/all` | Admin | Get all users |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Complaints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/complaints` | User | Submit complaint |
| GET | `/api/complaints/my` | User | Own complaints |
| GET | `/api/complaints` | Admin | All complaints |
| GET | `/api/complaints/stats` | Admin | Analytics |
| PUT | `/api/complaints/:id` | Admin | Update status |
| DELETE | `/api/complaints/:id` | Admin | Delete |

### Announcements
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/announcements` | User | All announcements |
| POST | `/api/announcements` | Admin | Post announcement |
| DELETE | `/api/announcements/:id` | Admin | Delete |

### Other endpoints follow the same pattern for:
- `/api/feedback` — Feedback CRUD
- `/api/parking` — Parking management
- `/api/services` — Utility service requests
- `/api/reports` — Cleanliness reports

---

## 🗄️ MongoDB Schema Overview

```
users         → name, email, password(hashed), phone, role
complaints    → user, title, description, category, imageUrl, status
announcements → title, content, priority, postedBy
feedback      → user, subject, message, rating, isRead
parking       → name, address, totalSlots, availableSlots, status, fee
serviceRequests → user, serviceType, description, address, status
reports       → user, category, location, description, imageUrl, status
```

---

## 🔧 Troubleshooting

**MongoDB not connecting?**
- Make sure `mongod` is running in a separate terminal
- Check that port 27017 is not blocked

**CORS errors in browser?**
- Make sure backend is running on port 5000
- Run the frontend through the Vite dev server (`npm run dev`), not as a `file://` page

**Image upload not working?**
- Add valid ImageKit credentials to `.env`
- Complaints still work without images — the imageUrl will just be empty

**Port already in use?**
- Change `PORT=5001` in your `.env` file
- Update `baseURL: 'http://localhost:5001/api'` in `frontend-react/src/services/api.js`

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 (Vite) |
| Frontend Routing | React Router 6 (HashRouter) |
| HTTP Client | axios |
| UI Library | Bootstrap 5.3 |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Inter + Poppins (Google Fonts) |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| File Upload | Multer (memory storage) |
| Image Hosting | ImageKit |
| Environment | dotenv |

---

## ✨ Highlights

- JWT Authentication & Role-Based Authorization
- Citizen & Admin Dashboards
- Complaint & Service Management
- Smart Parking Module
- Cleanliness Reporting
- Feedback System
- Image Upload with ImageKit
- MongoDB Atlas Cloud Database
- Fully Responsive UI
- Production Deployment (Vercel + Render)

## 📝 License

Built for educational purposes. Free to use and modify.
---

# 🌍 Deployment Architecture

```text
                  User
                    │
                    ▼
          Frontend (Vercel)
                    │
                    ▼
          Backend API (Render)
                    │
                    ▼
            MongoDB Atlas
                    │
                    ▼
              ImageKit Cloud
```

## Deployment Platforms

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
- Image Storage → ImageKit

The React frontend communicates with the Express backend deployed on Render. The backend stores application data in MongoDB Atlas and uploads complaint/report images to ImageKit.


