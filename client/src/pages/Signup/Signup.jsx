function Signup() {
  return (
    <div>
      <h1>Signup Page</h1>

      <input type="text" name="firstName" placeholder="Enter First Name" />

      <input type="text" name="lastName" placeholder="Enter Last Name" />

      <input type="text" name="email" placeholder="Enter Email" />
      <br /><br />

      <input type="email" placeholder="Enter Email" />
      <br /><br />

      <input type="password" placeholder="Enter Password" />
      <br /><br />

      <button>Signup</button>
    </div>
  );
}

export default Signup;