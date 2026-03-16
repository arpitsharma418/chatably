# Chatably

A real-time chat application built with the MERN stack. Supports direct messages and group chats.

**Live Demo:** [https://chatably-seven.vercel.app](https://chatably-seven.vercel.app/)

---

## Tech Stack

- **Frontend** — React (Vite), Tailwind CSS, Zustand
- **Backend** — Node.js, Express.js
- **Database** — MongoDB
- **Real-time** — Socket.io
- **Auth** — JWT + bcrypt

---

## Features

- Register & login with JWT authentication
- Real-time direct messaging
- Group chat with member management
- Online presence & typing indicators
- Fully responsive (mobile + desktop)

---

## Run Locally

**Backend**
```bash
cd backend
cp .env.example .env    # fill in your values
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables

**Backend `.env`**
```
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
PORT=5000
```

**Frontend `.env`**
```
VITE_API_URL=
VITE_SOCKET_URL=
```