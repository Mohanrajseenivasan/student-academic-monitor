📊 Online Academic Performance Monitor

A web-based system designed to track, analyze, and manage student academic performance through real-time dashboards and role-based access.

📖 Table of Contents

About the Project
Key Features
Technology Stack
Getting Started
Prerequisites
Installation
Database Setup
Usage
Project Structure
Contributing
License

🧐 About the Project

Online Academic Performance Monitor is a centralized platform that helps educational institutions manage and evaluate student performance efficiently.
The system collects and processes:
Academic marks
Attendance records
Subject-wise performance
Faculty feedback
It provides meaningful insights to improve learning outcomes.
Dual Interface System
Faculty View
Manage student records, upload marks, monitor progress, and give suggestions.
Student View
View personal dashboard with GPA, attendance, subject performance, and feedback.

✨ Key Features

User Authentication
Secure login system for Students, Faculty, and Admins.
Role-Based Access
Different dashboards based on user roles.
Student Dashboard
Displays GPA, attendance, marks, and overall grade.
Faculty Management System
Add and update student marks and attendance.
Performance Analytics
Automatic GPA calculation and progress tracking.
Responsive Design
Works smoothly on desktop and mobile devices.
Secure APIs
Backend APIs for safe data communication.

🛠️ Technology Stack

Frontend
Framework: React.js
Styling: CSS / Tailwind CSS
Routing: React Router DOM
HTTP Client: Axios

Backend

Runtime: Node.js
Framework: Express.js
Database: MongoDB (Mongoose)
Authentication: Custom Login System
Database
MongoDB Atlas / Local MongoDB

🚀 Getting Started
Prerequisites

Make sure you have installed:
Node.js (v16 or higher)
MongoDB (Local / Atlas)
Git (Optional)

⚙️ Installation
Clone the Repository
git clone https://github.com/your-username/online-academic-monitor.git
cd online-academic-monitor

Backend Setup
cd backend
npm install

Create .env file in backend folder:
MONGO_URL=your_mongodb_connection_string
PORT=5000

Start backend:
node server.js

Server runs on:
👉 http://localhost:5000

Frontend Setup
cd ../frontend
npm install
npm start


Client runs on:
👉 http://localhost:3000

🗄️ Database Setup

Create a MongoDB database (Local or Atlas).
Add connection string in .env.
Collections will be created automatically.

Collections:
users
marks

🏃 Usage
Start Backend
cd backend
node server.js

Start Frontend
cd frontend
npm start

Open browser:

http://localhost:3000

Default Login (Example)

Student

Email: student@gmail.com  
Password: student123

Faculty

Email: faculty@gmail.com  
Password: faculty123

(Admin credentials as configured)

📂 Project Structure
online-academic-monitor/
│
├── client/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Student.js
│   │   ├── Faculty.js
│   │   ├── Admin.js
│   │   └── Dashboard.js
│   │
│   ├── App.js
│   ├── config.js
│   └── index.js
│
└── package.json

🤝 Contributing

Steps:
Fork the project
Create a branch
git checkout -b feature/new-feature
Commit changes
git commit -m "Added new feature"
Push
git push origin feature/new-feature
Create Pull Request

📝 License

This project is licensed under the MIT License.
