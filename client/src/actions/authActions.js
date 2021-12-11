import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { SET_USER, GET_ERRORS } from "./types"
import setAuthToken from "../utils/setAuthToken";

export const registerUser = (userData, history) => dispatch => {
     axios
       .post('/api/users/register', userData)
       .then(res => history.push('/login'))
       .catch(err => dispatch({
         type: GET_ERRORS,
         payload: err.response.data
       }));
}

export const loginUser = (userData, history) => dispatch => {
    axios
      .post('/api/users/login', userData)
      .then(res => {
        //Save token to localstorage (browser cache)
        const {token} = res.data;
        localStorage.setItem('jwtToken', token);
        //set the token to the auth header
        setAuthToken(token);
        //decode token
        const decoded = jwt_decode(token);
        //dispatch set_user 
        dispatch({
          type: SET_USER,
          payload: decoded
        });    
        history.push('/dashboard');
      })
      .catch(err => dispatch({
         type: GET_ERRORS,
         payload: err.response.data
       }));
}

//Logout user
export const logoutUser = () => dispatch => {
  //Remove token from localstorage
  localStorage.removeItem('jwtToken');
  //Remove the token from the auth header
  setAuthToken(false);
  //Clean the redux store
  dispatch({
    type: SET_USER,
    payload: {}
  });
}