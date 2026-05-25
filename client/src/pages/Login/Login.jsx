import { useState } from "react";
import "./login.css";

function Login() {

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  // Login Function
  const handleLogin = (e) => {

    e.preventDefault();

    console.log({
      email,
      password
    });

    // API Call Here
  };



  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
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