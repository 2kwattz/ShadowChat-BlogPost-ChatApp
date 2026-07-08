import React,{useEffect,useState} from "react";
import "./dashboard.css"
// User Context
import { useAuth } from "../../context/authContext";



function Dashboard() {
  const { user } = useAuth(); 

  useEffect(()=>{
    console.log("User Data => ",user)
  },[user])

  return (
    <div>
      <h1 style={{color:"white"}}>Dashboard</h1>
      <p style={{color:"white"}}>Welcome {user?.firstName} {user?.lastName}</p>
    </div>
  );
}

export default Dashboard;
