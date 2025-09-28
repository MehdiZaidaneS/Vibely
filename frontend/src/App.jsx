import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Auth from "./components/auth/authPage";
import WelcomePage from "./components/auth/welcomePage";
import EventPage from "./pages/EventPage";
import CreateEvent from "./pages/CreateEvent";
import PublicChat from "./components/chat/publicChat";
import PrivateChat from "./components/chat/privateChat";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="/" element={<EventPage />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="/public-chat" element={<PublicChat />} />
        <Route path="/private-chat" element={<PrivateChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
