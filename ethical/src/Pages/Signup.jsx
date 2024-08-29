import "../Styles/Login.css"
import logo from '../images/google.svg'
import logo2 from '../images/github.svg'
import { useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [userData, setUserData] = useState({username: "", password: "", email: ""}) 
  // const [error, setError] = useState(null); 
  const navigate = useNavigate();
  const handleChange = (evt) => { 
    const changedField = evt.target.name
    const newValue = evt.target.value
    setUserData((currData) => {
      return  {
        ...currData,
        [changedField]: newValue,
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/register', userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // Ensures cookies are sent with the request
      });

      if (response.status === 200) {
        console.log("Registered successfully:", response.data);
        navigate('/CreateList', { state: { username: userData.username } })
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Signup failed. Please check your username and password.");
    }
  };


  return (
<div className="login-container">
  <h2 className="form-title">Sign up with</h2>
  <div className="social-login">
    <button className="social-button">
      <img src={logo} alt="" className="social-icon" />Google
    </button>
    <button className="social-button">
      <img src={logo2} alt="" className="social-icon" />Google
    </button>
  </div>
  <p className="seperator"><span>or</span></p>
  <form action="#" onSubmit={handleSubmit} className="login-form">
    <div className="input-wrapper">
     <input type="email" placeholder='Email' className='input-field' required name="email" value={userData.email} onChange={handleChange} autoFocus/>
      <i className="material-symbols-rounded">Email</i>
    </div>
    <div className="input-wrapper">
     <input type="text" placeholder='Username' className='input-field' required name="username" value={userData.username} onChange={handleChange} autoFocus/>
      <i className="material-symbols-rounded"></i>
    </div>
    <div className="input-wrapper">
     <input type="password" placeholder='Password' className='input-field' required name="password" value={userData.password} onChange={handleChange}/>
      <i className="material-symbols-rounded">Lock</i>
    </div>
    <button className="login-button">Sign Up</button>
  </form>
  <p className="signup-text">Already have an account? <a href="/Login">Login</a></p>
</div>
  )
}