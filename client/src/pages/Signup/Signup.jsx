import React, { useState, useEffect } from "react";
import { userRegistration } from "../../services/api";
import { useAuth } from "../../context/authContext";

function Signup() {

  const { setUser } = useAuth();

  // States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
  });

  // Getting Device Id


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



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    const response = await userRegistration(formData);
    console.log("Response : ", response)
    setUser(response.user)

    if (!response.status) {
      alert(`Error In Registration ${response?.error} \n`)
    }
  };




  return (
    <div>
      <h1>Signup Page</h1>

      <form className="login-form"
        onSubmit={handleSubmit}>


        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter First Name" />

        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter Last Name" />

        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" />
        <br /><br />

        <input type="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter Username" />
        <br /><br />

        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Enter Password" />
        <br /><br />

        <input
          type="date"
          name="date_of_birth"
          id="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />

        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
          />
          Male
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          Female
        </label>

        <label>
          <input
            type="radio"
            name="gender"
            value="other"
            checked={formData.gender === "other"}
            onChange={handleChange}
          />
          Other
        </label>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
