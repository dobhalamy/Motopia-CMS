import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ToastProvider } from 'react-toast-notifications';

import store from 'redux/store';
import { isAppReadySelector, isAuthenticatedSelector } from 'redux/selectors';
import setAuthToken from 'redux/setAuthToken';
import { logoutUser, setUserProfile, makeAppReady } from 'redux/actions/auth';
import MuiAlert from '@material-ui/lab/Alert';

import Admin from 'layouts/Admin.js';
import Login from 'views/Login/Login';
import Progress from 'components/Progress/Progress';

import 'assets/css/material-dashboard-react.css?v=1.8.0';
import { AuthRoutes } from 'client';

const hist = createBrowserHistory();

if (localStorage.token) {
  setAuthToken(localStorage.token);
  (async () => {
    try {
      const response = await AuthRoutes.getProfile();
      localStorage.setItem('token', response.token);
      setAuthToken(response.token);
      await store.dispatch(
        setUserProfile({
          email: response.email,
          role: response.role,
          id: response._id,
          status: response.status,
        })
      );
    } catch (error) {
      console.error(error);
      store.dispatch(logoutUser());
    }
  })();
} else {
  store.dispatch(makeAppReady());
}

const RestrictedRoute = connect(
  createStructuredSelector({
    isAppReady: isAppReadySelector,
    isAuthenticated: isAuthenticatedSelector,
  })
)(({ component, isAppReady, isAuthenticated, ...props }) => {
  let renderedComponent;
  if (isAppReady) {
    renderedComponent = isAuthenticated ? component : Login;
  } else {
    renderedComponent = Progress;
  }

  return <Route {...props} component={renderedComponent} />;
});

RestrictedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
};

RestrictedRoute.defaultProps = {
  isAuthenticated: false,
};

function Alert(props) {
  return <MuiAlert style={{ zIndex: 2000 }} elevation={6} variant="filled" {...props} />;
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastProvider
        components={{ Toast: Alert }}
        autoDismiss
        autoDismissTimeout={2500}
        placement="top-center"
        newestOnTop
        style={{
          zIndex: 2000,
        }}
      >
        <Router history={hist}>
          <Switch>
            <RestrictedRoute path="/" component={Admin} />
          </Switch>
        </Router>
      </ToastProvider>
    </BrowserRouter>
  </Provider>,

  document.getElementById('root')
);
