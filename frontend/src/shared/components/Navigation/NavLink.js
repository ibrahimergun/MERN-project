import React, { useContext } from 'react';

import { NavLink } from 'react-router-dom';
import './NavLink.css';
import LoginContext from '../../context/Login-Context';

const NavLinks = (props) => {
  let { isLoggedIn, logout, uid } = useContext(LoginContext);

  const logoutHandler = () => {
    logout();
  };

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          All Users
        </NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${uid}/places/`}>My Places</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to='/places/new'>Add Place </NavLink>
        </li>
      )}
      <li>
        <NavLink to='/auth' onClick={logoutHandler}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
