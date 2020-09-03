import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import GameScreen from './containers/GameScreen/GameScreen';


class App extends Component {
  render(){
    return(
      <div>
        <Layout>
          <Route path='/' exact component={GameScreen}/>
        </Layout>
      </div>
    )
  }
}

export default App;
