import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import catLogo from '../assets/catLogo.png';

export default function Navbar() {

  const { logout, current_user } = useContext(UserContext)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={catLogo} className="navbar-logo-img" alt="Logo" />
          <span className="navbar-title">Panthos</span>
        </Link>
        <button className="navbar-toggle">
          <span className="sr-only">Open main menu</span>
          <svg className="navbar-toggle-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className="navbar-menu">
          <ul className="navbar-list">
            {current_user ? (
              <>
                <li><Link to="/" className="navbar-link navbar-link-active">My entries</Link></li>
                <li><Link to="/profile" className="navbar-link">Profile</Link></li>
                <li><Link to="/addentry" className="navbar-link">Add an entry</Link></li>
                <li><Link to="/about" className="navbar-link">About</Link></li>
                <li><Link onClick={() => logout()} className="navbar-link">Logout</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/register" className="navbar-link">Register</Link></li>
                <li><Link to="/login" className="navbar-link">Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
