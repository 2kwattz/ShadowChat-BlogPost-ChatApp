import React, { useState, useEffect } from "react";
import { userRegistration } from "../../services/api";

const handleSubmit = (data) => {

}

function Signup() {
  return (
    <div>
      <h1>Signup Page</h1>

      <form className="login-form"
        onSubmit={handleSubmit}>
        </form>
          

      <input type="text" name="firstName" placeholder="Enter First Name" />

      <input type="text" name="lastName" placeholder="Enter Last Name" />

      <input type="email" name="email" placeholder="Enter Email" />
      <br /><br />

      <input type="username" name="username" placeholder="Enter Username" />
      <br /><br />

      <input type="password" name="password" placeholder="Enter Password" />
        <input type="password" name="confirmPassword" placeholder="Enter Password" />
      <br /><br />

      <input
        type="date"
        name="date_of_birth"
        id="date_of_birth"
      />

      <button>Signup</button>
    </div>
  );
}

export default Signup;