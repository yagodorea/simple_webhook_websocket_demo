import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Simple App</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/remote-config" className={({ isActive }) => isActive ? 'active' : ''}>
              Remote Config
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar