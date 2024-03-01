import React, { useEffect } from 'react';
import useScript from 'react-script-hook';
import { Button } from '@material-ui/core';
const cloudName = 'luxor-motor-cars-inc';
const apiKey = '441691834545671';

export const MediaLibraryDialog = ({ galleryRef, handleOpenGallery }) => {
  const [loadingLibrary] = useScript({
    src: 'https://media-library.cloudinary.com/global/all.js',
    checkForExisting: true,
  });

  useEffect(() => {
    if (loadingLibrary || galleryRef.current) return;

    galleryRef.current = window.cloudinary.createMediaLibrary({
      cloud_name: cloudName,
      api_key: apiKey,
      uploadPreset: 'blog-image-with-blue-rounded-border',
      folder: {
        path: 'blog',
      },
      multiple: false,
    });
  }, [loadingLibrary, galleryRef]);

  return (
    <>
      <Button fullWidth color="primary" variant="contained" onClickCapture={handleOpenGallery}>
        Open Cloudinary
      </Button>
    </>
  );
};
