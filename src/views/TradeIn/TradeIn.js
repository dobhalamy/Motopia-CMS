/* eslint-disable react/display-name */
import React from 'react';
import { useToasts } from 'react-toast-notifications';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import { RideShareRoutes } from 'client';
import Grid from '@material-ui/core/Grid';
import { ViewSeo } from 'components/SeoSection/ViewSeo';

const TradeIn = () => {
  const [tradeInSeo, setTradeInSeo] = React.useState();

  const { addToast } = useToasts();

  const loadSeo = React.useCallback(async () => {
    try {
      const response = await RideShareRoutes.getHomeRideShare();
      const filteredData = response.data.find(item => item.cityName.toLowerCase() === 'trade in');
      setTradeInSeo(filteredData);
    } catch (err) {
      const message = err.message || err;
      addToast(message, { severity: 'info' });
    }
  }, [addToast]);

  React.useEffect(() => {
    loadSeo();
  }, [loadSeo]);

  const handleUpdateItem = async (_id, newData) => {
    try {
      const response = await RideShareRoutes.updateRideShare(_id, newData);
      if (response.status === 'success') {
        addToast(response.status);
        loadSeo();
      } else {
        addToast(response.status, { severity: 'error' });
      }
    } catch (err) {
      addToast(err.message, { severity: 'error' });
    }
    loadSeo();
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {tradeInSeo && (
          <Grid container style={{ backgroundColor: 'white', paddingBottom: 4, paddingTop: '1em' }}>
            <ViewSeo data={tradeInSeo} handleUpdateItem={handleUpdateItem} />
          </Grid>
        )}
      </GridItem>
    </GridContainer>
  );
};

export default TradeIn;
