import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import { reducer as user, persistMiddleware } from './user';
import { reducer as contacts } from './contacts';
import { reducer as other } from './other';


const reducer = combineReducers({
  user,
  contacts,
  other
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(
        thunk,
        persistMiddleware
      )
    )
  );
};
