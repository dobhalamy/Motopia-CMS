/*eslint-disable*/
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import styles from 'assets/jss/material-dashboard-react/components/sidebarStyle.js';

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const [nestedMenuOpen, setNestedMenuOpen] = useState({});
  const { image, routes } = props;

  const renderMenuItems = routes => {
    return routes.map((route, key) => {
      const hasNestedRoutes = route.children && route.children.length > 0;

      if (hasNestedRoutes) {
        return (
          <div key={key}>
            <ListItem button onClick={() => handleNestedMenuToggle(key)} style={{ paddingLeft: '16px' }}>
              <ListItemIcon style={{ color: 'white' }}>{typeof route.icon === 'string' ? <Icon>{route.icon}</Icon> : <route.icon />}</ListItemIcon>
              <ListItemText primary={route.name} style={{ color: 'white' }} />
              {nestedMenuOpen[key] ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
            </ListItem>
            <Collapse in={nestedMenuOpen[key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {route.children.map((childRoute, childKey) => (
                  <NavLink key={childKey} to={childRoute.layout + childRoute.path}>
                    <ListItem button style={{ paddingLeft: '32px' }}>
                      <ListItemIcon style={{ color: 'white' }}>{typeof childRoute.icon === 'string' ? <Icon>{childRoute.icon}</Icon> : <childRoute.icon />}</ListItemIcon>
                      <ListItemText primary={childRoute.name} style={{ color: 'white' }} />
                    </ListItem>
                  </NavLink>
                ))}
              </List>
            </Collapse>
          </div>
        );
      } else {
        const fullPath = route.layout + route.path;

        return (
          <NavLink key={key} to={fullPath}>
            <ListItem button>
              <ListItemIcon style={{ color: 'white' }}>{typeof route.icon === 'string' ? <Icon>{route.icon}</Icon> : <route.icon />}</ListItemIcon>
              <ListItemText primary={route.name} style={{ color: 'white' }} />
            </ListItem>
          </NavLink>
        );
      }
    });
  };

  const handleNestedMenuToggle = key => {
    setNestedMenuOpen(prevOpen => ({
      ...prevOpen,
      [key]: !prevOpen[key],
    }));
  };

  return (
    <div>
      <Hidden mdUp implementation="css">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor={'right'}
          open={props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div className={classes.sidebarWrapper}>{renderMenuItems(routes)}</div>
          {image !== undefined ? <div className={classes.background} style={{ backgroundImage: 'url(' + image + ')' }} /> : null}
        </Drawer>
      </Hidden>

      <Hidden smDown implementation="css">
        {/* Desktop Drawer */}
        <Drawer
          anchor={'left'}
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.sidebarWrapper}>{renderMenuItems(routes)}</div>
          {image !== undefined ? <div className={classes.background} style={{ backgroundImage: 'url(' + image + ')' }} /> : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(['purple', 'blue', 'green', 'orange', 'red']),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
