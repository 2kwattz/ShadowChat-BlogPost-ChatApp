import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { userLogin } from "../../services/api";
import { useAuth } from "../../context/authContext";


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

  useEffect(()=>{

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

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <h1>Login</h1>

        <input
          type="text"
          placeholder="Enter Email"
          value={identifier}
          onChange={(e) =>
            setIdentifier(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;
