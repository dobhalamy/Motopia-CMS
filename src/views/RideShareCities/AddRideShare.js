import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FormHelperText } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';

import { FRONTEND_RIDESHARE_URL } from 'components/VehiclePage/constants';
import Select from './Select';
import LabeledTextField from './LabeledTextField';
import LabeledImageUploader from './LabeledImageUploader';
import LabeledColorPicker from './LabeledColorPicker';
import { RideShareRoutes } from 'client';
import { SeoSection } from 'components/SeoSection/SeoSection';

export default function AddRideShare(props) {
  const { handleAddItem, handleUpdateItem, goBack, updateMode, data, availableStates, plates, zones } = props;
  const { addToast } = useToasts();
  const [url, setUrl] = useState(FRONTEND_RIDESHARE_URL);
  const [state, setState] = React.useState(
    data || {
      cityName: '',
      workState: '',
      plateType: '',
      zone: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      seoTags: {
        h1: '',
        h2: '',
        h3: '',
      },
      citySpecificText: '',
      textColor: '#000000',
      img: {
        publicId: '',
        src: '',
      },
    }
  );

  useEffect(() => {
    if (state && state.workState) {
      const workState = state.workState.toLocaleLowerCase();
      const cityName = state.cityName.replaceAll(' ', '-').toLocaleLowerCase();
      const plateType = state.plateType ? state.plateType.replace(' ', '-').toLocaleLowerCase() : '';
      const newUrl = `${FRONTEND_RIDESHARE_URL}${workState}/${cityName}/${plateType}`;
      const encoded = encodeURI(newUrl);
      setUrl(encoded);
    }
  }, [state]);

  const onUpdateClick = () => {
    if (!state.cityName || !state.workState || !state.plateType || !state.zone.length) {
      addToast('Please fill required fields', { severity: 'info' });
      return;
    }
    if (!updateMode) {
      handleAddItem({ ...state, url });
    } else {
      handleUpdateItem(data._id, { ...state, url });
    }
  };

  const removeImage = async () => {
    try {
      await RideShareRoutes.deleteRideShareImage(data._id);
      addToast('Image is removed');
      setState({ ...state, img: { src: null } });
      props.reloadRideShares();
    } catch (error) {
      addToast(error.message, { severity: 'error' });
    }
  };

  const handleTextField = field => event => {
    if (field === 'h1' || field === 'h2' || field === 'h3') {
      setState({
        ...state,
        seoTags: {
          ...state.seoTags,
          [field]: event.target.value,
        },
      });
    } else {
      setState({ ...state, [field]: event.target.value });
    }
  };

  const handleImage = img => setState({ ...state, img });
  const handleColor = ({ hex }) => setState({ ...state, textColor: hex });

  return (
    <Grid container direction="column">
      <Grid container alignItems="center">
        <Typography align="center" variant="h5" style={{ marginLeft: 16 }}>
          {!updateMode ? 'Add' : 'Update'} Ride share
        </Typography>
        <Button style={{ marginLeft: 16 }} onClick={goBack} variant="outlined" color="primary">
          Back to List
        </Button>
        <Button style={{ marginLeft: 16 }} onClick={onUpdateClick} variant="outlined" color="primary">
          {!updateMode ? 'Add' : 'Update'} Item
        </Button>
      </Grid>
      <Grid container>
        <LabeledTextField required title="Rideshare City Name" value={state.cityName} onChange={handleTextField('cityName')} />

        <Select fullWidth title="Rideshare Plan to work state" required variant="outlined" options={availableStates} value={state.workState} onChange={v => handleTextField('workState')(v)} />

        <Select fullWidth title="Rideshare License Plate type" required variant="outlined" options={plates} value={state.plateType} onChange={v => handleTextField('plateType')(v)} />

        <Select
          fullWidth
          title="Show active vehicles with zone"
          required
          isMulti
          max={7}
          label="Zone"
          variant="outlined"
          options={zones}
          value={state.zone}
          onChange={v => handleTextField('zone')(v)}
        />

        <LabeledTextField title="URL" value={url} disabled />
        <LabeledTextField
          title="City specific text"
          value={state.citySpecificText}
          onChange={handleTextField('citySpecificText')}
          helperText={
            <FormHelperText>
              <strong>It will appear on the image</strong>
            </FormHelperText>
          }
        />
        <LabeledColorPicker title="Text color" value={state.textColor} example={state.citySpecificText} exampleImage={state.img.src ?? null} onChange={handleColor} />
        <LabeledImageUploader title="City image" value={state.img} onChange={handleImage} handleRemoveImage={removeImage} />
        <Grid container style={{ border: '2px solid black', margin: 4, borderRadius: '1rem', paddingBottom: 4 }}>
          <Grid container alignItems="center">
            <Typography align="center" variant="h6" style={{ marginLeft: 16, paddingTop: 8 }}>
              SEO SECTION
            </Typography>
          </Grid>
          <SeoSection
            metaTitle={state?.metaTitle}
            metaKeywords={state?.metaKeywords}
            metaDescription={state?.metaDescription}
            h1={state?.seoTags?.h1}
            h2={state?.seoTags?.h2}
            h3={state?.seoTags?.h3}
            handleTextField={handleTextField}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
