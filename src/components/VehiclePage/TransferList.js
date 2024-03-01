import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 400,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const TransferList = (props) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(props.installed);
  const [right, setRight] = React.useState(props.possible);

  React.useEffect(() => {
    if (props.installed) {
      setLeft(props.installed);
      setRight(props.possible);
    }
  }, [props.installed, props.possible]);
  
  const parsedLeft = left.map(el => el.featureId);
  const parsedRight = right.map(el => el.featureId);

  const leftChecked = intersection(checked, parsedLeft);
  const rightChecked = intersection(checked, parsedRight);

  const reLeft = leftChecked.map(value => left.find(el => el.featureId === value));
  const reRight = rightChecked.map(value => right.find(el => el.featureId === value));

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(reLeft));
    setLeft(not(left, reLeft));
    setChecked([]); // not(checked, reLeft)
    props.handlePossible(right.concat(reLeft));
    props.handleInstalled(not(left, reLeft));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(reRight));
    setRight(not(right, reRight));
    setChecked([]); // not(checked, reRight)
    props.handleInstalled(left.concat(reRight));
    props.handlePossible(not(right, reRight));
    props.handleParseFeatures(reRight);
  };

  const customList = (title, items) => (
    <Card>
      <Typography align="center">{title.toUpperCase()}</Typography>
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const { featureId, featureName, featureDesc } = value;
          const labelId = `transfer-list-all-item-${featureName}-label`;

          return (
            <LightTooltip 
              title={featureDesc || 'No description'}
              placement={title === 'Possible' ? 'right' : 'left'}
              key={featureId}
            >
              <ListItem role="listitem" button onClick={handleToggle(featureId)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(featureId) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={featureName} />
              </ListItem>
            </LightTooltip>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center" className={classes.root}>
        <Grid item>{customList('Installed', left)}</Grid>
        <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
        <Grid item>{customList('Possible', right)}</Grid>
      </Grid>
      <Grid container justifyContent="center" style={{ position: 'relative' }}>
        <Button 
          onClick={() => props.handleUpdateFeatures(left, right)} 
          color="primary" 
          variant="contained"
          disabled={props.loading}
        >Save feature changes</Button>
        {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Grid>
    </>
  );
}

TransferList.propTypes = {
  installed: PropTypes.array.isRequired,
  possible: PropTypes.array.isRequired,
  handleUpdateFeatures: PropTypes.func.isRequired,
  handleParseFeatures: PropTypes.func.isRequired,
  handleInstalled: PropTypes.func.isRequired,
  handlePossible: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
}

export default TransferList;