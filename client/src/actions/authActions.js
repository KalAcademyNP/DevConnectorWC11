import { SET_USER, GET_ERRORS } from "./types"
import axios from 'axios';

export const registerUser = (userData, history) => dispatch => {
     axios
       .post('/api/users/register', userData)
       .then(res => history.push('/login'))
       .catch(err => dispatch({
         type: GET_ERRORS,
         payload: err.response.data
       }));
}

export const loginUser = userData => dispatch => {
    axios
      .post('/api/users/login', userData)
      .then(res => {
        //Save token to localstorage (browser cache)
        //set the token to the auth header
        //dispatch set_user 
      })
      .catch(err => dispatch({
         type: GET_ERRORS,
         payload: err.response.data
       }));
}