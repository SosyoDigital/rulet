import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import NavBar from './components/Navigation/Navigation';
import GameScreen from './components/GameScreen/GameScreen';
import UserProfile from './components/UserProfile/UserProfile';
import LeaderBoard from './components/GameScreen/LeaderBoard/LoaderBoard';
import AllPersonalBets from './components/UserProfile/AllPersonalBets/AllPersonalBets';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";


class App extends Component {
  render(){
    return (
      <div>
        <NavBar/>
        <Route path="/profile" render={(routeProps) => <UserProfile {...routeProps}/>}/>
        <Route path="/" exact component={GameScreen}/>
        <Route path="/leaderboard" exact component={LeaderBoard}/>
        <Route path="/allbets" render={(routeProps) => <AllPersonalBets {...routeProps}/>}/>
      </div>
    );
  }
}

export default withRouter(App);
