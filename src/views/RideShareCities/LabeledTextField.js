import React from 'react';
const { makeStyles, Grid, Typography, TextField } = require('@material-ui/core');

const useStyles = makeStyles({
  label: { paddingLeft: 16, textTransform: 'none' },
});

const LabeledTextField = ({ title, value, onChange = () => {}, required = false, helperText, maxLength, ...others }) => {
  const rows = maxLength && maxLength > 100 ? 2 : 1;

  const classes = useStyles();
  return (
    <Grid item container style={{ marginTop: 20 }} wrap="nowrap" xs={12} md={8}>
      <Grid item xs={6} md={6}>
        <Typography className={classes.label} variant="h6">
          {title}
          {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
      </Grid>
      <Grid item xs={6} md={6}>
        <TextField fullWidth label={title} variant="outlined" value={value} onChange={onChange} inputProps={maxLength !== undefined ? { maxLength } : undefined} multiline rows={rows} {...others} />
        {helperText}
      </Grid>
    </Grid>
  );
};

export default LabeledTextField;
