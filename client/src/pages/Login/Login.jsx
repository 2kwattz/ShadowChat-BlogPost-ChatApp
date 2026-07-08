import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../services/api";
import { useAuth } from "../../context/authContext";
import Navbar from "../../components/Navbar/navbar";

import styles from './login.module.css';


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
      <div className="radialblurcontainer">


        <Navbar></Navbar>



        <div className={styles.loginContainer}>

          <form
            className={styles.loginForm}
            onSubmit={handleLogin}
          >

            <h1 style={{ color: "white" }}>Login</h1>

            <div className={styles.card}>

              {/* Login Left */}

              <div className={styles.loginLeft}>

                <svg class="network-svg" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"></feGaussianBlur><feMerge><feMergeNode in="b"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter>
                  </defs>
                  <line x1="400" y1="480" x2="220" y2="320" stroke="#22d3ee" stroke-width="0.7" stroke-opacity="0.22"></line>
                  <line x1="400" y1="480" x2="560" y2="260" stroke="#a78bfa" stroke-width="0.7" stroke-opacity="0.22"></line>
                  <line x1="400" y1="480" x2="600" y2="560" stroke="#22d3ee" stroke-width="0.7" stroke-opacity="0.2"></line>
                  <line x1="400" y1="480" x2="180" y2="640" stroke="#a78bfa" stroke-width="0.7" stroke-opacity="0.2"></line>
                  <line x1="400" y1="480" x2="430" y2="740" stroke="#22d3ee" stroke-width="0.6" stroke-opacity="0.18"></line>
                  <line x1="220" y1="320" x2="110" y2="180" stroke="#22d3ee" stroke-width="0.6" stroke-opacity="0.16"></line>
                  <line x1="560" y1="260" x2="660" y2="130" stroke="#a78bfa" stroke-width="0.6" stroke-opacity="0.16"></line>
                  <line x1="600" y1="560" x2="710" y2="660" stroke="#22d3ee" stroke-width="0.6" stroke-opacity="0.16"></line>
                  <line x1="180" y1="640" x2="90" y2="760" stroke="#a78bfa" stroke-width="0.6" stroke-opacity="0.16"></line>
                  <line x1="430" y1="740" x2="330" y2="860" stroke="#22d3ee" stroke-width="0.6" stroke-opacity="0.15"></line>

                  <circle cx="400" cy="480" r="7" fill="#22d3ee" opacity="0.9" filter="url(#glow)"></circle>
                  <circle cx="400" cy="480" r="16" fill="#22d3ee" opacity="0.08"></circle>
                  <circle cx="220" cy="320" r="4" fill="#a78bfa" opacity="0.75" filter="url(#glow)"></circle>
                  <circle cx="560" cy="260" r="4" fill="#22d3ee" opacity="0.7" filter="url(#glow)"></circle>
                  <circle cx="600" cy="560" r="3.5" fill="#a78bfa" opacity="0.7" filter="url(#glow)"></circle>
                  <circle cx="180" cy="640" r="3.5" fill="#22d3ee" opacity="0.65" filter="url(#glow)"></circle>
                  <circle cx="430" cy="740" r="3" fill="#a78bfa" opacity="0.6"></circle>
                  <circle cx="110" cy="180" r="2.5" fill="#22d3ee" opacity="0.5"></circle>
                  <circle cx="660" cy="130" r="2.5" fill="#a78bfa" opacity="0.5"></circle>
                  <circle cx="710" cy="660" r="2.5" fill="#22d3ee" opacity="0.5"></circle>
                  <circle cx="90" cy="760" r="2.5" fill="#a78bfa" opacity="0.5"></circle>
                  <circle cx="330" cy="860" r="2.5" fill="#22d3ee" opacity="0.45"></circle>

                  <circle cx="220" cy="320" r="19" fill="#0d1121" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.4"></circle>
                  <text x="220" y="325" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="11" font-weight="600" fill="#22d3ee" opacity="0.85">AK</text>
                  <circle cx="600" cy="560" r="17" fill="#0d1121" stroke="#a78bfa" stroke-width="1" stroke-opacity="0.4"></circle>
                  <text x="600" y="565" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="10.5" font-weight="600" fill="#a78bfa" opacity="0.85">MR</text>
                  <circle cx="180" cy="640" r="15" fill="#0d1121" stroke="#22d3ee" stroke-width="1" stroke-opacity="0.4"></circle>
                  <text x="180" y="644" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="9.5" font-weight="600" fill="#22d3ee" opacity="0.8">JP</text>
                  <circle cx="560" cy="260" r="14" fill="#0d1121" stroke="#a78bfa" stroke-width="1" stroke-opacity="0.4"></circle>
                  <text x="560" y="264" text-anchor="middle" font-family="Instrument Sans, sans-serif" font-size="9" font-weight="600" fill="#a78bfa" opacity="0.8">SL</text>
                </svg>

                <h1>
                  Where the conversation
                  never goes quiet.
                </h1>

                <p>Log back in to your communities, your chatrooms, and the threads you left mid-argument.</p>

              </div>


              {/* Login Right */}
              <div className={styles.loginRight}>

                <div className={styles.loginRightInner}>

                  <h2 style={{ color: "white" }}>Welcome Back</h2>
                  <p style={{ color: "white" }}>Log in to keep the conversation going.</p>
                </div>


                <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 50px" }}>


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
              </div>
            </div>


          </form>

        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
