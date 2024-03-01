import { SET_CURRENT_USER, MAKE_APP_READY } from '../constants/auth';
import setAuthToken from '../setAuthToken';

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded,
});

export const makeAppReady = () => {
  return { type: MAKE_APP_READY };
};

export const setUserProfile = user => async dispatch => {
  dispatch(setCurrentUser(user));
  dispatch(makeAppReady());
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('token');
  localStorage.clear();
  setAuthToken(false);
  dispatch(setUserProfile(null));
};
