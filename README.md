# 🎉 Vibely - Social Networking Platform

<div align="center">

![Vibely Logo](./frontend/assets/images/img_sidebar_logo.png)

**Connect, Chat, and Discover Events in Real-Time**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About The Project

**Vibely** is a modern, full-stack social networking platform that combines real-time messaging with event management and AI-powered recommendations. Built with the MERN stack (MongoDB, Express, React, Node.js), Vibely enables users to connect with friends, discover events, and communicate seamlessly in both public and private chat rooms.

### Why Vibely?

- 🚀 **Real-Time Communication** - Instant messaging powered by Socket.IO
- 🎯 **Smart Recommendations** - AI-driven event suggestions using Google Gemini
- 🎨 **Beautiful UI/UX** - Modern design with smooth animations and gradients
- 📱 **Fully Responsive** - Works flawlessly on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 👥 **Social Features** - Friend system, notifications, profile management

---

## ✨ Features

### 💬 **Real-Time Chat**
- **Private Messaging** - One-on-one conversations with friends
- **Public Chat Rooms** - Join or create group discussions
- **Online Status** - See who's online in real-time
- **Unread Indicators** - Never miss a message
- **Emoji Support** - Express yourself with categorized emojis
- **Message Search** - Find conversations quickly

### 🎪 **Event Management**
- **Browse Events** - Discover social, business, educational, and entertainment events
- **Smart Filters** - Search by location, date, and keywords
- **Join Events** - RSVP to events with capacity management
- **Create Events** - Host your own events with custom images and details
- **AI Recommendations** - Get personalized event suggestions based on your interests
- **Event Details** - View comprehensive information with host profiles

### 👤 **User Profiles**
- **Profile Customization** - Upload profile pictures and update bio
- **Friend System** - Send/accept friend requests
- **Activity Tracking** - View joined events and chat history
- **User Discovery** - Search and connect with other users

### 🔔 **Notifications**
- **Real-Time Alerts** - Instant notifications for friend requests and event updates
- **Notification Center** - Centralized hub for all alerts
- **Unread Badges** - Visual indicators for new notifications

---

## 🎬 Demo

### 🌐 Live Application

