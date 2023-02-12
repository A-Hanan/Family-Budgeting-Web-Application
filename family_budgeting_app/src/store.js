import { combineReducers } from "redux";

import { createStore, applyMiddleware } from "redux";

import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

import {
  loginUserReducer,
  registerUserReducer,
  getAllUsersReducers,
} from "./Reducers/userReducers";
import { createConversationReducers } from "./Reducers/messengerReducers";

const finalReducer = combineReducers({
  registerUserReducer: registerUserReducer,
  loginUserReducer: loginUserReducer,
  getAllUsersReducers: getAllUsersReducers,
  createConversationReducers: createConversationReducers,
});

const currentUser = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
  : null;

const receiverToCreateConv = {};

const initialState = {
  loginUserReducer: {
    currentUser: currentUser,
  },
  createConversationReducers: {
    receiverToCreateConv: receiverToCreateConv,
  },
};

const composeEnhancers = composeWithDevTools({});

const store = createStore(
  finalReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
