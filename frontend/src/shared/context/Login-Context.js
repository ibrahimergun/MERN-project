import React, { createContext, useState, useCallback, useEffect } from 'react';

const LoginContext = createContext({
  uid: null,
  isLoggedIn: false,
  login: () => {},
  token: null,
  logout: () => {},
});

export default LoginContext;

let logoutTimer;

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [uid, setUid] = useState(null);

  const loginHandler = useCallback((id, token, expirationDate) => {
    setUid(id);
    setToken(token);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: id,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      }),
    );
  }, []);

  const logoutHandler = useCallback(() => {
    setUid(null);
    setTokenExpirationDate(null);
    setToken(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      loginHandler(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      );
    }
  }, [loginHandler]);

  const contextValue = {
    uid: uid,
    token: token,
    isLoggedIn: !!token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {props.children}
    </LoginContext.Provider>
  );
};
