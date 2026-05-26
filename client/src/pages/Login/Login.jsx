import { useState } from "react";
import "./login.css";
import { userLogin } from "../../services/api";

function Login() {

  // States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");



  // Login Function
  const handleLogin = async (e) => {

    e.preventDefault();

    console.log({
      identifier,
      password
    });

    // API Call Here

    try{
      const response = await userLogin({identifier,password})
      console.log("Login Response ",response)

    }
    catch(error){
      console.log("Error in Login Response ",error.response.data)
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