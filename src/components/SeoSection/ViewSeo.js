import React from 'react';
import LabeledTextField from 'views/RideShareCities/LabeledTextField';
import { FormHelperText, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const ViewSeo = ({ data, handleUpdateItem }) => {
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
    }
  );
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
  const onUpdateClick = () => {
    handleUpdateItem(data._id, state);
  };
  return (
    <>
      <Grid container alignItems="center">
        <Typography align="center" variant="h6" style={{ marginLeft: 16, paddingTop: 8 }}>
          SEO SECTION
          <Button style={{ marginLeft: 16 }} onClick={onUpdateClick} variant="outlined" color="primary">
            Save
          </Button>
        </Typography>
      </Grid>
      <LabeledTextField title="Title (max 60 characters)" value={state?.metaTitle} onChange={handleTextField('metaTitle')} maxLength={60} />
      <LabeledTextField
        title="Meta Keywords (max 255 characters)"
        value={state?.metaKeywords}
        onChange={handleTextField('metaKeywords')}
        helperText={
          <FormHelperText>
            <strong>Separated by comma</strong>
          </FormHelperText>
        }
        maxLength={255}
      />
      <LabeledTextField title="Meta description (max 170 characters)" value={state?.metaDescription} onChange={handleTextField('metaDescription')} maxLength={170} />
      <LabeledTextField title="H1 (max 80 characters)" value={state?.seoTags?.h1} onChange={handleTextField('h1')} maxLength={80} />
      <LabeledTextField title="H2 (max 80 characters)" value={state?.seoTags?.h2} onChange={handleTextField('h2')} maxLength={80} />
      <LabeledTextField title="H3 (max 80 characters)" value={state?.seoTags?.h3} onChange={handleTextField('h3')} maxLength={80} />
    </>
  );
};
