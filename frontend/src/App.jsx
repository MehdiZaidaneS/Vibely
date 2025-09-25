<<<<<<< Updated upstream
import React from "react";
import EventPage from "./pages/EventPage"; 
=======

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/auth/authPage";
import WelcomePage from "./components/auth/welcomePage";
import EventPage from "./pages/EventPage";
// import CreateEvent from "./pages/CreateEvent";
import PublicChat from "./components/chat/publicChat";
>>>>>>> Stashed changes
import "./App.css";
import React, { useState } from "react"; // you only had 'import React from "react"'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("user") || false
  );
  return (
<<<<<<< Updated upstream
    <div className="App">
      
      <EventPage />
    </div>
=======
    <BrowserRouter>
      <Routes>
        <Route
              path="/"
              element={isAuthenticated ? <EventPage /> : <Navigate to="/auth" />}
            />
        <Route path="/auth" element={<Auth />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/events" element={<EventPage />} />
        {/* <Route path="create-event" element={<CreateEvent />} /> */}
        <Route path="/chat" element={<PublicChat />} />
      </Routes>
    </BrowserRouter>
>>>>>>> Stashed changes
  );
}

export default App;