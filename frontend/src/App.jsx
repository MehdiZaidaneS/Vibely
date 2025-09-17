import React from "react";
import EventPage from "./pages/EventPage"; // Assuming EventPage is in pages/ folder
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* Add EventPage below or as a separate section; no routing needed if not navigating */}
      <EventPage />
    </div>
  );
}

export default App;