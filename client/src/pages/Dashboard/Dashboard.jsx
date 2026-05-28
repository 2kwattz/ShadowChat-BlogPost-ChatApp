import React,{useEffect,useState} from "react";
import "./dashboard.css"
import { useAuth } from "../../context/authContext";

// User Context


function Dashboard() {
  useEffect(()=>{
    console.log("User Data => ",user)
  },[])
  const { user, setUser, loading, isAuthenticated } = useAuth(); 
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {user?.user?.firstName}</p>
    </div>
  );
}

export default Dashboard;