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

export const loginUser = userData => dispatch => {
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
      })
      .catch(err => dispatch({
         type: GET_ERRORS,
         payload: err.response.data
       }));
}