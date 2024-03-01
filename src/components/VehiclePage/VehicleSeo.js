import React from 'react';
import LabeledTextField from 'views/RideShareCities/LabeledTextField';
import { useToasts } from 'react-toast-notifications';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { VehicleRoutes } from 'client';
import { useHistory } from 'react-router-dom';

export const VehicleSeo = ({ data }) => {
  const { addToast } = useToasts();
  const history = useHistory();

  const [state, setState] = React.useState(
    data || {
      seoTags: {
        h1: '',
        h2: '',
        h3: '',
      },
    }
  );
  const handleTextField = field => event => {
    setState({
      ...state,
      seoTags: {
        ...state.seoTags,
        [field]: event.target.value,
      },
    });
  };
  const onUpdateClick = async () => {
    try {
      const response = await VehicleRoutes.updateVehicleById(data._id, { ...data, ...state });
      if (response.status === 'success') {
        addToast(response.status);
      } else {
        addToast(response.status, { severity: 'error' });
      }
    } catch (err) {
      addToast(err.message, { severity: 'error' });
    }
    history.push('/admin/cars-list');
  };
  return (
    <>
      <Typography align="center" variant="h6" style={{ marginLeft: 16, paddingTop: 8 }}>
        SEO SECTION
        <Button style={{ marginLeft: 16 }} color="primary" onClick={onUpdateClick} variant="contained">
          Save
        </Button>
      </Typography>
      <LabeledTextField title="H1" value={state?.seoTags?.h1} onChange={handleTextField('h1')} maxLength={80} />
      <LabeledTextField title="H2" value={state?.seoTags?.h2} onChange={handleTextField('h2')} maxLength={80} />
      <LabeledTextField title="H3" value={state?.seoTags?.h3} onChange={handleTextField('h3')} maxLength={80} />
    </>
  );
};
