import React, { useContext } from 'react';

import { NavLink } from 'react-router-dom';
import './NavLink.css';
import LoginContext from '../../context/Login-Context';

const NavLinks = (props) => {
  let { isLoggedIn, logout } = useContext(LoginContext);
  

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          All Users
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to='/u1/places'>My Places</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to='/places/new'>Add Place </NavLink>
        </li>
      )}
      <li>
        <NavLink to={isLoggedIn ? '/forward' : '/auth'} onClick={logout}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
