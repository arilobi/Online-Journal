import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";

export default function Register() {
    // ---. getting data from userContext that's in context
    const {addUser} = useContext(UserContext)

    // const [name, setname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // ---> Handle form submission 
    const handleSubmit = (e) => {
        e.preventDefault();

        addUser(name, email, password)

        console.log('name:', name)
        console.log('email:', email)
        console.log('password:', password)
    }

    return (
        <div className="register-container">
            {/* <img src={catLogo} alt="cat-logo"/> */}
            <h2>Register ♡</h2>
            <form onSubmit={handleSubmit}>
                {/* <label>Email:</label> */}
                <br></br>
                <input type="text" value = {name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
                <br></br>
                <br></br>
                <input type="email" value = {email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <br></br>
                <br></br>
                {/* <label>Password:</label> */}
                <br></br>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}placeholder="Password" />
                <br></br>
                <br></br>
                <br></br>
                <button type="submit">Create an account</button>
                <br></br>
                <br></br>
                <p>Do you already have an account?<Link to="/Login"> Sign in!</Link></p>
            </form>
    
      </div>
    )
}