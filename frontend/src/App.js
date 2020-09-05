import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import NavBar from './components/Navigation/Navigation';
import GameScreen from './components/GameScreen/GameScreen';
import SignupScreen from './components/AuthScreens/Signup/Signup';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";


function App() {
  return (
    <div>
      <NavBar/>
      <Route path="/" exact component={GameScreen}/>
    </div>
  );
}

export default withRouter(App);
