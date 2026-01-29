import "./output.css";
import AuthPage from "./pages/AuthPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { Index } from "./pages/Index";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Editpage from "./pages/editpage";
import Postpage from "./pages/Postpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<Create />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/otpverify" element={<AuthPage mode="otp" />} />

      <Route path="/edit" element={<Editpage />} />
      <Route path="/post/:id" element={<Postpage />} />
    </Routes>
  );
}

export default App;
