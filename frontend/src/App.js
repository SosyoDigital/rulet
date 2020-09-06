import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import NavBar from './components/Navigation/Navigation';
import GameScreen from './components/GameScreen/GameScreen';
import UserProfile from './components/UserProfile/UserProfile';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";


function App() {
  return (
    <div>
      <NavBar/>
      <Route path="/profile" exact component={UserProfile}/>
      <Route path="/" exact component={GameScreen}/>
    </div>
  );
}

export default withRouter(App);
