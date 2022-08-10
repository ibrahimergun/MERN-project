import React, { useContext, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

//import Users from './user/pages/Users';
//import NewPlace from './places/pages/NewPlace';
//import UserPlaces from './places/pages/UserPlaces';
//import UpdatePlace from './places/pages/UpdatePlace';
//import Auth from './user/pages/Auth';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import LoginContext from './shared/context/Login-Context';

const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
  var { isLoggedIn } = useContext(LoginContext);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:UserId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        <Route path='/places/:PlaceId' exact>
          <UpdatePlace />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:UserId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  }
  return (
    <Router>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className='center'>
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </Router>
  );
};

export default App;
