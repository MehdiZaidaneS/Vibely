import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/auth/authPage";
import WelcomePage from "./components/auth/welcomePage";
import EventPage from "./pages/EventPage";
// import CreateEvent from "./pages/CreateEvent";
import PublicChat from "./components/chat/publicChat";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="events" element={<EventPage />} />
        {/* <Route path="create-event" element={<CreateEvent />} /> */}
        <Route path="/chat" element={<PublicChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
