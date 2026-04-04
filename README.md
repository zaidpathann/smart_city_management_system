# 🏙️ SmartCity — Civic Portal
### Full-Stack Web Application | AngularJS + Node.js + Express + MongoDB

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
└── frontend/                   # AngularJS SPA
    ├── index.html              # Main SPA shell + navbar
    ├── css/
    │   └── style.css           # Full custom dark theme
    ├── js/
    │   ├── app.js              # AngularJS module + routes
    │   ├── services/
    │   │   ├── authService.js  # JWT session management
    │   │   └── apiService.js   # All HTTP API calls
    │   └── controllers/
    │       ├── NavController.js
    │       ├── AuthController.js
    │       ├── DashboardController.js
    │       ├── ComplaintController.js
    │       ├── AdminController.js
    │       ├── ParkingController.js
    │       └── MiscController.js
    └── views/                  # AngularJS HTML templates
        ├── home.html
        ├── login.html
        ├── register.html
        ├── dashboard.html
        ├── add-complaint.html
        ├── add-report.html
        ├── add-service.html
        ├── add-feedback.html
        ├── parking.html
        ├── emergency.html
        ├── admin-dashboard.html
        ├── admin-complaints.html
        ├── admin-announcements.html
        ├── admin-parking.html
        ├── admin-feedback.html
        ├── admin-reports.html
        ├── admin-services.html
        └── admin-users.html
```

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

### Step 6 — Serve the Frontend

The frontend is a static AngularJS SPA. You need a simple HTTP server (opening index.html directly via `file://` won't work due to CORS/routing).

**Option A — Using VS Code Live Server** (Recommended for beginners)
1. Install the "Live Server" extension in VS Code
2. Right-click `frontend/index.html` → "Open with Live Server"
3. It opens at `http://127.0.0.1:5500`

**Option B — Using npx serve**
```bash
cd frontend
npx serve .
# Opens at http://localhost:3000
```

**Option C — Using Python**
```bash
cd frontend
python -m http.server 8080
# Opens at http://localhost:8080
```

---

## 🌐 Accessing the Application

| URL | Description |
|-----|-------------|
| `http://localhost:5500` (or your port) | Frontend SPA |
| `http://localhost:5000` | Backend API |
| `http://localhost:5000/api/users` | Users API endpoint |

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
- The frontend must be served via HTTP server, not opened as a file

**Image upload not working?**
- Add valid ImageKit credentials to `.env`
- Complaints still work without images — the imageUrl will just be empty

**Port already in use?**
- Change `PORT=5001` in your `.env` file
- Update `var BASE = 'http://localhost:5001/api'` in `frontend/js/services/apiService.js`

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | AngularJS 1.8.3 |
| Frontend Routing | ngRoute |
| UI Library | Bootstrap 5.3 |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Sora + JetBrains Mono (Google Fonts) |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| File Upload | Multer (memory storage) |
| Image Hosting | ImageKit |
| Environment | dotenv |

---

## 📝 License

Built for educational purposes. Free to use and modify.
