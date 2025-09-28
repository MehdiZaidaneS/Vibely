import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/auth/authPage";
import WelcomePage from "./components/auth/welcomePage";
import EventPage from "./pages/EventPage";
// import CreateEvent from "./pages/CreateEvent";
import PublicChat from "./components/chat/publicChat";
import PrivateChat from "./components/chat/privateChat";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("user") || false
  );
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={ <EventPage />}
        />
        <Route path="/register" element={<Auth />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/events" element={<EventPage />} />

        {/* <Route path="create-event" element={<CreateEvent />} /> */}
        <Route path="/public-chat" element={<PublicChat />} />
        <Route path="/private-chat" element={<PrivateChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
