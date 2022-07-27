import React, { createContext, useState, useCallback } from 'react';

const LoginContext = createContext({
  uid: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export default LoginContext;

export const AuthContextProvider = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  const [uid, setUid] = useState(null);

  const loginHandler = useCallback((id) => {
    setUid(id);
    setIsLogin(true);
  }, []);

  const logoutHandler = useCallback(() => {
    setUid(null);
    setIsLogin(false);
  }, []);

  const contextValue = {
    uid: uid,
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
