# 🌐 MiniSocial - MERN Social Media Platform

A modern full-stack Mini Social Media Platform built using the MERN stack. Users can register, log in securely, create posts, like posts, comment on posts, follow other users, and manage their profiles.

This project was developed as part of the **CODTECH Full Stack Development Internship**.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Logout

### 👤 User Management
- View User Profile
- Follow / Unfollow Users
- Followers & Following Count
- Profile Card

### 📝 Posts
- Create New Post
- View All Posts
- Recent Posts Feed
- Responsive Post Cards

### ❤️ Likes
- Like Posts
- Unlike Posts
- Live Like Count

### 💬 Comments
- Add Comments
- View Comments
- Comments Count

### 🎨 Frontend
- Modern Responsive UI
- Navbar
- Profile Sidebar
- Create Post Card
- Search Bar
- Theme Selector
- Mobile Friendly Layout

---

# 🛠 Tech Stack

## Frontend
- React.js (Vite)
- React Router DOM
- Axios
- CSS3

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- JSON Web Token (JWT)
- bcryptjs

---

# 📁 Project Structure

```
MiniSocial/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/minisocial.git
```

```bash
cd minisocial
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Run backend

```bash
npm start
```

or

```bash
nodemon server.js
```

---

## Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

Backend runs at

```
http://localhost:5000
```

---

# 🔗 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |

---

## Users

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/profile/:id` | User Profile |
| PUT | `/api/users/follow/:id` | Follow User |
| PUT | `/api/users/unfollow/:id` | Unfollow User |

---

## Posts

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/posts` | Create Post |
| GET | `/api/posts` | Get All Posts |
| PUT | `/api/posts/:id/like` | Like / Unlike Post |

---

## Comments

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/comments` | Add Comment |
| GET | `/api/comments/:postId` | Get Comments |

---

# 🔒 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

**Do not commit your `.env` file to GitHub.**

---

# 📸 Screenshots

Add screenshots of:

- Login Page
- Register Page
- Home Feed
- Profile Page
- Create Post
- Comments Section

---

# 🎯 Future Improvements

- Edit Post
- Delete Post
- Upload Profile Picture
- Image Posts
- Notifications
- Real-time Chat
- Dark Mode
- Search Users
- Pagination
- Infinite Scrolling

---

# 👨‍💻 Author

**Sibi Raj**

GitHub: https://github.com/your-github-username

---

# 📜 License

This project is developed for educational purposes as part of the **CODTECH Full Stack Development Internship**.

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub.
