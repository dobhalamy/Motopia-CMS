import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import queryString from 'query-string';
import { listOfVehiclesSelector } from 'redux/selectors';

import ArrowBackIcon from '@material-ui/icons/ArrowLeft';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, Typography } from '@material-ui/core';

import Snackbar from '@material-ui/core/Snackbar';

import DamageMap from 'components/VehiclePage/DamageMap';
import TransferList from 'components/VehiclePage/TransferList';
import { VehicleRoutes } from 'client';
import FeatureModal from 'components/VehiclePage/FeatureModal';
import { VehicleSeo } from 'components/VehiclePage/VehicleSeo';

const styles = theme => ({
  vehicleHeroImage: {
    width: 400,
    height: 400,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  vehicleImageContainer: {
    width: 200,
    height: 200,
    margin: theme.spacing(1),
    cursor: 'pointer',
  },
  vehicleImage: {
    width: 200,
    height: 150,
  },
  RimSizeTypo: {
    float: 'right',
    marginRight: '10%',
    fontSize: 19,
    padding: 6,
  },
  FeatureHead: {
    display: 'inline-block',
    marginLeft: '41%',
  },
  backToResultButton: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightLight,
    padding: 0,
    [theme.breakpoints.down('md')]: {
      margin: `0px 0px ${theme.spacing(1.5)}px -${theme.spacing(1)}px`,
    },
  },
  outerBox: {
    marginRight: '90%',
  },
});

class Vehicle extends Component {
  state = {
    vehicle: {},
    vehicleSeo: {},
    features: [],
    possibleFeatures: [],
    installedFeatures: [],
    loading: true,
    getVehicleDataError: null,
    showDamageMap: false,
    damageMapPicture: null,
    shouldUpdateVehicleData: false,
    uploadingStatus: null,
    showFeatureDialog: false,
    nadaFeatures: [],
    featuresToSave: [],
    checked: [],
    loadFeatures: false,
    rimSize: 0,
  };

