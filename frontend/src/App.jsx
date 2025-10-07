// Corrected src/App.jsx (this is the router - do not put mocks or component logic here)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/auth/Register-Login/authPage";
import WelcomePage from "./components/auth/WelcomePage/welcomePage";
import EventPage from "./pages/EventPage";
import PeoplePage from "./pages/People/PeoplePage"; // Import the separate PeoplePage component
// import CreateEvent from "./pages/CreateEvent";
import PublicChat from "./components/chat/public-chat/publicChat";
import PrivateChat from "./components/chat/privateChat";
import UserProfile from "./components/profile/UserProfile";
import ProfilePage from "./pages/Profile/ProfilePage";
import "./App.css";
import React, { useState } from "react";
import DuoFinderAdvanced  from "./pages/DuoFinder/DuoFinderPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("user") || false
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={ <EventPage isAuthenticated={isAuthenticated} />}
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <Auth setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Auth setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route path="/welcome" element={<WelcomePage />} />
<Route path="/duo-finder" element={isAuthenticated ? <DuoFinderAdvanced /> : <Navigate to="/register" />} />

        {/* <Route path="create-event" element={<CreateEvent />} /> */}
        <Route path="/public-chat" element={<PublicChat isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/private-chat" element={isAuthenticated ? <PrivateChat /> : <Navigate to="/register" />} />
        <Route path="/private-chat/:chatroomId" element={isAuthenticated ? <PrivateChat /> : <Navigate to="/register" />} />
        <Route path="/people-page" element={isAuthenticated ? <PeoplePage /> : <Navigate to="/register" />} />
        <Route path="/profile/:userId" element={isAuthenticated ? <UserProfile /> : <Navigate to="/register" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/register" />} /> {/* New route for own profile */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;