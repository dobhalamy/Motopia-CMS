import React, { useEffect, useRef, useState } from 'react';
import useScript from 'react-script-hook';
import { Button } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
const cloudName = 'luxor-motor-cars-inc';
// const apiKey = '441691834545671';
const presets = new Map([['default', 'default_webp'], ['blog', 'blog-image-with-blue-rounded-border']]);

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    transition: 'all .4s',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0, 0.3)',
    },
  },
  button: {
    position: 'absolute',
    zIndex: 2,
    height: '100%',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
  },
  blogButton: {
    backgroundColor: '#ffae00',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#e39b00',
    },
  },
}));

const CloudinaryUploadWidget = ({ preset = 'default', folder, cropping = false, croppingAspectRatio = null, onUpload, preview, isMobile = false }) => {
  const widget = useRef(null);
  const classes = useStyles();
  const [previewConfig, setPreview] = useState();
  const [isBlog, setBlog] = useState(false);

  const [loadingWidget] = useScript({
    src: 'https://upload-widget.cloudinary.com/global/all.js',
    checkForExisting: true,
  });

  useEffect(() => {
    setBlog(preset === 'blog');
  }, [preset]);

  useEffect(() => {
    if (!preview) return;
    if (!previewConfig && preview) {
      setPreview(preview);
    }
    // eslint-disable-next-line
  }, [preview]);

  useEffect(() => {
    if (loadingWidget || widget.current) return;
    const config = {
      cloudName,
      uploadPreset: presets.get(preset),
      autoMinimize: true,
      showUploadMoreButton: true,
      singleUploadAutoClose: false,
      cropping,
      croppingAspectRatio,
      showSkipCropButton: false,
      croppingShowDimensions: true,
      showPoweredBy: false,
    };
    if (preset === 'default') {
      config.folder = folder;
    }
    if (cropping) {
      config.croppingCoordinatesMode = 'face';
    }
    widget.current = window.cloudinary.createUploadWidget(config, (error, result) => {
      if (!error && result.event === 'success') {
        const response = { publicId: result.info.public_id };
        isMobile ? (response.mobileSrc = result.info.secure_url) : (response.src = result.info.secure_url);
        if (!isBlog) {
          if (response.mobileSrc) {
            setPreview(pre => ({ ...pre, bg: response.mobileSrc }));
          } else {
            setPreview(pre => ({ ...pre, bg: response.src }));
          }
        }
        onUpload(response);
      }
    });
    // eslint-disable-next-line
  }, [loadingWidget, widget]);

  const showWidget = () => {
    widget.current.open();
  };

  return isBlog && !previewConfig ? (
    <Button variant="contained" fullWidth className={classes.blogButton} onClickCapture={showWidget} endIcon={<CloudUpload fontSize="medium" />} startIcon={<CloudUpload fontSize="medium" />}>
      Upload image with preset
    </Button>
  ) : (
    <div
      className={classes.wrapper}
      style={{
        width: previewConfig ? previewConfig.width : 'auto',
        height: previewConfig ? previewConfig.height : 'auto',
        backgroundImage: previewConfig ? `url(${previewConfig.bg})` : 'transparent',
      }}
    >
      <Button fullWidth className={classes.button} onClickCapture={showWidget}>
        <CloudUpload fontSize="large" htmlColor="#ffae00" />
      </Button>
    </div>
  );
};

export default CloudinaryUploadWidget;
