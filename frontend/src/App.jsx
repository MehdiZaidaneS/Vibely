import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/auth/authPage";
import WelcomePage from "./components/auth/welcomePage";
import EventPage from "./pages/EventPage";
import PublicChat from "./components/chat/publicChat";
import PrivateChat from "./components/chat/privateChat";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <EventPage /> : <Navigate to="/register" />}
        />
        <Route path="/register" element={<Auth />} />
        <Route path="/welcome" element={isAuthenticated ? <WelcomePage /> : <Navigate to="/register" />} />
        <Route path="/events" element={isAuthenticated ? <EventPage /> : <Navigate to="/register" />} />
        <Route path="/public-chat" element={isAuthenticated ? <PublicChat /> : <Navigate to="/register" />} />
        <Route path="/private-chat" element={isAuthenticated ? <PrivateChat /> : <Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;