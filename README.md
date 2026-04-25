# 🎓 School ERP System

A comprehensive Enterprise Resource Planning (ERP) system for schools built with React, Node.js, and MongoDB.

## 🚀 Features

### 👨‍🎓 Student Module
- View profile and personal information
- Check attendance records with percentage calculation
- View marks by exam type

### 👩‍🏫 Teacher Module
- Mark daily attendance for classes
- Upload and manage student marks
- View class-wise student lists
- Access attendance reports

### 🧑‍💼 Admin Dashboard
- Manage students (add/edit/delete)
- Manage teachers (add/edit/delete)
- View attendance reports
- View marks reports
- Assign classes to teachers

### 🔐 Security
- JWT-based authentication
- Role-based access control
- Password encryption using bcryptjs
- Protected API endpoints

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Redux Toolkit
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT
- bcryptjs

## 📁 Project Structure

```
kdhs/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Attendance.js
│   │   └── Marks.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── package.json
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── TeacherDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── AttendanceTable.jsx
    │   ├── redux/
    │   │   ├── authSlice.js
    │   │   └── store.js
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/school-erp
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
PORT=3000
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

App will open on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Student Routes (Protected)
- `GET /api/student/profile` - Get student profile
- `GET /api/student/attendance` - Get attendance records
- `GET /api/student/marks` - Get marks

### Teacher Routes (Protected)
- `POST /api/teacher/attendance` - Mark attendance
- `POST /api/teacher/marks` - Upload marks
- `GET /api/teacher/class/:classname` - Get class students
- `GET /api/teacher/attendance/:studentId` - Get student attendance

### Admin Routes (Protected)
- `POST /api/admin/student` - Add student
- `POST /api/admin/teacher` - Add teacher
- `GET /api/admin/students` - Get all students
- `GET /api/admin/teachers` - Get all teachers
- `PUT /api/admin/student/:id` - Update student
- `DELETE /api/admin/student/:id` - Delete student
- `GET /api/admin/reports/attendance` - Attendance report
- `GET /api/admin/reports/marks` - Marks report

## 🔐 Test Credentials

### Admin
- Email: admin@school.com
- Password: admin123
- Role: admin

### Teacher
- Email: teacher@school.com
- Password: teacher123
- Role: teacher

### Student
- Email: student@school.com
- Password: student123
- Role: student

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'teacher' | 'student',
  isActive: Boolean,
  timestamps
}
```

### Student
```javascript
{
  userId: Reference to User,
  class: String,
  rollNo: Number,
  phoneNo: String,
  parentName: String,
  parentPhone: String,
  address: String,
  timestamps
}
```

### Teacher
```javascript
{
  userId: Reference to User,
  subject: String,
  qualifications: String,
  phoneNo: String,
  assignedClasses: [String],
  experience: Number,
  timestamps
}
```

### Attendance
```javascript
{
  studentId: Reference to Student,
  date: Date,
  status: 'present' | 'absent',
  markedBy: Reference to User (Teacher),
  remarks: String,
  timestamps
}
```

### Marks
```javascript
{
  studentId: Reference to Student,
  subject: String,
  marks: Number (0-100),
  examType: 'unit1' | 'unit2' | 'midterm' | 'final',
  semester: '1' | '2',
  academic_year: String,
  addedBy: Reference to User (Teacher),
  timestamps
}
```

## 🎯 Step-by-Step Build Progress

✅ **Step 1:** Backend setup with Express + MongoDB
✅ **Step 2:** JWT authentication and middleware
✅ **Step 3:** Admin APIs (add student/teacher)
✅ **Step 4:** Attendance system API
✅ **Step 5:** Frontend login and dashboard UI
✅ **Step 6:** Role-based dashboard routing
⏳ **Step 7:** Reports & charts (upcoming)

## 💡 Bonus Features (To be added)
- 📱 Mobile responsive UI (improved)
- 📊 Charts and graphs (Chart.js)
- 🔔 Notification system
- 📁 Excel import/export
- 🖨️ Print functionality
- 📧 Email notifications

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### CORS Error
- Verify backend proxy in frontend package.json
- Ensure backend is running on port 3000

### Token Expiration
- Token expires in 7 days by default
- User needs to login again

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@schoolerp.com or open an issue on GitHub.

---

**Happy Learning! 🚀**
