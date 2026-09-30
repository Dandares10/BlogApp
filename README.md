# 🌟 NexusBlog - High-Performance Modern MERN Blog Platform

NexusBlog is a full-stack, welcoming publishing platform built with the MERN stack (MongoDB, Express.js, React 19, Node.js) and styled with TailwindCSS. It provides a rich writing experience for developers, creators, and thinkers with modern features like multi-emoji reactions, autosaving draft editor, category filtering, search, and personal growth statistics.

![NexusBlog](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features & Highlights

- 🎨 **Modern Dark Luxury Aesthetic**: Glassmorphism UI, gradient accents, responsive navigation, custom scrollbars, and fluid micro-animations.
- 🎭 **Welcoming Multi-Emoji Reactions**: React to articles with `"✨ Inspiring"`, `"❤️ Relatable"`, `"👏 Well Said"`, and `"🤯 Mind Blown"`.
- ✍️ **Gentle Writing Starters & Draft Autosave**: Staring at a blank page? Choose from built-in writing prompts. Drafts autosave to your device every 5 seconds so you never lose your progress.
- 📈 **Personal Growth & Impact Dashboard**: Track your writing streak, total words written, community impact, and article management in a private dashboard.
- 🌱 **Community Welcome Badges**: First-time commenters receive a gentle `🌱 welcome` badge.
- 🔍 **Search & Category Filtering**: Instantly search by title, content, or summary, and filter articles by topics like *Technology*, *Design*, *AI & ML*, *Engineering*, *Web Dev*, and *Lifestyle*.
- 🔔 **Toast Notification System**: Real-time feedback for publishing, commenting, liking, and copying share links.
- 🔑 **Secure Authentication**: JWT token-based authentication with bcrypt password hashing.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, TailwindCSS, Lucide Icons, Vite
- **Backend**: Node.js, Express.js 5, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt.js
- **State & Utilities**: Context API (Auth, Theme, Toast), Axios

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string.

### 1. Clone & Setup Repository

```bash
git clone https://github.com/dandares10/blog-app.git
cd blog-app
```

### 2. Configure Backend Environment

Navigate to the `server` folder and set up environment variables:

```bash
cd server
npm install
```

Create `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogapp
JWT_SECRET=super_secret_blog_jwt_key_2026
```

Start the backend server:

```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Configure Frontend Client

Navigate to the `client` folder and start the React dev server:

```bash
cd ../client
npm install
npm run dev
# Frontend running on http://localhost:5173
```

---

## 📡 API Endpoints Summary

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Sign in existing user
- `GET /me`: Fetch authenticated user profile

### Post Routes (`/api/posts`)
- `GET /`: Get articles (supports `?search=...`, `?tag=...`, `?author=...`)
- `GET /:id`: Get article details by ID
- `POST /`: Create article (Auth required)
- `PUT /:id`: Edit article (Author required)
- `PUT /:id/like`: Toggle like status
- `PUT /:id/react`: Toggle emoji reaction (`inspiring`, `relatable`, `well_said`, `mind_blown`)
- `DELETE /:id`: Delete article (Author required)

### Comment Routes (`/api/comments`)
- `GET /:postId`: Fetch comments for article
- `POST /:postId`: Add comment (Auth required)
- `DELETE /:commentId`: Delete comment (Author required)

---

## 📜 License

Distributed under the MIT License. Built with ❤️ for community writers and developers.
