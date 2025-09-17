import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/auth/authPage";
import WelcomePage from "./components/auth/welcomePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<Auth />} />
        <Route path="welcome" element={<WelcomePage />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
