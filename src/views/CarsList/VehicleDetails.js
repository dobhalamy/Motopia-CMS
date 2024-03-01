import { Container, Grid } from '@material-ui/core';
import React from 'react';

const VehicleDetails = rowData => {
  const { rideShareCategory, lifeStyleCategory, features, vehiclePinCount } = rowData;
  const data = [
    { label: 'Ride-share category', value: rideShareCategory || 'N/A' },
    { label: 'Lifestyle category', value: lifeStyleCategory || 'N/A' },
    { label: 'Possible Features Count', value: features.possibleFeatures.length },
    { label: 'Installed Features Count', value: features.installedPossibleFeatures.length },
    { label: 'Installed Features Pins Count', value: vehiclePinCount.instFeatureCount },
    { label: 'Feature Pins Count', value: vehiclePinCount.featureCount },
    { label: 'Damage Pins Count', value: vehiclePinCount.damageCount },
  ];
  return (
    <Container>
      <Grid container>
        {data.map(({ label, value }) => (
          <>
            <Grid key={label} item xs={6}>
              {label}
            </Grid>
            <Grid item xs={6}>
              {value}
            </Grid>
          </>
        ))}
      </Grid>
    </Container>
  );
};

export default VehicleDetails;
