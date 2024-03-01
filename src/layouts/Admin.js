import React, { useEffect, useState, createRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import store from 'redux/store';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import Navbar from 'components/Navbars/Navbar.js';
import Sidebar from 'components/Sidebar/Sidebar.js';

import routes from 'routes.js';
import Vehicle from 'views/Vehicle/Vehicle';
import RideShareCities from 'views/RideShareCities';
import RideShareHome from 'views/RideshareHome/RideShareHome';
import TradeIn from 'views/TradeIn/TradeIn';
import FinanceInfoPins from 'views/FinanceInfoPins/FinanceInfoPins';
import Blog from 'views/Blog';
import HeroImages from 'views/HeroImages/HeroImages';
import CarsList from 'views/CarsList/CarsList';

import styles from 'assets/jss/material-dashboard-react/layouts/adminStyle.js';
import { getListOfVehicles } from 'redux/actions/vehicles';
import { get360List } from 'redux/actions/vehicles360';
import NewPost from 'components/Blog/NewPost';

const switchRoutes = (
  <Switch>
    <Route path="/admin/blog/new-post" component={NewPost} />
    {routes.map((prop, key) => {
      if (prop.layout === '/admin') {
        return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
      }
      return null;
    })}
    <Route path="/admin/ride-share-cities" component={RideShareCities} />
    <Route path="/admin/rideshare-home" component={RideShareHome} />
    <Route path="/admin/trade-in" component={TradeIn} />
    <Route path="/admin/finance-info-pins" component={FinanceInfoPins} />
    <Route path="/admin/hero-images" component={HeroImages} />
    <Route path="/admin/blog" component={Blog} />
    <Route path="/admin/vehicle" component={Vehicle} />
    <Route path="/admin/cars-list" component={CarsList} />
    <Redirect from="/" to="/admin/cars-list" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = createRef();
  // states and functions
  const [state, setState] = useState({
    mobileOpen: false,
  });

  const handleDrawerToggle = () => {
    setState({ ...state, mobileOpen: !state.mobileOpen });
  };

  useEffect(() => {
    store.dispatch(getListOfVehicles());
    store.dispatch(get360List());
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.wrapper}>
      <Sidebar routes={routes} logoText={'MOTOPIA ADMIN'} handleDrawerToggle={handleDrawerToggle} open={state.mobileOpen} color={'blue'} {...rest} />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar routes={routes} handleDrawerToggle={handleDrawerToggle} {...rest} />
        <div className={classes.content}>
          <div className={classes.container}>{switchRoutes}</div>
        </div>
      </div>
    </div>
  );
}
