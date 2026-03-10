# Online Academic Performance Monitor (OAPM)

A comprehensive web-based platform for tracking academic performance in educational institutions.

## Features

- **Role-based Dashboards**: Admin, Faculty, and Student dashboards
- **Real-time Performance Tracking**: Monitor marks, attendance, and CGPA
- **AI Predictions**: Identify at-risk students early
- **Email Notifications**: Automated alerts for low attendance/marks
- **Analytics & Reports**: Visual insights and data export
- **Feedback System**: Student feedback on faculty and subjects

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Axios
- React Hook Form

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 4+

### Installation

1. **Clone the repository**
```bash
cd oapm-project
```

2. **Setup Backend**
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/oapm
# JWT_SECRET=your_secret_key
# PORT=5000
npm start
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Open Browser**
Navigate to `http://localhost:5173`

## Project Structure

```
oapm-project/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API services
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth & role middleware
│   ├── services/         # Business logic
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET/POST /api/admin/students` - Manage students
- `GET/POST /api/admin/faculty` - Manage faculty
- `GET/POST /api/admin/subjects` - Manage subjects

### Faculty
- `GET /api/faculty/dashboard` - Dashboard data
- `GET /api/faculty/students` - My students
- `POST /api/faculty/marks` - Enter marks
- `POST /api/faculty/attendance` - Mark attendance

### Student
- `GET /api/student/dashboard` - Dashboard data
- `GET /api/student/marks` - Get marks
- `GET /api/student/attendance` - Get attendance
- `GET /api/student/analytics` - Performance analytics

## License

MIT
