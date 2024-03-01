import React from 'react';
import { SketchPicker } from 'react-color';
const { makeStyles, Grid, Typography } = require('@material-ui/core');

const useStyles = makeStyles({
  label: { paddingLeft: 16, textTransform: 'none' },
  colorBox: {
    height: 10,
    width: 10,
    padding: 10,
    border: '1px solid',
    display: 'inline-block',
    cursor: 'pointer',
  },
  example: {
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  },
});

const LabeledColorPicker = ({
  title,
  value,
  onChange = () => {},
  required = false,
  example,
  exampleImage,
  ...others
}) => {
  const classes = useStyles();
  return (
    <Grid item container style={{ marginTop: 20 }} wrap="nowrap" xs={12}>
      <Grid item xs={4}>
        <Typography className={classes.label} variant="h6">
          {title}
          {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      </Grid>
      <Grid
        item
        container
        xs={4}
        justifyContent="center"
        alignItems="center"
        className={classes.example}
        style={{ backgroundImage: exampleImage ? `url(${exampleImage})` : '' }}
      >
        <Typography style={{ color: value }} variant="h5">
          {example}
        </Typography>
      </Grid>
      <Grid xs={4} className={classes.imageWrapper}>
        <SketchPicker color={{ hex: value }} onChangeComplete={onChange} />
      </Grid>
    </Grid>
  );
};

export default LabeledColorPicker;
