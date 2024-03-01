import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 300,
    height: 300,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

const TransferList = (props) => {
  const classes = useStyles();

  const customList = (items, type) => (
    <>
    <Typography align="center">{type.toUpperCase()}</Typography>
      <Paper className={classes.paper}>
        <List dense component="div" role="list">
          {items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`;
  
            return (
              <ListItem dense key={value} role="listitem" button onClick={props.handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    checked={props.checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Paper>
    </>
  );

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      {props.assigned && <Grid item>{customList(props.assigned, 'assigned')}</Grid>}
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={props.handleCheckedRight}
            disabled={props.leftChecked.length === 0}
            aria-label="move selected available"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={props.handleCheckedLeft}
            disabled={props.rightChecked.length === 0}
            aria-label="move selected assigned"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      {props.available && <Grid item>{customList(props.available, 'available')}</Grid>}
    </Grid>
  );
}

TransferList.propTypes ={
    assigned: PropTypes.array.isRequired,
    available: PropTypes.array.isRequired,
    checked: PropTypes.array.isRequired,
    leftChecked: PropTypes.array.isRequired,
    rightChecked: PropTypes.array.isRequired,
    handleCheckedLeft: PropTypes.func.isRequired,
    handleCheckedRight: PropTypes.func.isRequired,
    handleToggle: PropTypes.func.isRequired,
}

export default TransferList;