  componentDidMount() {
    const parsedQuery = queryString.parse(this.props.location.search);
    if (parsedQuery.id) {
      this.getVehicleData(parsedQuery.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const parsedQuery = queryString.parse(this.props.location.search);
    const prevParsedQuery = queryString.parse(prevProps.location.search);

    if (prevParsedQuery.id !== parsedQuery.id) {
      this.getVehicleData(parsedQuery.id);
    }
    if (this.state.shouldUpdateVehicleData && prevState.shouldUpdateVehicleData !== this.state.shouldUpdateVehicleData) {
      this.getVehicleData(parsedQuery.id);
    }
  }

  getVehicleData = async id => {
    try {
      const response = await VehicleRoutes.getVehicleById(id);
      const vehicleSeoResponse = await VehicleRoutes.getVehicleSeoById(id);
      const vehicleSeo = vehicleSeoResponse.data;
      const { vehicle } = response.data;
      this.setState({
        vehicle,
        vehicleSeo,
        features: vehicle.features ? vehicle.features.features : [],
        possibleFeatures: vehicle.features ? vehicle.features.possibleFeatures.sort((a, b) => a.featureId - b.featureId) : [],
        installedFeatures: vehicle.features ? vehicle.features.installedPossibleFeatures.sort((a, b) => a.featureId - b.featureId) : [],
        loading: false,
        shouldUpdateVehicleData: false,
        rimSize: vehicle.rimSize,
      });
    } catch (error) {
      this.setState({ loading: false, getVehicleDataError: error });
    }
  };

  openDamageMapDialog = selectedPictureId => () => {
    this.setState(prevState => ({
      showDamageMap: true,
      damageMapPicture: prevState.vehicle.picturesUrl.find(picture => picture._id === selectedPictureId),
    }));
  };

  handleCloseDamageMapDialog = () =>
    this.setState({
      showDamageMap: false,
      damageMapPicture: null,
      shouldUpdateVehicleData: true,
    });

  handleUpdateFeatures = async (installed, possible) => {
    const { stockid, loadFeatures } = this.state.vehicle;
    if (!loadFeatures) {
      this.setState({ loadFeatures: true });
    }
    const { featuresToSave, checked, possibleFeatures } = this.state;
    const UPDATE_DATA = {
      stockid,
      installedPossibleFeatures: installed.sort((a, b) => a.featureId - b.featureId),
      possibleFeatures: possible.sort((a, b) => a.featureId - b.featureId),
    };
    const SAVE_DATA = {
      stockId: stockid,
      possibleFeatures: [...featuresToSave, ...checked],
    };
    const DELETE_DATA = {
      stockId: stockid,
      featureId: possibleFeatures.map(el => el.featureId),
    };
    try {
      if (SAVE_DATA.possibleFeatures.length > 0) {
        await VehicleRoutes.saveFeatures({ ...SAVE_DATA });
      }
      await VehicleRoutes.deleteFeatures({
        ...DELETE_DATA,
      });

      const response = await VehicleRoutes.updateFeatures({ ...UPDATE_DATA });

      this.setState({
        featuresToSave: [],
        checked: [],
        shouldUpdateVehicleData: true,
        uploadingStatus: response,
        loadFeatures: false,
      });
    } catch (error) {
      this.setState({
        uploadingStatus: error,
        loadFeatures: false,
      });
    }
  };

  handleParseFeatures = async installed => {
    const { stockid, loadFeatures } = this.state.vehicle;
    if (!loadFeatures) {
      this.setState({ loadFeatures: true });
    }
    const possibleFeatureId = installed.map(el => el.featureId);
    const NADA_DATA = {
      stockId: stockid,
      possibleFeatureId,
    };
    const checkForModal = [];
    const nadaResponse = await VehicleRoutes.checkNada({ ...NADA_DATA });
    const { response } = nadaResponse;
    response.forEach(el => el.nadaEquipments.length > 1 && checkForModal.push(el));
    const withName = checkForModal.map(el => {
      const findInstalled = installed.find(inst => inst.featureId === el.possibleFeatureId);
      const { featureName } = findInstalled;
      return {
        ...el,
        featureName,
      };
    });
    const featuresToSave = response
      .filter(el => el.nadaEquipments.length <= 1)
      .map(el => {
        const { possibleFeatureId, nadaEquipments } = el;
        if (nadaEquipments.length === 0) {
          return {
            possibleFeatureId,
            nadaEquipmentId: null,
          };
        } else
          return {
            possibleFeatureId,
            nadaEquipmentId: nadaEquipments[0].id,
          };
      });
    this.setState(prevState => ({
      nadaFeatures: [...prevState.nadaFeatures, ...withName],
      showFeatureDialog: withName.length > 0,
      featuresToSave: [...prevState.featuresToSave, ...featuresToSave],
      loadFeatures: false,
    }));
  };

  handleInstalled = array => this.setState({ installedFeatures: array });
  handlePossible = array => this.setState({ possibleFeatures: array });

  handleCheckBox = feature => {
    const { checked } = this.state;
    const isChecked = checked.find(el => el.possibleFeatureId === feature.possibleFeatureId);
    if (!isChecked) {
      const array = [...checked];
      array.push(feature);
      this.setState({ checked: array });
    }
    if (isChecked) {
      const array = [...checked.filter(el => el.possibleFeatureId !== feature.possibleFeatureId)];
      array.push(feature);
      this.setState({ checked: array });
    }
  };

  handleCloseDialog = () => {
    const { nadaFeatures, checked, installedFeatures } = this.state;
    if (nadaFeatures.length === checked.length) {
      this.setState({ showFeatureDialog: false });
    } else {
      const notChecked = nadaFeatures.slice().filter(nada => typeof checked.find(el => el.possibleFeatureId === nada.possibleFeatureId) === 'undefined');
      const fromInstalled = installedFeatures.slice().filter(inst => typeof notChecked.find(el => el.possibleFeatureId === inst.featureId) !== 'undefined');
      const newInstalled = installedFeatures.slice().filter(inst => typeof fromInstalled.find(el => el.featureId === inst.featureId) === 'undefined');
      const newChecked = nadaFeatures.slice().filter(nada => typeof checked.find(el => el.possibleFeatureId === nada.possibleFeatureId) !== 'undefined');
      this.setState(prevState => ({
        installedFeatures: newInstalled,
        nadaFeatures: newChecked,
        possibleFeatures: [...prevState.possibleFeatures, ...fromInstalled],
        showFeatureDialog: false,
      }));
    }
  };

  handleResetUploadingStatus = () => this.setState({ uploadingStatus: null });

  render() {
    const {
      vehicle: { stockid, model, make, series, carYear, picturesUrl },
      loading,
      showDamageMap,
      damageMapPicture,
      features,
      uploadingStatus,
      possibleFeatures,
      installedFeatures,
      showFeatureDialog,
      nadaFeatures,
      checked,
      loadFeatures,
      rimSize,
    } = this.state;
    const { classes } = this.props;

    const snackbarMessage = (uploadingStatus && (uploadingStatus.status || uploadingStatus.message)) || '';

    const vehicleTitle = `${make} ${model} ${series}`;
    const vehicleImageArray =
      picturesUrl &&
      picturesUrl.sort((a, b) => a.name.split('.')[0].split('_')[a.name.split('.')[0].split('_').length - 1] - b.name.split('.')[0].split('_')[b.name.split('.')[0].split('_').length - 1]);

    return loading ? (
      <Grid container justify="center">
        <CircularProgress />
      </Grid>
    ) : (
      <div>
        <a href="/cars-list">
          <Button className={classes.backToResultButton} color="inherit">
            <ArrowBackIcon /> Back to results
          </Button>
        </a>
        <Grid container direction="column" alignItems="center" justify="center">
          {stockid ? (
            <>
              <Typography>{`Vehicle stock ID - ${stockid}`}</Typography>
              <Typography>{vehicleTitle}</Typography>
              <Typography>{carYear}</Typography>
              <Grid container justify="center">
                {vehicleImageArray.length ? (
                  <div
                    className={classes.vehicleHeroImage}
                    style={{
                      backgroundImage: `url(${vehicleImageArray[0].picture})`,
                    }}
                    alt="vehicle hero"
                  />
                ) : (
                  'No picture is available'
                )}
              </Grid>
              <Grid style={{ borderTop: '1px solid gray' }} container justify="center">
                {vehicleImageArray.map(item => (
                  <Grid container alignItems="center" className={classes.vehicleImageContainer} key={item._id} onClick={this.openDamageMapDialog(item._id)}>
                    <img className={classes.vehicleImage} src={item.picture} alt={vehicleTitle} />
                  </Grid>
                ))}
              </Grid>
              <Grid>
                <Typography className={classes.FeatureHead} variant="h5" align="center">
                  Features section
                </Typography>
                <Typography className={classes.RimSizeTypo} variant="h5" align="center">
                  Rim Size: R-{rimSize ? rimSize : 0}"
                </Typography>
                {installedFeatures && (
                  <TransferList
                    installed={installedFeatures}
                    possible={possibleFeatures}
                    handleUpdateFeatures={this.handleUpdateFeatures}
                    handleParseFeatures={this.handleParseFeatures}
                    handleInstalled={this.handleInstalled}
                    handlePossible={this.handlePossible}
                    loading={loadFeatures}
                  />
                )}
              </Grid>
              {showDamageMap && (
                <DamageMap
                  stockId={stockid}
                  showDamageMap={showDamageMap}
                  features={features}
                  installedFeatures={installedFeatures}
                  damageMapPicture={damageMapPicture}
                  handleCloseDamageMapDialog={this.handleCloseDamageMapDialog}
                />
              )}
              {showFeatureDialog && <FeatureModal show={showFeatureDialog} features={nadaFeatures} handleCloseDialog={this.handleCloseDialog} handleCheckBox={this.handleCheckBox} checked={checked} />}
            </>
          ) : (
            <Grid container justify="center">
              No Vehicle data was found
            </Grid>
          )}
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={!!uploadingStatus}
            autoHideDuration={6000}
            onClose={this.handleResetUploadingStatus}
            message={snackbarMessage}
          />
        </Grid>
        <Grid container direction="column" alignItems="center" justify="center" style={{ backgroundColor: 'white', marginTop: '0.5em' }}>
          <VehicleSeo data={this.state.vehicleSeo} handleSeoUpdate={this.handleSeoUpdate} />
        </Grid>
      </div>
    );
  }
}

Vehicle.propTypes = {
  listOfVehicles: PropTypes.array.isRequired,
};

export default compose(
  connect(
    createStructuredSelector({
      listOfVehicles: listOfVehiclesSelector,
    })
  ),
  withStyles(styles, { withTheme: true })
)(Vehicle);
