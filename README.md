# Chatably ðŸ’¬

A full-stack real-time chat application built with the MERN stack + Socket.io. Supports one-on-one direct messages and group chats with live typing indicators and online presence.

---

## âœ¨ Features

- **Authentication** â€” JWT-based register & login with bcrypt password hashing
- **Direct Messaging** â€” Real-time one-on-one chat
- **Group Chat** â€” Create groups, add/remove members, chat in real time
- **Online Presence** â€” See who's online with green indicators
- **Typing Indicators** â€” Live "X is typingâ€¦" feedback
- **Profile Management** â€” Update name, bio, and avatar
- **Responsive UI** â€” Works on mobile, tablet, and desktop
- **Real-time** â€” Powered by Socket.io

---

## ðŸ›  Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Zustand |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Real-time | Socket.io                           |
| Auth      | JWT + bcryptjs                      |
| HTTP      | Axios                               |

---

## ðŸ“ Project Structure

```
chatably/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”œâ”€â”€ db.js           # MongoDB connection
â”‚   â”‚   â””â”€â”€ socket.js       # Socket.io setup & online users
â”‚   â”œâ”€â”€ controllers/
â”‚   â”‚   â”œâ”€â”€ auth.controller.js
â”‚   â”‚   â”œâ”€â”€ user.controller.js
â”‚   â”‚   â”œâ”€â”€ message.controller.js
â”‚   â”‚   â””â”€â”€ group.controller.js
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â””â”€â”€ auth.middleware.js  # JWT protect middleware
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ User.js
â”‚   â”‚   â”œâ”€â”€ Message.js
â”‚   â”‚   â””â”€â”€ Group.js
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ auth.routes.js
â”‚   â”‚   â”œâ”€â”€ user.routes.js
â”‚   â”‚   â”œâ”€â”€ message.routes.js
â”‚   â”‚   â””â”€â”€ group.routes.js
â”‚   â”œâ”€â”€ .env.example
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ server.js
â”‚
â””â”€â”€ frontend/
    â”œâ”€â”€ src/
    â”‚   â”œâ”€â”€ components/
    â”‚   â”‚   â”œâ”€â”€ Avatar.jsx          # Reusable avatar with initials fallback
    â”‚   â”‚   â”œâ”€â”€ Sidebar.jsx         # Left panel: search, DMs, groups
    â”‚   â”‚   â”œâ”€â”€ ChatWindow.jsx      # Message area + input
    â”‚   â”‚   â””â”€â”€ NewGroupModal.jsx   # Create group modal
    â”‚   â”œâ”€â”€ lib/
    â”‚   â”‚   â”œâ”€â”€ axios.js            # Axios instance with interceptors
    â”‚   â”‚   â””â”€â”€ socket.js           # Socket.io singleton
    â”‚   â”œâ”€â”€ pages/
    â”‚   â”‚   â”œâ”€â”€ LoginPage.jsx
    â”‚   â”‚   â”œâ”€â”€ RegisterPage.jsx
    â”‚   â”‚   â”œâ”€â”€ ChatPage.jsx        # Main layout
    â”‚   â”‚   â””â”€â”€ ProfilePage.jsx
    â”‚   â”œâ”€â”€ store/
    â”‚   â”‚   â”œâ”€â”€ authStore.js        # Zustand auth state
    â”‚   â”‚   â””â”€â”€ chatStore.js        # Zustand chat state
    â”‚   â”œâ”€â”€ App.jsx
    â”‚   â”œâ”€â”€ main.jsx
    â”‚   â””â”€â”€ index.css
    â”œâ”€â”€ index.html
    â”œâ”€â”€ vite.config.js
    â”œâ”€â”€ tailwind.config.js
    â””â”€â”€ package.json
```

---

## ðŸš€ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/chatably
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### 3. Run

```bash
# Terminal 1 â€” Backend
cd backend
npm run dev

# Terminal 2 â€” Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173**

---

## ðŸ”Œ API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users/search?query=` | Search users |
| GET | `/api/users/:id` | Get user by ID |

### Messages
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/messages/dm/:userId` | Get DM history |
| POST | `/api/messages/dm/:userId` | Send DM |
| GET | `/api/messages/group/:groupId` | Get group messages |
| POST | `/api/messages/group/:groupId` | Send group message |

### Groups
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/groups` | Create group |
| GET | `/api/groups` | My groups |
| GET | `/api/groups/:id` | Group details |
| PUT | `/api/groups/:id/members` | Add member |
| DELETE | `/api/groups/:id/members/:userId` | Remove member |

---

## ðŸ”„ Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user:online` | Client â†’ Server | Announce presence |
| `users:online` | Server â†’ Client | Broadcast online list |
| `room:join` | Client â†’ Server | Join a chat room |
| `room:leave` | Client â†’ Server | Leave a chat room |
| `message:new` | Server â†’ Client | New message in room |
| `typing:start` | Client â†’ Server | Started typing |
| `typing:stop` | Client â†’ Server | Stopped typing |

---

## ðŸ“¸ Screenshots

> Register â†’ Login â†’ Search users â†’ DM in real-time â†’ Create groups â†’ Group chat

---

## ðŸ‘¨â€ðŸ’» Author

Built as a portfolio project demonstrating full-stack MERN development with real-time features.
