import React from 'react';

import UserItem from './UserItem';
import './UsersList.css';
import Card from '../../shared/components/UIElements/Card';

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h1>No users found</h1>
        </Card>
      </div>
    );
  }
  return (
    <div className='center'>
      <ul className='users-list'>
        {props.items.map((item) => {
          return (
            <UserItem
              key={item._id + item.image}
              Item={item._id}
              image={item.imageUrl}
              name={item.name}
              placeCount={item.places.length}
            />
          );
        })}
      </ul>
    </div>
  );
};
export default UsersList;