**Try it now:** [https://social-networking-app-cxqd.onrender.com/](https://social-networking-app-cxqd.onrender.com/)

### 📸 Screenshots

<div align="center">

| People Page | Private Chat | Public Chat |
|:---:|:---:|:---:|
| ![People Page](./docs/screenshots/peoplepage.png) | ![Private Chat](./docs/screenshots/privatechat.png) | ![Public Chat](./docs/screenshots/publicchat.png) |

| User Profile | Authentication | DuoFinder |
|:---:|:---:|:---:|
| ![Profile](./docs/screenshots/profile.png) | ![Auth](./docs/screenshots/auth.png) | ![DuoFinder](./docs/screenshots/duofinder.png) |

| Events Dashboard |
|:---:|
| ![Events](./docs/screenshots/events.png) |

</div>

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Socket.IO Client** - Real-time WebSocket communication
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library
- **date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Google Gemini AI** - Event recommendation engine
- **Validator** - Input validation library

### Development Tools
- **ESLint** - JavaScript linting
- **Nodemon** - Auto-restart for Node.js
- **dotenv** - Environment variable management

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vibely.git
cd vibely
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

#### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vibely
SECRET=your_super_secret_jwt_key_change_this_in_production
GEMINI_API_KEY=your_google_gemini_api_key_here
DEBUG_GEMINI=false
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control! Always use `.env.example` for templates.

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

```bash
# Start MongoDB service (if not running)
# On Windows:
net start MongoDB

# On macOS/Linux:
sudo systemctl start mongod
# or
brew services start mongodb-community

# MongoDB will automatically create the database on first connection
```

---

## 🎯 Usage

### Development Mode

#### Run Both Servers Simultaneously

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Server will start at `http://localhost:5000`

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Application will open at `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Accessing the Application

- **Live Demo**: [https://social-networking-app-cxqd.onrender.com/](https://social-networking-app-cxqd.onrender.com/)
- **Local Frontend**: [http://localhost:3000](http://localhost:3000)
- **Local Backend API**: [http://localhost:5000](http://localhost:5000)
- **MongoDB**: `mongodb://localhost:27017/vibely`

### Default Ports

| Service | Port | Configurable |
|---------|------|-------------|
| Frontend | 3000 | Yes (Vite config) |
| Backend | 5000 | Yes (.env file) |
| MongoDB | 27017 | Yes (MongoDB config) |
| Socket.IO | 5000 | Same as backend |

---

## 💻 Coding Style

This project follows industry-standard coding practices and conventions.

### JavaScript/React Conventions

- **ES6+ Syntax** - Modern JavaScript features (arrow functions, destructuring, async/await)
- **Functional Components** - React hooks over class components
- **Component Naming** - PascalCase for components, camelCase for functions
- **File Structure** - One component per file, organized by feature

#### Example Component Structure:

```javascript
// Component Template
import React, { useState, useEffect } from 'react';
import styles from './Component.module.css';

const MyComponent = ({ propName }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects here
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  const handleAction = () => {
    // Event handler logic
  };

  return (
    <div className={styles.container}>
      {/* JSX here */}
    </div>
  );
};

export default MyComponent;
```

### Code Organization

```
frontend/src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat-related components
│   └── events/         # Event-related components
├── pages/              # Page-level components
├── api/                # API service functions
├── import/             # Shared components/utilities
└── assets/             # Images, icons, styles

backend/
├── controllers/        # Request handlers
├── models/            # Database schemas
├── routes/            # API route definitions
├── middleware/        # Custom middleware
└── utils/             # Helper functions
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile.jsx` |
| Functions | camelCase | `getUserData()` |
| Constants | UPPER_SNAKE_CASE | `API_URL` |
| CSS Classes | kebab-case | `user-profile-card` |
| Files | kebab-case or PascalCase | `user-profile.jsx` |

### ESLint Configuration

The project uses ESLint for code quality:

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

### Test Structure

```javascript
// Example test file
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    // Test logic here
  });
});
```

### Testing Best Practices

- ✅ Write unit tests for utility functions
- ✅ Test component rendering and user interactions
- ✅ Mock API calls and external dependencies
- ✅ Test edge cases and error scenarios
- ✅ Maintain >80% code coverage

---

## 📁 Project Structure

```
vibely/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Login/Register components
│   │   │   ├── chat/              # Chat UI components
│   │   │   │   ├── privateChat.jsx
│   │   │   │   ├── publicChat.jsx
│   │   │   │   └── PeopleModal.jsx
│   │   │   └── events/            # Event components
│   │   ├── pages/
│   │   │   ├── EventPage.jsx      # Main events page
│   │   │   └── ProfilePage.jsx    # User profile
│   │   ├── api/
│   │   │   ├── userApi.js         # User API calls
│   │   │   ├── eventsApi.js       # Event API calls
│   │   │   └── notificationsApi.js
│   │   ├── import/                # Shared components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── UserDropdown.jsx
│   │   │   └── Notification/
│   │   ├── assets/
│   │   │   └── images/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── userController.js      # User operations
│   │   ├── chatRoomController.js  # Chat operations
│   │   └── eventController.js     # Event operations
│   ├── models/
│   │   ├── userModel.js           # User schema
│   │   ├── chatRoomModel.js       # ChatRoom schema
│   │   ├── messageModel.js        # Message schema
│   │   └── eventModel.js          # Event schema
│   ├── routes/
│   │   ├── usersRouter.js
│   │   ├── chatRouter.js
│   │   ├── eventRouter.js
│   │   └── messageRouter.js
│   ├── middleware/
│   │   └── auth.js                # JWT authentication
│   ├── utils/
│   │   └── gemini.js              # AI recommendation logic
│   ├── server.js                  # Main server file
│   ├── package.json
│   └── .env.example
│
├── docs/                           # Documentation
│   └── screenshots/                # Application screenshots
├── README.md
└── LICENSE
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user profile |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/joined/:userId` | Get user's joined events |
| GET | `/api/events/recommend/:userId` | Get AI recommendations |
| POST | `/api/events` | Create new event |
| POST | `/api/events/:id/join` | Join event |
| DELETE | `/api/events/:id/leave` | Leave event |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chatrooms/searchPri/:userId` | Get private chats |
| GET | `/api/chatrooms/searchPub/:userId` | Get public chats |
| GET | `/api/chatrooms/history/:roomId` | Get chat messages |
| POST | `/api/chatrooms` | Create chatroom |
| POST | `/api/chatrooms/messages/:roomId` | Send message |
| POST | `/api/chatrooms/join/:roomId` | Join public chat |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinRoom` | Client → Server | Join a chat room |
| `sendMessage` | Client → Server | Send message to room |
| `receiveMessage` | Server → Client | Receive new message |
| `connect` | Both | Connection established |
| `disconnect` | Both | Connection closed |

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

```
MIT License

Copyright (c) 2025 Vibely Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👥 Authors & Acknowledgments

### Development Team

- **Frontend Team** - React UI/UX implementation
- **Backend Team** - API and database architecture
- **Full-Stack Team** - Integration and deployment

### Acknowledgments

Special thanks to the amazing open-source projects that made Vibely possible:

- [React](https://reactjs.org/) - Frontend framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Google Gemini AI](https://ai.google.dev/) - AI recommendations
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

<div align="center">

**Made with ❤️ by the Vibely Team**

⭐ Star us on GitHub if you find this project useful!

[⬆ Back to Top](#-vibely---social-networking-platform)

</div>
