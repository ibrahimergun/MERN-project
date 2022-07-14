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
              key={item.id + item.image}
              Item={item.id}
              image={item.image}
              name={item.name}
              placeCount={item.placeCount}
            />
          );
        })}
      </ul>
    </div>
  );
};
export default UsersList;
