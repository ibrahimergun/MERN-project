import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

export const useHttpClient = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [resData , setResData] = useState([]);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      await axios(url, {
        method: method,
        data: body,
        headers: headers,
        signal: httpAbortCtrl.signal,
      })
        .then(successfulResponse)
        .catch(error);

      function successfulResponse(response) {
        const responseData = response.data;
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );
        setLoading(false);
        setResData(responseData.users);
        //return responseData;
      }
      function error(err) {
        setErrorMessage(
          err.response.data.message + ' ' + err.response.status ||
            'Something went wrong, please try again.',
        );
        console.log(
          err.response.data.message,
          err.response.status || 'Something went wrong, please try again.',
        );
        setLoading(false);
        throw err;
      }
    },
    [],
  );

  const errorHandler = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { sendRequest, errorHandler, loading, errorMessage, resData };
};
