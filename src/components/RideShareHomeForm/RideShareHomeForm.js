import React, { memo, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useToasts } from 'react-toast-notifications';
import LabeledImageUploader from 'views/RideShareCities/LabeledImageUploader';
import LabeledTextField from 'views/RideShareCities/LabeledTextField';
import { useCallback } from 'react';
import { RdsImageRoutes } from 'client';
import { title } from 'assets/jss/material-dashboard-react';
import PropTypes from 'prop-types';

function RideShareHomeForm(props) {
  const { setShowCreateForm, loadRdsData } = props;
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({
    title: '',
    visible: true,
  });
  const [imageData, setImageData] = useState({
    img: {
      publicId: '',
      src: '',
    },
  });

  const handleTextField = event => setFormData({ ...formData, title: event.target.value });
  const handleImage = useCallback(img => {
    const publicId = img.publicId;
    const src = img.src;
    setImageData(pre => ({ ...pre, img: { publicId, src } }));
  }, []);
  const handleSaveChange = useCallback(async () => {
    const data = {
      ...formData,
      ...imageData,
      mobileImg: {
        publicId: imageData.img.publicId,
        mobileSrc: imageData.img.src,
      },
    };
    try {
      const response = await RdsImageRoutes.postRdsHomeData(data);
      if (response && response.status === 'success') {
        addToast('Data added successfully');
        setShowCreateForm(false);
        loadRdsData();
      } else if (response && response.status === 'duplicate') {
        addToast(`Data already exists with title - ${formData.title}`, { severity: 'warning' });
      }
    } catch (error) {
      addToast(error.message, { severity: 'error' });
    }
  }, [imageData, formData, addToast, loadRdsData, setShowCreateForm]);

  return (
    <Grid container direction="column">
      <Grid container alignItems="center">
        <Typography align="center" variant="h5" style={{ marginLeft: 16 }}>
          Add Ride share
        </Typography>
        <Button
          style={{ marginLeft: 16 }}
          onClick={() => {
            setShowCreateForm(false);
          }}
          variant="outlined"
          color="primary"
        >
          Back to List
        </Button>
        {title !== '' && imageData.img.src !== '' && (
          <Button style={{ marginLeft: 16 }} onClick={handleSaveChange} variant="outlined" color="primary">
            Save Changes
          </Button>
        )}
      </Grid>
      <Grid container>
        <LabeledTextField title="Title" value={formData.metaTitle} onChange={handleTextField} />
        <LabeledImageUploader title="Ride share steps image" value={imageData.img} isShowRemoveButton={false} onChange={handleImage} />
      </Grid>
    </Grid>
  );
}
RideShareHomeForm.prototype = {
  setShowCreateForm: PropTypes.func,
  loadRdsData: PropTypes.func,
};
export default memo(RideShareHomeForm);
