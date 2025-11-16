# 💪 Workout Tracker

A full-stack MERN application for tracking your fitness workouts with user authentication.

## 🚀 Live Demo

- **Frontend:** [https://workout-tracker-psi-three.vercel.app/](https://workout-tracker-psi-three.vercel.app/)
- **Backend API:** [https://workout-tracker-backend-s2xf.onrender.com](https://workout-tracker-backend-s2xf.onrender.com)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- ➕ **Create Workouts** - Add exercises with title, load (kg), and reps
- 📋 **View Workouts** - See all your workouts in a clean interface
- 🗑️ **Delete Workouts** - Remove completed or unwanted workouts
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔒 **Protected Routes** - Only authenticated users can manage workouts

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **date-fns** - Date formatting
- **Vercel** - Hosting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Render** - Hosting

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account (MongoDB Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/omm6763/workout-tracker.git
cd workout-tracker
```

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=4000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/workout-tracker
SECRET=your_jwt_secret_key_here
```

4. Start server:
```bash
npm start
```
Backend runs on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_BASE=http://localhost:4000
```

4. Start app:
```bash
npm start
```
Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
workout-tracker/
├── backend/
│   ├── controllers/
│   │   ├── usercontroller.js
│   │   └── workoutController.js
│   ├── middleware/
│   │   └── requireAuth.js
│   ├── models/
│   │   ├── userModel.js
│   │   └── workoutModel.js
│   ├── routes/
│   │   ├── user.js
│   │   └── workouts.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── WorkoutDetails.jsx
│   │   │   └── WorkoutForm.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── WorkoutContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuthContext.jsx
│   │   │   ├── useLogin.js
│   │   │   ├── useLogout.js
│   │   │   ├── useSignup.js
│   │   │   └── useWorkoutsContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.js
│   │   ├── config.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - Login user

### Workouts (Protected)
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create workout
- `PATCH /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

**Note:** All workout endpoints require `Authorization: Bearer <token>` header.

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables (MONGO_URI, SECRET, PORT)
5. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project on Vercel
3. Set Root Directory: `frontend`
4. Add environment variable: `REACT_APP_API_BASE=<backend-url>`
5. Deploy

### CORS Configuration
Update backend `server.js` with deployed frontend URL:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-vercel-app.vercel.app'
]
```
