MyWebSite/
│
├── backend/ 
│   ├── server.js
│   ├── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── deviceController.js
│   │   ├── courseController.js
│   │   ├── chatController.js
│   │   ├── jobController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Device.js
│   │   ├── Course.js
│   │   ├── Chat.js
│   │   ├── Job.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── deviceRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── jobRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   ├── utils/
│   │   ├── helperFunctions.js
│   │   ├── dbConnection.js
│   ├── config/
│   │   ├── default.json
│   │   ├── production.json
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   ├── assets/
|   |       ├── hero-image.png
|   |       ├── device-control.png
|   |       ├── learning-portal.png
|   |       ├── chatroom.png
|   |       ├── job-portal.png
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── HomePage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Widget.js           
│   │   │   ├── RealTimeChart.js    
│   │   │   ├── DeviceControl.js 
│   │   │   ├── LearningPortal.js
│   │   │   ├── CoursesPage.js
│   │   │   ├── CoursesCard.js
│   │   │   ├── ChatRoom.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── JobPortal.js
│   │   │   ├── SocialLifePage.js
│   │   │   ├── SocialAccountCard.js
│   │   │   ├── NavigationBar.js
│   │   │   ├── NotificationIcon.js
│   │   ├── assets/
│   │   ├── images/
│   │   |   ├── iot-course.jpg
│   │   |   ├── react-course.jpg
│   │   |   ├── ai-course.jpg
│   │   |   ├── cloud-course.jpg
|   |   |   ├── profile.jpg
│   │   |   ├── facebook.png
│   │   |   ├── instagram.png
│   │   |   ├── twitter.png
│   │   |   ├── linkedin.png
|   |   |   
│   │   ├── styles/
│   │   │       ├── LandingPage.css
│   │   │       ├── LoginPage.css
│   │   │       ├── SignupPage.css
│   │   │       ├── HomePage.css
│   │   │       ├── Dashboard.css
│   │   │       ├── LearningPortal.css
│   │   │       ├── CoursesPage.css
│   │   │       ├── ChatRoom.css
│   │   │       ├── ProfilePage.css
│   │   │       ├── JobPortal.css
│   │   │       ├── SocialLifePage.css
│   │   │       ├── NavigationBar.css
│   │   │       ├── NotificationIcon.css
│   │   ├── utils/
│   │   │   ├── apiService.js
│   │   │   ├── localStorage.js
│   │   │   ├── socialMediaService.js
│   │   └── package.json
│
├── database/
│   ├── migrations/
│   │   ├── init.sql
│   ├── seeds/
│   │   ├── seedData.js
│   └── db.sqlite
│
└── README.md 






# MyWebSite

## Overview

**MyWebSite** is a full-stack web application that combines IoT device management, an online learning portal, interactive chat rooms, a job portal, and social media integration. It provides advanced features, modular architecture, and clean international-standard UI/UX.

---

## Features

1. **IoT Device Control**  
   - Monitor and control connected IoT devices.  
   - Fetch real-time data (e.g., temperature, humidity).  
   - Add or remove devices dynamically.

2. **Learning Portal**  
   - Access courses with videos, PDFs, and articles.  
   - Enroll in courses and rate content.  
   - Track progress through well-structured modules.

3. **Interactive Chat Rooms**  
   - Real-time one-on-one and group messaging.  
   - Share multimedia content, reactions, and attachments.

4. **Job Portal**  
   - Post and manage job listings.  
   - Apply for jobs with resumes and view statuses.

5. **Social Media Integration**  
   - Connect Facebook, Instagram, Twitter, and LinkedIn accounts.  
   - Fetch and display social media feeds.

6. **User Management**  
   - Secure authentication (signup/login).  
   - Manage user profiles with photo uploads.

---

## Technology Stack

### **Frontend**
- React.js
- React Router DOM
- Axios
- FontAwesome
- CSS Modules

### **Backend**
- Node.js (Express.js)
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt for Password Hashing

### **Database**
- MongoDB for production
- SQLite (for development/local migration)

### **Tools**
- ESLint and Prettier for Code Quality
- Nodemon for Backend Development
- VS Code Extensions (SQLite Viewer)

---

## Project Folder Structure


---

## Prerequisites

- **Node.js** (v14+)
- **MongoDB** (production database)
- **SQLite** (local database)
- **npm** (v6+)

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-repository/MyWebSite.git
cd MyWebSite

cd backend

npm install


Add environment variables in a .env file:
PORT=5000
DB_URI=mongodb://localhost:27017/mywebsite
JWT_SECRET=your_jwt_secret

Start the backend server:

npm run dev

Setup Frontend
	1.	Open a new terminal and navigate to frontend:
    cd ../frontend
npm install
npm start


Database Initialization
Initialize the SQLite database:
sqlite3 database/db.sqlite < database/migrations/init.sql

Seed initial data:
node database/seeds/seedData.js


API Endpoints

Authentication
	•	POST /api/auth/signup: Register a user.
	•	POST /api/auth/login: Authenticate and receive a JWT.

Devices
	•	GET /api/devices: Fetch devices.
	•	POST /api/devices: Add a new device.

Courses
	•	GET /api/courses: Fetch all courses.
	•	POST /api/courses/enroll/:id: Enroll in a course.

Chat
	•	GET /api/chat/rooms: Fetch chat rooms.
	•	POST /api/chat/rooms/:id/message: Send a message.


Backend Scripts: - 

        npm start       # Start the backend server
        npm run dev     # Start backend with nodemon
        npm test        # Run tests

Frontend Scripts:- 
        npm start       # Start frontend in development
         npm run build   # Build for production
        npm run lint    # Run ESLint for code quality  

 Deployment
	1.	Build the frontend:
            cd frontend
                npm run build

Deploy the build folder and backend to your cloud server (e.g., AWS, Heroku).

Author

Hema Koteswar Naidu
Email: your-email@example.com
LinkedIn: Your LinkedIn Profile
GitHub: Your GitHub Profile


License

This project is licensed under the ISC License.


Screenshots
	1.	Landing Page
    2.  Dashboard
    	3.	Course Page
        4.	Chat Room


---

### **Key Features of This README**:
1. **Project Overview**: Clear summary and features.
2. **Technology Stack**: Backend, frontend, and database details.
3. **Setup Instructions**: Step-by-step setup for backend, frontend, and database.
4. **API Documentation**: Key API routes with descriptions.
5. **Scripts**: Common `npm` scripts for running and testing.
6. **Deployment**: Instructions to deploy to production servers.
7. **Visual Elements**: Placeholder for screenshots to make the README visually appealing.
8. **Credits and License**: Proper author acknowledgment and license details.

---

Let me know if you'd like to customize any section further! 🚀