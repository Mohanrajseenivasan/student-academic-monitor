import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";
localStorage.setItem("email", email);
localStorage.setItem("role", res.data.role);

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill all fields");
      return;
    }

    try {
      // LOGIN
      if (isLogin) {
        const res = await axios.post(`${BASE_URL}/api/login`, {
          email,
          password,
        });

        alert(res.data.msg);

        // save user info
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("role", res.data.role);

        // role based redirect
        if (res.data.role === "admin") {
          window.location.replace("/admin");
        } else if (res.data.role === "faculty") {
          window.location.replace("/faculty");
        } else {
          window.location.replace("/student");
        }
      }

      // REGISTER
      else {
        await axios.post(`${BASE_URL}/api/register`, {
          name,
          email,
          password,
          role,
        });

        alert("Registered Successfully. Please Login.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err.response) {
        alert(err.response.data.msg);
        localStorage.setItem("userId", res.data.id);
localStorage.setItem("role", res.data.role);
      } else {
        alert("Backend not running. Start server!");
      }
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            placeholder="Name"
            style={styles.input}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {!isLogin && (
          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <input
          placeholder="Email"
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p>
          {isLogin ? "No account?" : "Have account?"}
          <span
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Sign Up" : " Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },
  box: {
    width: "350px",
    padding: "25px",
    background: "white",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  link: {
    color: "#2563eb",
    cursor: "pointer",
    marginLeft: "5px",
  },
};

export default Auth;
