import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./pages/ProtectedRoute";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chatroom from "./pages/Chatrooms/Chatroom";
import MyProfile from "./pages/MyProfile/myProfile";
import UserDevices from "./pages/UserDevices/UserDevices";
import CommunityPage from './pages/CommunityPage/CommunityPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={

          <ProtectedRoute>

            <Dashboard />
          </ProtectedRoute>

        } />

        <Route path="/myprofile" element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } />

        <Route path="/room/all" element={<Chatroom />} />

        <Route path="/mydevices" element={
          <ProtectedRoute>
          <UserDevices/>
          </ProtectedRoute>

        }
        />

        {/* Community Post */}

         <Route path="/community/:communitySlug" element={
          <ProtectedRoute>
          <CommunityPage/>
          </ProtectedRoute>

        }
        />

  

    </Routes>
    </BrowserRouter >
  );
}

export default App;