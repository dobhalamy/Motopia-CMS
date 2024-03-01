import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';

const useStyles = makeStyles({
  variantContainer: {
    margin: '10px 0px',
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
    height: 70,
    margin: 12,
    border: '1px dashed lightgray',
    cursor: 'pointer',
  },
  uploadImageButton: {
    minWidth: 150,
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  cardImageTop: {
    width: 250,
    height: 200,
    objectFit: 'cover',
  },
  cardImage: {
    width: 250,
    height: 200,
    objectFit: 'cover',
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
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
    width: 200,
    height: 150,
    objectFit: 'contain',
  },
  categoryImgTitle: {
    padding: 10,
  },
  imagePreviewDiv: {
    textAlign: 'center',
  },
});

export default function BodyTypeAddDialog(props) {
  const classes = useStyles();
  const [imageData, setImageData] = useState({
    image: { publicId: '', src: '' },
    mobileImage: { publicId: '', src: '' },
    logoImage: { publicId: '', src: '' },
    imageUrl: '',
    mobileImageUrl: '',
    newMobileImage: false,
    newImage: false,
  });
  const [state, setState] = React.useState({
    title: '',
    links: [],
    description: '',
    editDescription: true,
    mainLink: '',
    name: '',
    link: '',
    uploadingFileError: false,
  });

  React.useEffect(() => {
    setState({ ...state, ...props.cardData, mainLink: props.cardData.link });
    // eslint-disable-next-line
  }, []);

  const handleTextField = field => event => setState({ ...state, [field]: event.target.value });

  const handleCropImage = async image => {
    setImageData({ ...imageData, imageUrl: image.src, image });
  };

  const handleCropMobileImage = mobileImage => {
    setImageData({ ...imageData, mobileImageUrl: mobileImage.src, mobileImage });
  };

  const handleUpdate = async () => {
    const { title, mainLink, description } = state;

    const image = imageData.image.publicId ? imageData.image : cardData.image;
    const logoImage = imageData.image.publicId ? imageData.image : cardData.logoImage;
    const mobileImage = imageData.mobileImage.publicId ? imageData.mobileImage : cardData.mobileImage;

    if (props.handleUpdateCategory) {
      props.handleUpdateCategory({
        _id: props.cardData._id,
        title,
        image,
        mobileImage,
        description,
      });
    }

    if (props.handleUpdateSubCategory) {
      props.handleUpdateSubCategory({
        _id: props.cardData._id,
        title,
        logoImage,
        description,
        link: mainLink,
      });
    }
  };

  const handleSubmit = async () => {
    const { title, mainLink, description } = state;

    const image = imageData.image.publicId ? imageData.image : cardData.image;
    const logoImage = imageData.image.publicId ? imageData.image : cardData.logoImage;
    const mobileImage = imageData.mobileImage.publicId ? imageData.mobileImage : cardData.mobileImage;

    if (subCategoryMode) {
      props.submit({
        title,
        logoImage,
        mainLink,
        description,
      });
    } else {
      props.submit({
        title,
        image,
        mobileImage,
        mainLink,
        description,
      });
    }
  };

  const { isOpen, cardData, headerTitle, submit, noViewLink, subCategoryMode, errors } = props;

  const desktopIcon = subCategoryMode && cardData.logoImage ? cardData.logoImage.src : cardData.image && cardData.image.src;
  const mobileIcon = cardData.mobileImage && cardData.mobileImage.src;

  return (
    <Dialog open={isOpen} aria-labelledby="form-dialog-title" onClose={props.handleCloseModal}>
      <DialogTitle id="form-dialog-title">{headerTitle}</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <Grid container alignItems="center">
            <TextField label="Title" variant="outlined" fullWidth value={state.title} onChange={handleTextField('title')} />
          </Grid>
          <Grid container alignItems="center" justify="center" direction="column">
            <Typography className={classes.categoryImgTitle}>{subCategoryMode ? 'icon' : 'Desktop icon'}</Typography>
            <CloudinaryUploadWidget
              folder="home-categories"
              cropping
              croppingAspectRatio={subCategoryMode ? 16 / 9.09 : 21 / 6.9}
              preview={{ width: '100%', height: 150, bg: desktopIcon }}
              onUpload={handleCropImage}
            />

            {!subCategoryMode ? (
              <>
                <Typography className={classes.categoryImgTitle}>Mobile icon</Typography>
                <CloudinaryUploadWidget folder="home-categories" cropping croppingAspectRatio={16 / 16} preview={{ width: '100%', height: 150, bg: mobileIcon }} onUpload={handleCropMobileImage} />
              </>
            ) : null}
          </Grid>
          <Grid className={classes.variantContainer} container direction="column">
            <Typography gutterBottom variant="button" align="center">
              Add description
            </Typography>
            <Grid container justify="space-between" wrap="nowrap" alignItems="center">
              <Grid item xs={12}>
                <TextField fullWidth label="Description" variant="outlined" value={state.description} onChange={handleTextField('description')} />
              </Grid>
            </Grid>
          </Grid>
          {!noViewLink ? (
            <Grid className={classes.viewAllContainer} container justify="space-between" wrap="nowrap" alignItems="center">
              <Grid item xs={3}>
                <Typography style={{ paddingLeft: 16 }} variant="body1">
                  Link
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth label="Link" variant="outlined" value={state.mainLink} onChange={handleTextField('mainLink')} />
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          {errors ? (
            <Typography variant="body1" color="error" style={{ textTransform: 'capitalize' }}>
              {errors}
            </Typography>
          ) : null}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleCloseModal} color="primary">
          Close
        </Button>
        {submit ? (
          <Button onClick={handleSubmit} color="primary">
            submit
          </Button>
        ) : (
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

BodyTypeAddDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  cardData: PropTypes.object.isRequired,
};
