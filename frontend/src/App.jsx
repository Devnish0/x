import { useState } from "react";
import "./output.css";
import AuthPage from "./pages/AuthPage";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
    </Routes>
  );
}

export default App;
