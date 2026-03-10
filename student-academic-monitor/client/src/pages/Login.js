
import { useState } from "react";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );

      alert(res.data.msg);

      if (res.data.role === "student")
        window.location.href = "/student";

      else if (res.data.role === "faculty")
        window.location.href = "/faculty";

      else
        window.location.href = "/admin";

    } catch (err) {
      alert("Login failed");
    }

  };

  return (
    <div style={{ textAlign:"center", marginTop:"100px" }}>

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      /><br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      /><br/><br/>

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
}

export default Login;
