/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications';

import MaterialTable from 'material-table';

import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';

import { RideShareRoutes } from 'client';
import Grid from '@material-ui/core/Grid';
import { ViewSeo } from 'components/SeoSection/ViewSeo';
import { FinanceRoutes } from 'client';
import TextField from '@material-ui/core/TextField';

export default function FinanceInfoPins() {
  const { addToast } = useToasts();
  const [financeSeo, setFinaceSeo] = React.useState();

  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Position',
        field: 'number',
        editComponent: props => <div> {props.rowData.number} </div>,
      },
      {
        title: 'Page',
        field: 'page',
        editComponent: props => <div> {props.rowData.page} </div>,
      },
      {
        title: 'Description',
        field: 'description',
        editComponent: props => (
          <TextField
            fullWidth
            value={props.rowData.description}
            onChange={event => {
              props.onChange(event.target.value, props.rowData);
            }}
          />
        ),
      },
    ],
    data: [],
  });

  const loadPins = async () => {
    let data;
    try {
      data = await FinanceRoutes.getPins();
    } catch (err) {
      alert(err);
    }
    setState({ ...state, data: [...data.data] });
  };

  React.useEffect(() => {
    loadPins();
    // eslint-disable-next-line
  }, []);
  const loadSeo = React.useCallback(async () => {
    try {
      const response = await RideShareRoutes.getHomeRideShare();
      const filteredData = response.data.find(item => item.cityName.toLowerCase() === 'finance');
      setFinaceSeo(filteredData);
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

  const handleChangeFinancePin = async newData => {
    try {
      await FinanceRoutes.updatePin(newData);
    } catch (err) {
      alert(err);
    }
    loadPins();
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <MaterialTable
            title="Finance Info Pins"
            columns={state.columns}
            data={state.data}
            editable={{
              onRowUpdate: newData => handleChangeFinancePin(newData),
            }}
          />
        </GridItem>
      </GridContainer>
      {financeSeo && (
        <Grid container direction="column">
          <Grid container alignItems="center">
            <Grid container style={{ backgroundColor: 'white', paddingBottom: 4, paddingTop: '1em', borderRadius: '0.5em' }}>
              <ViewSeo data={financeSeo} handleUpdateItem={handleUpdateItem} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

FinanceInfoPins.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  rowData: PropTypes.object,
};
