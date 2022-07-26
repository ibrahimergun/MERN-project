import React, { createContext, useState, useCallback } from 'react';

const LoginContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export default LoginContext;

export const AuthContextProvider = (props) => {
  const [isLogin, setIsLogin] = useState(false);

  const loginHandler = useCallback(() => {
    setIsLogin(true);
  }, []);

  const logoutHandler = useCallback(() => {
    setIsLogin(false);
  }, []);

  const contextValue = {
    isLoggedIn: isLogin,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {props.children}
    </LoginContext.Provider>
  );
};
