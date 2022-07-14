import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u2',
      name: 'Max Schwarz',
      image:
        'https://picsum.photos/500/300',
        placeCount: 0
    }, {
      id: 'u1',
      name: 'Max Schwarz',
      image:
        'https://picsum.photos/501/300',
        placeCount: 5
    }, {
      id: 'u1',
      name: 'Max Schwarz',
      image:
        'https://picsum.photos/500/301',
      placeCount: 1
    }, {
      id: 'u3',
      name: 'Max Schwarz',
      image:
        'https://picsum.photos/500/299',
      placeCount: 4
    }

  ];

  return <UsersList items={USERS} />;
};

export default Users;
