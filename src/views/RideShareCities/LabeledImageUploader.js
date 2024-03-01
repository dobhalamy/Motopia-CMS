import React from 'react';
import { makeStyles, Grid, Typography, Button } from '@material-ui/core';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';

const useStyles = makeStyles({
  label: { paddingLeft: 16, textTransform: 'none' },
  imageWrapper: {
    maxWidth: '100%',
  },
});

const LabeledImageUploader = ({ title, value, onChange = () => {}, required = false, helperText, handleRemoveImage = () => {}, isShowRemoveButton = true, ...others }) => {
  const classes = useStyles();
  return (
    <Grid item container style={{ marginTop: 20 }} wrap="nowrap" xs={12}>
      <Grid item xs={4}>
        <Typography className={classes.label} variant="h6">
          {title}
          {required && <span style={{ color: 'red' }}>*</span>}
        </Typography>
        {value.src && isShowRemoveButton && (
          <Button style={{ marginLeft: 16 }} onClick={handleRemoveImage} variant="outlined" color="primary">
            Remove image
          </Button>
        )}
      </Grid>
      <Grid item xs={8}>
        <CloudinaryUploadWidget folder="ride-share-cities" cropping croppingAspectRatio={16 / 9.09} preview={{ width: '100%', height: 450, bg: value.src || 'transparent' }} onUpload={onChange} />
        {helperText}
      </Grid>
    </Grid>
  );
};

export default LabeledImageUploader;
