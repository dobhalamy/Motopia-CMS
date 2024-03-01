import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  makeStyles } from '@material-ui/core';

import ModalRow from './ModalRow';

const useStyles = makeStyles({
  box: {
    color: '#000',
    padding: 5,
    fontWeight: 600,
    border: '1px solid rgba(0, 0, 0, 0.12)',
  },
  contentBox: {
    padding: 0,
  },
  leftColumn: {
    borderRight: '1px solid rgba(0, 0, 0, 0.12)'
  }
});

const FeatureModal = (props) => {
  const { show, features, handleCloseDialog, handleCheckBox, checked } = props;
  const classes = useStyles();

  return (
    <>
      <Dialog
        open={show}
        onClose={handleCloseDialog}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">Choose NADA equipment for the possible features</DialogTitle>
        <DialogContent
          id="scroll-dialog-description"
          dividers
          tabIndex={-1}
          classes={{root: classes.contentBox}}
        >
          <Box className={classes.box}>
            <Grid container item justify="space-between" alignItems="center">
              <Grid item xs={6} className={classes.leftColumn}>
                <Typography align="center" variant="subtitle1">
                  Feature Name
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="center" variant="subtitle1">
                  NADA Equipemts
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {features.map(feature =>
            <ModalRow
              key={feature.possibleFeatureId}
              feature={feature}
              handleCheckBox={handleCheckBox}
              checked={checked.find(el => el.possibleFeatureId === feature.possibleFeatureId)} />)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

FeatureModal.propTypes = {
    show: PropTypes.bool.isRequired,
    features: PropTypes.array.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    checked: PropTypes.array.isRequired,
};

export default FeatureModal;
