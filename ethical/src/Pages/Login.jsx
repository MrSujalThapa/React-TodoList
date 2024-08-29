import "../Styles/Login.css";
import logo from '../images/google.svg';
import logo2 from '../images/github.svg';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // Ensures cookies are sent with the request
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        navigate('/CreateList', { state: { username: userData.username } }) // Redirect after successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Log in with</h2>
      <div className="social-login">
        <button className="social-button">
          <img src={logo} alt="Google" className="social-icon" />Google
        </button>
        <button className="social-button">
          <img src={logo2} alt="GitHub" className="social-icon" />GitHub
        </button>
      </div>
      <p className="seperator"><span>or</span></p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            required
            name="username"
            value={userData.username}
            onChange={handleChange}
            autoFocus
          />
        </div>
        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            required
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <button className="login-button">Log In</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="signup-text">Don't have an account? <a href="/register">Signup now</a></p>
    </div>
  );
}
