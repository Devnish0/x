import { useState } from "react";
import "./output.css";
import AuthPage from "./pages/AuthPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { Index } from "./pages/Index";
import Create from "./pages/Create";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<Create />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
    </Routes>
  );
}

export default App;
