import React, { useEffect} from 'react';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hook/http-hook';

import UsersList from '../components/UsersList';

const Users = () => {
  const { sendRequest, errorHandler, loading, errorMessage, resData } =
  useHttpClient();
  const loadedDatas = resData.users;

  useEffect(() => {
    const fetchUsers = async () => {
      await sendRequest('http://localhost:5000/api/users')
        .then(successfulResponse)
        .catch(error);

      function successfulResponse(response) {}

      function error(error) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={errorHandler} />
      {loading && <LoadingSpinner asOverlay />}
      {!loading && loadedDatas && <UsersList items={loadedDatas} />}
    </React.Fragment>
  );
};

export default Users;
