import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import TransferList from 'components/BodyType/TransferList';

const useStyles = makeStyles({
  variantContainer: {
    margin: '16px 0px',
    padding: '8px 0px',
    borderTop: '1px solid #001C5E',
  },
  viewAllContainer: {
    padding: '8px 0px',
  },
  addedVariantContainer: {
    margin: '8px 0px',
  },
  addedVariantField: {
    paddingLeft: 16,
    overflowWrap: 'break-word',
  },
  DragAndDropContainer: {
    width: 300,
    height: 150,
    margin: 12,
    border: '1px dashed lightgray',
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  },
  imgPreview: {
    display: 'block',
    width: 100,
    height: 100,
    objectFit: 'contain',
  },
});

const not = (a, b) => {
  return a.filter(value => b.indexOf(value) === -1);
};

const intersection = (a, b) => {
  return a.filter(value => b.indexOf(value) !== -1);
};

export default function BodyTypeCardEditDialog(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    carBody: '',
    dmsBodyValues: [],
    availableValues: [],
    checked: [],
  });
  const { dmsBodyValues, availableValues, checked } = state;
  const leftChecked = intersection(checked, dmsBodyValues);
  const rightChecked = intersection(checked, availableValues);

  useEffect(() => {
    setState({ ...state, ...props.cardData, availableValues: props.availableValues });
    // eslint-disable-next-line
  }, []);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setState({ ...state, checked: newChecked });
  };

  const handleCheckedRight = () => {
    setState({
      ...state,
      availableValues: availableValues.concat(leftChecked),
      dmsBodyValues: not(dmsBodyValues, leftChecked),
      checked: not(checked, leftChecked),
    });
  };

  const handleCheckedLeft = () => {
    setState({
      ...state,
      dmsBodyValues: dmsBodyValues.concat(rightChecked),
      availableValues: not(availableValues, rightChecked),
      checked: not(checked, rightChecked),
    });
  };

  const handleTextField = field => event => setState({ ...state, [field]: event.target.value });

  const handleClose = async () => {
    const { carBody, dmsBodyValues, availableValues } = state;

    props.handleCloseEditDialog(
      {
        carBody,
        dmsBodyValues,
        id: props.cardData.id,
      },
      availableValues
    );
  };

  const { isOpen } = props;
  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-carBody" onClose={handleClose} maxWidth="lg">
      <DialogTitle id="form-dialog-carBody">Edit Card</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <Grid container alignItems="center">
            <TextField label="Displayed name" variant="outlined" fullWidth value={state.carBody} onChange={handleTextField('carBody')} />
          </Grid>
          <Grid className={classes.variantContainer} container direction="column" justify="space-between">
            <TransferList
              assigned={state.dmsBodyValues}
              available={state.availableValues}
              handleCheckedLeft={handleCheckedLeft}
              handleCheckedRight={handleCheckedRight}
              leftChecked={leftChecked}
              rightChecked={rightChecked}
              checked={checked}
              handleToggle={handleToggle}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BodyTypeCardEditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  cardData: PropTypes.object.isRequired,
  handleCloseEditDialog: PropTypes.func.isRequired,
};
