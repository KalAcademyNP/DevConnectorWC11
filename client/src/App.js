import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import store from './store';
import { logoutUser } from './actions/authActions';
import setAuthToken from './utils/setAuthToken';
import {SET_USER} from './actions/types';

if (localStorage.jwtToken) {
  const decoded = jwt_decode(localStorage.jwtToken);
  const currentTime = Date.now()/1000;
  if (decoded.exp < currentTime){
    //Logout
    store.dispatch(logoutUser())

    //redirect
    window.location.href="/login";
  }

  //set the token to the auth header
  setAuthToken(localStorage.jwtToken);
  //dispatch set_user 
  store.dispatch({
    type: SET_USER,
    payload: decoded
  }); 

}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />

              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />

            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App;

