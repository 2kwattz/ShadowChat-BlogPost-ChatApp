import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../services/api";
import { useAuth } from "../../context/authContext";
import Navbar from "../../components/navbar/navbar";

const styles = './login.css';


function Login() {

  // States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Navigation
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  console.log("ALL LOCAL STORAGE");
  console.log(localStorage);

  // Test Checking device id 

  useEffect(() => {

    const id = getDeviceId()
    console.log("Device Id from local storage", id)
  })

  const getDeviceId = () => {

    // Fetching device id from localStorage
    let deviceId = localStorage.getItem("deviceId");


    if (!deviceId) {

      // Generating a Device UUID to uniquely identify a device for device tracking
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }

    console.log("[*] UUID Already exists. No new device UUID Generated")

    return deviceId
  }


  // Login Function
  const handleLogin = async (e) => {

    e.preventDefault();

    console.log({
      identifier,
      password
    });

    // API Call Here

    const deviceId = getDeviceId()

    try {
      const response = await userLogin({ identifier, password, deviceId })
      console.log("Login Response ", response);
      await refreshUser();
      console.log("Response User ", response);
      console.log("[LOGIN] Device UUID:", deviceId);
      navigate("/dashboard");

    }
    catch (error) {
      console.log("Error in Login Response ", error.response.data)
    }

  };



  return (
    <React.Fragment>

      <Navbar></Navbar>



      <div className="login-container">

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <h1 style={{ color: "white" }}>Login</h1>

          <div className="card">

            <div className={styles.loginTop}>
              <h2 style={{ color: "white" }}>Welcome Back</h2>
              <p style={{ color: "white" }}>Log in to keep the conversation going.</p>
            </div>
            <input
              type="text"
              placeholder="Enter Email or Username"
              className="inputPrimary"
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value)
              }
            />

            <input
              type="password"
              className="inputPrimary"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button className="purpleGradientButton" type="submit">
              Login
            </button>
          </div>


        </form>

      </div>
    </React.Fragment>
  );
}

export default Login;
