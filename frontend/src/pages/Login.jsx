import React from "react";
// import catLogo from '../assets/catLogo.png';
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function Login() {

    const {login} = useContext(UserContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ====> To Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); 

    login(email, password)

    };
    return (
        <div className="login-container">
            {/* <img src={catLogo} alt="cat-logo"/> */}
            <h2>Sign in ♡</h2>
            <form onSubmit={handleSubmit}>
                {/* <label>Email:</label> */}
                <br></br>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}  placeholder="Email"/>
                <br></br>
                <br></br>
                {/* <label>Password:</label> */}
                <br></br>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Password" />
                <br></br>
                <br></br>
                <br></br>
                <button type="submit">Login</button>
                <br></br>
                <br></br>
                <p>Don't have an account?<Link to="/Register"> Register</Link></p>
            </form>
    
      </div>
      
    )
}