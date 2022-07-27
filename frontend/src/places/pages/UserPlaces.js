import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hook/http-hook';

import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  const { sendRequest, errorHandler, loading, errorMessage } = useHttpClient();
  const [places, setPlaces] = useState([]);

  const UserId = useParams().UserId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await sendRequest(
          'http://localhost:5000/api/places/users/' + UserId,
        );
        setPlaces(response.userPlace);
      } catch (error) {}
    };
    fetchUsers();
  }, [UserId, sendRequest]);

  const placeDeletedHandler = (deletedId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={errorHandler} />
      {loading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!loading && places && (
        <PlaceList items={places} onDeletePlace={placeDeletedHandler} />
      )}
      ;
    </React.Fragment>
  );
};

export default UserPlaces;
