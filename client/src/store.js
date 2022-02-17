import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middlware = [thunk];
// const store = createStore(
//                 rootReducer,
//                 {},
//                 compose(
//                   applyMiddleware(...middlware),
//                    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                 ));
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
              rootReducer, // list of all reducers
              {},
              composeEnhancers(
                applyMiddleware(...middleware)
              ));
export default store;
