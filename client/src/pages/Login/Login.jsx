import { useState } from "react";
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
  const { setUser } = useAuth();


  // Login Function
  const handleLogin = async (e) => {

    e.preventDefault();

    console.log({
      identifier,
      password
    });

    // API Call Here

    try {
      const response = await userLogin({ identifier, password })
      console.log("Login Response ", response);
      setUser(response);
      console.log("Response User ",response)
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