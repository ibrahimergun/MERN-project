import React, { useState, useRef, useEffect, useContext } from 'react';
import {useHistory } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card.js';
import Button from '../../shared/components/FormElements/Button.js';
import Modal from '../../shared/components/UIElements/Modal.js';
import Map from '../../shared/components/UIElements/Map.js';
import LoginContext from '../../shared/context/Login-Context.js';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hook/http-hook';

import './PlaceItem.css';

const PlaceItem = (props) => {
  const { sendRequest, errorHandler, loading, errorMessage } = useHttpClient();
  let { isLoggedIn, uid } = useContext(LoginContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [changed, setChanged] = useState('');
  const inputRef = useRef();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  if (inputValue.length === 0) {
    var address = props.address;
  } else {
    address = inputValue;
  }

  const showConfirmHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelConfimHandler = () => {
    setShowConfirmModal(false);
  };

  const history = useHistory();

  const confirmDeleteHandler = async (event) => {
    event.preventDefault();
    setShowConfirmModal(false);
    await sendRequest('http://localhost:5000/api/places/' + props.id, 'DELETE', {
      'content-type': 'application/json',
    })
      .then(successfulResponse)
      .catch(error);

    function successfulResponse(response) {
      console.log('deleted');
      history.push('/' + uid + '/places');
      props.onDelete(props.id);
    }
    function error(error) {
      console.log(error);
    }
  };

  const changeHandler = (event) => {
    event.preventDefault();
    setChanged(inputRef.current.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setInputValue(changed);
    }, 1500);
    return () => clearTimeout(timer);
  }, [changed]);

  if (loading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay/>
      </div>
    );
  };

  return (
    <React.Fragment>
    <ErrorModal error={errorMessage} onClear={errorHandler} />

    <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <div>
            <input
              className='input'
              ref={inputRef}
              onChange={changeHandler}
              id='pac-input'
              type='text'
              placeholder='Search Address'
            />
          </div>
          <Map
            center={props.coordinates}
            zoom={16}
            address={address}
            inputValue={inputValue}
          />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelConfimHandler}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={cancelConfimHandler} inverse>
              CANCEL
            </Button>
            <Button onClick={confirmDeleteHandler} danger>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          <div className='place-item__image'>
            <img src={props.image} alt={props.title} />
          </div>
          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {isLoggedIn && (
              <Button onClick={showConfirmHandler} danger>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li> 
    </React.Fragment>
  );
};

export default PlaceItem;
