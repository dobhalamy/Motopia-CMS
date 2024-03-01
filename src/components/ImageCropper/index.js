import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop'
import getCroppedImg from './CropperUtils';

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles({
  containerDiv: {
    width: 450,
  },
  cropperDiv: {
    display: "block",
    position: "relative",
    width: "100%",
    height: 200,
    float: "left",
  },
})

const ImageCropper = (props) => {
  const classes = useStyles();
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropped, setCroppedImage] = useState(null)

  const showCroppedImage = useCallback(async (croppedAreaPixels) => {
    try {
      const croppedImage = await getCroppedImg(
        props.previewImg,
        croppedAreaPixels
      )
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [props, setCroppedImage])

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    showCroppedImage(croppedAreaPixels)
  }, [showCroppedImage])

  const croppedImage = () => {
    props.handleCrop(cropped);
    props.handleClose();
  }

  const { previewImg, isOpen, handleClose, aspectRatio } = props;
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Image Cropper</DialogTitle>
      <DialogContent className={classes.containerDiv}>
        <div  className={classes.cropperDiv}>
        <Cropper
          className="cropper"
          image={previewImg}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          showGrid={false}
          cropShape='rect'
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={croppedImage} color="primary">
          Crop
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageCropper
