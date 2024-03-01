import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import ImageMapper from 'react-img-mapper';
import classNames from 'classnames';
import uuid from 'uuid';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

import DamagePinIcon from 'assets/img/damageMap/damagePin.svg';
import FeaturePinIcon from 'assets/img/damageMap/featurePin.svg';
import HoveredDamagePinIcon from 'assets/img/damageMap/hoveredDamagePin.svg';
import HoveredFeaturePinIcon from 'assets/img/damageMap/hoveredFeaturePin.svg';
import SelectedPin from 'assets/img/damageMap/selectedPin.svg';

import { CIRCLE_RADIUS, PIN_SHAPE, DAMAGE_MAP_TYPES } from './constants';
import { VehicleRoutes } from 'client';

export const DamageMapStyles = theme => ({
  damageMapDialogPaper: {
    width: '100%',
    maxWidth: 'unset',
    padding: theme.spacing(3),
  },
  damageMapContainer: {
    height: 650,
  },
  damageMapPin: {
    position: 'absolute',
    transform: 'translate3d(-50%, -50%, 0)',
    cursor: 'pointer',
    zIndex: 100,
    height: 30,
    width: 30,
    display: 'block',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  damageMapDefaultDamagePin: {
    backgroundImage: `url(${DamagePinIcon})`,
    '&:hover': {
      backgroundImage: `url(${HoveredDamagePinIcon})`,
    },
  },
  damageMapDefaultFeaturePin: {
    backgroundImage: `url(${FeaturePinIcon})`,
    '&:hover': {
      backgroundImage: `url(${HoveredFeaturePinIcon})`,
    },
  },
  damageMapSelectedPin: {
    backgroundImage: `url(${SelectedPin})`,
  },
  damagePinDialog: {
    width: 250,
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1.875)}px`,
  },
  damageDialogCloseIcon: {
    width: 16,
    height: 16,
    cursor: 'pointer',
  },
  damageDialogWriteTextarea: {
    width: '100%',
    margin: '12px 0px',
  },
  savePinsButton: {
    margin: `${theme.spacing(2)}px 0px`,
  },
  damagePinDetailsBox: {
    position: 'absolute',
    width: 250,
    minHeight: 120,
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1.875)}px`,
    background: theme.palette.common.white,
  },
  pinFeatureSelector: {
    margin: `${theme.spacing(1.5)}px 0px`,
  },
  drawerPaper: {
    width: 480,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 100,
  },
  imageTitleBar: {
    background: 'transparent',
  },
  icon: {
    color: '#ffae00',
  },
});

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class DamageMap extends React.Component {
  state = {
    addNewSelectedPin: null,
    damageMap: {
      name: 'pin-map',
      areas: [],
    },
    damageMapDescriptions: [],
    arePinsSaved: true,
    titleError: false,
    descriptionError: false,
    uploadingStatus: null,
    uploadPinsFirstTime: false,
    showExitConfirmation: false,
  };

  damageMapTitleInput = React.createRef();

  damageMapDescriptionInput = React.createRef();

  componentDidMount() {
    this.setVehiclePins();
  }

  setVehiclePins = () => {
    const { damageMapPicture } = this.props;
    const hasPins = damageMapPicture.pin;

    this.setState({
      damageMap: {
        name: 'pin-map',
        areas: hasPins ? [...damageMapPicture.pin.areas] : [],
      },
      damageMapDescriptions: hasPins ? [...damageMapPicture.pin.description] : [],
      uploadPinsFirstTime: !hasPins,
      uploadingStatus: null,
    });
  };

  getTipPosition(area) {
    return { top: `${area.coords[1]}px`, left: `${area.coords[0]}px` };
  }

  handleChangePinType = pinId => event => {
    const { features, installedFeatures } = this.props;
    const type = event.target.value;

    const defaultFeature = features[0];
    const defaultInstalledFeature = installedFeatures[0];

    this.setState(prevState => ({
      damageMapDescriptions: prevState.damageMapDescriptions.map(pin => {
        return pin.id === pinId ? handlePinContent(type, pin) : pin;
      }),
    }));

    function handlePinContent(type, pin) {
      switch (type) {
        case 'DAMAGE':
          return {
            ...pin,
            type,
            title: '',
            description: '',
          };
        case 'FEATURE':
          return {
            ...pin,
            type,
            title: defaultFeature.featureName,
            description: defaultFeature.featureDesc,
          };
        case 'INSTALLED FEATURE':
          return {
            ...pin,
            type,
            title: defaultInstalledFeature.featureName,
            description: defaultInstalledFeature.featureDesc,
          };
        default:
          return pin;
      }
    }
  };

  handleChangeFeature = pinId => event => {
    const { features, installedFeatures } = this.props;
    const featureId = event.target.value;

    this.setState(prevState => ({
      damageMapDescriptions: prevState.damageMapDescriptions.map(pin => {
        if (pin.id === pinId) {
          const selectedFeature = pin.type === 'FEATURE' ? features.find(feature => feature.featureId === featureId) : installedFeatures.find(feature => feature.featureId === featureId);
          return {
            ...pin,
            title: selectedFeature.featureName,
            description: selectedFeature.featureDesc,
          };
        } else return pin;
      }),
    }));
  };

  handleChangeDamageTextArea = (pinId, field) => event => {
    event.persist();

    this.setState(prevState => ({
      damageMapDescriptions: prevState.damageMapDescriptions.map(pin => {
        if (pin.id === pinId) {
          return {
            ...pin,
            [field]: event.target.value,
          };
        } else return pin;
      }),
    }));
  };

  handleShowDamageDialog = addNewSelectedPin => () => this.setState({ addNewSelectedPin });

  handleNewDamagePin = event => {
    event.persist();
    const coords = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    const id = uuid();
    const hasEmptyPins = this.state.damageMapDescriptions.reduce((prevResult, pin) => {
      return pin.title.trim() === '' ? prevResult.concat(pin.id) : prevResult;
    }, []);

    this.setState(prevState => ({
      addNewSelectedPin: hasEmptyPins.length ? prevState.damageMap.areas.filter(pin => !hasEmptyPins.includes(pin.name)).length : prevState.damageMap.areas.length,
      damageMap: {
        ...prevState.damageMap,
        areas: prevState.damageMap.areas
          .filter(pin => !hasEmptyPins.includes(pin.name))
          .concat({
            name: id,
            shape: PIN_SHAPE,
            coords: [coords.x, coords.y, CIRCLE_RADIUS],
          }),
      },
      damageMapDescriptions: prevState.damageMapDescriptions
        .filter(pin => !hasEmptyPins.includes(pin.id))
        .concat({
          id,
          type: DAMAGE_MAP_TYPES[0],
          title: '',
          description: '',
        }),
    }));
  };

  saveDamageMapPin = pin => event => {
    event.preventDefault();
    const title = pin.title;
    const description = pin.description;
    const noTitle = title.trim() === '';
    const noDescription = description.trim() === '';

    if (pin.type === 'DAMAGE' && (noTitle || noDescription)) {
      this.setState({
        titleError: noTitle ? 'Please enter title' : false,
        descriptionError: noDescription ? 'Please enter description' : false,
      });
    } else {
      this.setState(prevState => ({
        damageMapDescriptions: prevState.damageMapDescriptions.map(item => {
          if (item.id === pin.id) {
            return pin
              ? {
                  ...item,
                  title,
                  description,
                }
              : {
                  id: uuid(),
                  title,
                  description,
                };
          }
          return item;
        }),
        addNewSelectedPin: null,
        titleError: false,
        descriptionError: false,
        arePinsSaved: false,
      }));
    }
  };

  handleDeleteDamagePin = pin => () =>
    this.setState(prevState => ({
      addNewSelectedPin: null,
      damageMap: {
        ...prevState.damageMap,
        areas: prevState.damageMap.areas.filter(item => item.name !== pin.id),
      },
      damageMapDescriptions: prevState.damageMapDescriptions.filter(item => item.id !== pin.id),
      titleError: false,
      descriptionError: false,
      arePinsSaved: false,
    }));

  handleUploadSavedPins = async () => {
    const {
      stockId,
      damageMapPicture: { _id, name },
    } = this.props;
    const { damageMap, damageMapDescriptions, uploadPinsFirstTime } = this.state;

    const pinData = {
      picture: uploadPinsFirstTime ? _id : name,
      pin: {
        areas: [...damageMap.areas],
        description: [...damageMapDescriptions],
        stockId: stockId,
      },
    };

    try {
      const response = uploadPinsFirstTime ? await VehicleRoutes.postVehiclePins({ ...pinData }) : await VehicleRoutes.updateVehiclePinsById({ ...pinData });
      this.setState({
        uploadingStatus: response,
        uploadPinsFirstTime: false,
        arePinsSaved: true,
      });
    } catch (error) {
      this.setState({ uploadingStatus: error });
    }
  };

  handleResetUploadingStatus = () => this.setState({ uploadingStatus: null });

  handleCloseDialog = () => {
    if (!this.state.arePinsSaved) {
      this.setState({ showExitConfirmation: true });
    } else {
      this.props.handleCloseDamageMapDialog();
    }
  };

  closeConfirmationDialog = () => this.setState({ showExitConfirmation: false });

  renderFeatureDescription = description =>
    description.split(',').map(item => (
      <Typography variant="caption" key={item}>
        {item.trim() === '' ? 'Description is not available' : `• ${item}`}
      </Typography>
    ));

  render() {
    const { classes, showDamageMap, damageMapPicture, features, installedFeatures } = this.props;

    const { addNewSelectedPin, damageMap, damageMapDescriptions, titleError, descriptionError, uploadingStatus, showExitConfirmation } = this.state;

    const snackbarMessage = (uploadingStatus && (uploadingStatus.status || uploadingStatus.message)) || '';

    return (
      <Dialog
        open={showDamageMap}
        TransitionComponent={Transition}
        onClose={this.handleCloseDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.damageMapDialogPaper }}
      >
        <Grid container wrap="nowrap" direction="column" alignItems="center" className={classes.damageMapContainer}>
          <Typography variant="h5" gutterBottom>
            Click on the image to create new pin
          </Typography>
          <Button size="large" className={classes.savePinsButton} variant="contained" color="primary" onClick={this.handleUploadSavedPins}>
            <SaveIcon style={{ marginRight: 10 }} /> SAVE PINS
          </Button>
          <Grid container alignItems="center" justify="center">
            <div style={{ border: '1px solid gray', position: 'relative' }}>
              <ImageMapper
                src={damageMapPicture.picture}
                map={damageMap}
                width={520}
                onImageClick={evt => this.handleNewDamagePin(evt)}
                lineWidth={0}
                strokeColor="transparent"
                fillColor="transparent"
              />
              {!!damageMap.areas.length &&
                damageMap.areas.map((area, areaIndex) => {
                  const damageDetails = damageMapDescriptions.find(data => data.id === area.name);

                  return (
                    <React.Fragment key={area.name + 1}>
                      <span
                        aria-describedby={area.name}
                        style={{
                          ...this.getTipPosition(area),
                        }}
                        // NOTE: if there is a new damage pin we show red icon, if there is a feature pin we show green pin
                        // and if pin is selected it has yellow color
                        className={classNames(
                          classes.damageMapPin,
                          addNewSelectedPin === areaIndex ? classes.damageMapSelectedPin : damageDetails.type === 'DAMAGE' ? classes.damageMapDefaultDamagePin : classes.damageMapDefaultFeaturePin
                        )}
                        onClick={this.handleShowDamageDialog(areaIndex)}
                        aria-hidden="true"
                      />
                      {addNewSelectedPin === areaIndex && (
                        <Paper
                          className={classes.damagePinDetailsBox}
                          id={area.name}
                          style={{
                            ...this.getTipPosition(area),
                          }}
                        >
                          <Grid container justify="flex-end">
                            <CloseIcon classes={{ root: classes.damageDialogCloseIcon }} onClick={this.saveDamageMapPin(damageDetails)} />
                          </Grid>
                          <Grid container direction="column">
                            <InputLabel id="damage-map-type-select">Type</InputLabel>
                            <Select labelid="damage-map-type-select" id="damage-map-select" value={damageDetails.type} onChange={this.handleChangePinType(damageDetails.id)} fullWidth>
                              {DAMAGE_MAP_TYPES.map(type =>
                                type === 'INSTALLED FEATURE' && installedFeatures.length === 0 ? null : (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {damageDetails.type === 'DAMAGE' && (
                              <>
                                <Grid container>
                                  <TextareaAutosize
                                    className={classes.damageDialogWriteTextarea}
                                    aria-label="empty damage title"
                                    placeholder="Add title"
                                    defaultValue={damageDetails && damageDetails.title}
                                    onChange={this.handleChangeDamageTextArea(damageDetails.id, 'title')}
                                    ref={this.damageMapTitleInput}
                                  />
                                  {titleError && (
                                    <Typography variant="caption" color="error">
                                      {titleError}
                                    </Typography>
                                  )}
                                </Grid>
                                <Grid container>
                                  <TextareaAutosize
                                    className={classes.damageDialogWriteTextarea}
                                    aria-label="empty damage description"
                                    placeholder="Add Description"
                                    defaultValue={damageDetails && damageDetails.description}
                                    onChange={this.handleChangeDamageTextArea(damageDetails.id, 'description')}
                                    ref={this.damageMapDescriptionInput}
                                  />
                                  {descriptionError && (
                                    <Typography variant="caption" color="error">
                                      {descriptionError}
                                    </Typography>
                                  )}
                                </Grid>
                              </>
                            )}
                            {(damageDetails.type === 'FEATURE' || damageDetails.type === 'INSTALLED FEATURE') && (
                              <Grid container>
                                <Grid container className={classes.pinFeatureSelector}>
                                  <InputLabel id="damage-map-feature-select">Title</InputLabel>
                                  <Select
                                    labelid="damage-map-feature-select"
                                    id="damage-map-feature"
                                    value={damageDetails.title}
                                    renderValue={value => value}
                                    onChange={this.handleChangeFeature(damageDetails.id)}
                                    fullWidth
                                  >
                                    {damageDetails.type === 'FEATURE' &&
                                      features.map(item => (
                                        <MenuItem key={item.featureId} value={item.featureId}>
                                          {item.featureName}
                                        </MenuItem>
                                      ))}
                                    {damageDetails.type === 'INSTALLED FEATURE' &&
                                      installedFeatures.map(item => (
                                        <MenuItem key={item.featureId} value={item.featureId}>
                                          {item.featureName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </Grid>
                                <Grid container direction="column">
                                  {this.renderFeatureDescription(damageDetails.description)}
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                          <Grid style={{ width: '100%', marginTop: 12 }} container justify="space-between">
                            <Button variant="contained" color="secondary" onClick={this.handleDeleteDamagePin(damageDetails)}>
                              Delete
                            </Button>
                            <Button variant="contained" color="secondary" onClick={this.saveDamageMapPin(damageDetails)}>
                              Save
                            </Button>
                          </Grid>
                        </Paper>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          </Grid>
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
          <Dialog open={showExitConfirmation} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Warning</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Are you sure you want leave this page with unsaved pins?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeConfirmationDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={this.props.handleCloseDamageMapDialog} color="primary" autoFocus>
                Leave
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Dialog>
    );
  }
}

DamageMap.propTypes = {
  stockId: PropTypes.number.isRequired,
  damageMapPicture: PropTypes.object,
  showDamageMap: PropTypes.bool.isRequired,
  handleCloseDamageMapDialog: PropTypes.func.isRequired,
  features: PropTypes.array.isRequired,
  installedFeatures: PropTypes.array.isRequired,
};

DamageMap.defaultProps = {
  damageMapPicture: {},
};

export default compose(withStyles(DamageMapStyles, { withTheme: true }))(DamageMap);
