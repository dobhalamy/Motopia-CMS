/* eslint-disable react/display-name */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { useToasts } from 'react-toast-notifications';
import Checkbox from '@material-ui/core/Checkbox';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import { RideShareRoutes } from 'client';
import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AddRideShare from './AddRideShare';
import flattenDeep from 'lodash.flattendeep';
import { getAllRds } from 'client/vehicle';
import { getAllStates } from 'client/rideShare';
import { SELECT_OPTIONS_ZONES } from 'components/VehiclePage/constants';

const useStyles = makeStyles({
  addFloatingButton: {
    position: 'fixed',
    right: 24,
    bottom: 24,
  },
});

const RideShare = () => {
  const { addToast } = useToasts();
  const classes = useStyles();
  const tableColumns = [
    {
      title: 'Show Pickup Location',
      field: 'active',
      render: rowData => (
        <Checkbox
          color="default"
          checked={rowData.active}
          onChange={event => {
            handleChange(event.target.checked, rowData);
          }}
        />
      ),
    },
    {
      title: 'City Name',
      field: 'cityName',
    },
    {
      title: 'Work State',
      field: 'workState',
      render: (rowData, d) => {
        if (availableStates.length) {
          const found = availableStates.find(v => v.value === rowData.workState);
          return found ? found.text : rowData.workState;
        }
        return rowData.workState;
      },
    },
    {
      title: 'Plate Type',
      field: 'plateType',
    },
  ];

  const [state, setState] = React.useState({
    data: [],
  });
  const [isAddItem, setIsAddItem] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [rideShareData, setRideShareData] = useState(null);
  const [plates, setPlates] = React.useState([]);
  const [availableStates, setStates] = React.useState([]);
  const [availableZones, setZones] = React.useState([]);

  const getStateList = useCallback(async () => {
    const list = await getAllStates();
    setStates(list);
  }, []);

  useEffect(() => {
    getStateList();
    getAllRds().then(data => {
      const rds = data.rsdVehicleList;
      filterPlates(rds);
      setZones(SELECT_OPTIONS_ZONES);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterPlates = array => {
    const allTypes = [...new Set(flattenDeep([...array].map(el => el.rsdInventoryType)))];
    const newTypes = allTypes.map(el => ({
      text: el,
      value: el,
    }));
    setPlates(newTypes);
  };
  const handleChange = async (value, data) => {
    const newData = { ...data, active: value };
    try {
      const response = await RideShareRoutes.updateRideShare(newData._id, newData);
      if (response.status === 'success') {
        addToast(response.status);
        loadRideShares();
        goBack();
      } else {
        addToast(response.status, { severity: 'error' });
      }
    } catch (err) {
      addToast(err.message, { severity: 'error' });
    }
    loadRideShares();
  };

  const loadRideShares = async () => {
    try {
      const response = await RideShareRoutes.getRideShares();

      const data = response.data;
      setState({
        ...state,
        data: data,
      });
    } catch (err) {
      const message = err.message || err;
      addToast(message, { severity: 'info' });
    }
  };

  React.useEffect(() => {
    loadRideShares();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async data => {
    const response = await RideShareRoutes.deleteRideShare(data._id);
    if (response.status === 'success') {
      addToast('deleted');
      loadRideShares();
    } else {
      addToast(response.status, { severity: 'error' });
    }
  };

  const handleAddItem = async newData => {
    const response = await RideShareRoutes.addRideShare(newData);
    if (response.status === 'success') {
      addToast(response.status);
      loadRideShares();
      goBack();
    } else {
      addToast(response.status, { severity: 'error' });
    }
  };

  const handleUpdateItem = async (_id, newData) => {
    try {
      const response = await RideShareRoutes.updateRideShare(_id, newData);
      if (response.status === 'success') {
        addToast(response.status);
        loadRideShares();
        goBack();
      } else {
        addToast(response.status, { severity: 'error' });
      }
    } catch (err) {
      addToast(err.message, { severity: 'error' });
    }
    loadRideShares();
  };

  const goBack = () => {
    setIsAddItem(false);
    setRideShareData(null);
    setShowAddModal(false);
  };

  if (showAddModal) {
    return (
      <AddRideShare
        zones={availableZones}
        plates={plates}
        availableStates={availableStates}
        goBack={goBack}
        data={rideShareData}
        updateMode={!isAddItem}
        handleAddItem={handleAddItem}
        handleUpdateItem={handleUpdateItem}
        reloadRideShares={loadRideShares}
      />
    );
  }

  return (
    <GridContainer>
      <Fab
        size="large"
        className={classes.addFloatingButton}
        color="primary"
        aria-label="add"
        onClick={() => {
          setIsAddItem(true);
          setShowAddModal(true);
        }}
      >
        <AddIcon />
      </Fab>
      <GridItem xs={12} sm={12} md={12}>
        <MaterialTable
          title="Ride Share cities"
          columns={tableColumns}
          data={state.data}
          actions={[
            {
              icon: 'edit',
              onClick: (e, rowData) => {
                setRideShareData(rowData);
                setIsAddItem(false);
                setShowAddModal(true);
              },
            },
            {
              icon: 'delete',
              onClick: (e, rowData) => {
                handleDelete(rowData);
                // open dialog to save new one
              },
            },
          ]}
        />
      </GridItem>
    </GridContainer>
  );
};

RideShare.propTypes = {
  value: PropTypes.string,
};

RideShare.defaultProps = {
  value: '',
};

export default RideShare;
