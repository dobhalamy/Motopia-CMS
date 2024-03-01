import { SET_CURRENT_USER, MAKE_APP_READY } from '../constants/auth';

const initialState = {
  isAppReady: false,
  isAuthenticated: false,
  currentUser: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!action.payload,
        currentUser: action.payload,
      };
    case MAKE_APP_READY:
      return {
        ...state,
        isAppReady: true,
      };

    default:
      return state;
  }
};
