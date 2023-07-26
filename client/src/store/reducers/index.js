// src/store/reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add more reducers if you have them
});

export default rootReducer;
