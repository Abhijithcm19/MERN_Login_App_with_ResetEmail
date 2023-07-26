// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers"; // You'll create this reducer later

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
