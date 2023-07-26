// src/store/reducers/authReducer.js
const initialState = {
  username: '',
  active: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };
    // Add more cases for other actions if needed
    default:
      return state;
  }
};

export const setUsername = (username) => ({
  type: 'SET_USERNAME',
  payload: username,
});

export default authReducer;
