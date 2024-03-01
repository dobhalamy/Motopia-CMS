import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import classNames from 'classnames';
import { useToasts } from 'react-toast-notifications';

import { Button, Dialog, DialogContent, DialogTitle as MuiDialogTitle, Typography, IconButton, Grid } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import { Web360 } from 'client';
import PinCreator from 'components/VehiclePage/PinCreator';
import { VehicleRoutes } from 'client';
import TransferList from 'components/VehiclePage/TransferList';
import FeatureModal from 'components/VehiclePage/FeatureModal';
import { BASE_URL } from 'client/api';
import ReactPannellum, { getConfig, getPitch, getYaw, addHotSpot, lookAt, removeHotSpot } from 'react-pannellum';
import featurePin from '../../assets/img/damageMap/circ-cross-thin-orange.svg';
import damagePin from '../../assets/img/damageMap/circ-cross-thin-red.svg';
import PinDrawer from 'components/VehiclePage/PinDrawer';
import { VIEWS, getTableColums, generateInteriorHotspot, interiorHotspotMapper } from './helpers';

const dialogStyles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const mainStyles = theme => ({
  root: {
    zIndex: 100,
  },
  viewsContainer: {
    position: 'relative',
  },
  viewSwitchButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 100,
  },
  blackBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 1)',
    },
  },
  hotSpot: {
    width: 20,
    height: 20,
    backgroundSize: 'cover',
    backgroundRepeat: 'none',
    '&:hover': {
      '& span': {
        visibility: 'visible',
      },
    },
    '& span': {
      visibility: 'hidden',
    },
  },
  hotSpotWrapper: {
    width: 250,
    minHeight: 120,
    maxHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1.875)}px`,
    background: theme.palette.common.white,
    overflow: 'scroll',
  },
  hotSpotFeature: {
    backgroundImage: `url(${featurePin})`,
  },
  hotSpotDamage: {
    backgroundImage: `url(${damagePin})`,
  },
  hotSpotTitle: {
    margin: 0,
  },
  hotSpotImage: {
    width: '100%',
    height: 'auto',
  },
});

const DialogTitle = withStyles(dialogStyles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const WebRotate360Dialog = ({ isOpen, data = '0', rows, handleCloseDialog, classes }) => {
  const configFileURL = `${BASE_URL}web360/${data}`;
  const rootPath = 'https://res.cloudinary.com/luxor-motor-cars-inc/';
  const { addToast } = useToasts();
  // General
  const [vehicle, setVehicle] = useState();
  const [features, setFeatures] = useState([]);
  const [possibleFeatures, setPossibleFeatures] = useState([]);
  const [installedFeatures, setInstallFeatures] = useState([]);
  const [featuresToSave, setFeaturesToSave] = useState([]);
  const [checkedFeatures, setCheckedFeatures] = useState([]);
  const [nadaFeatures, setNadaFeatures] = useState([]);
  const [isLoadingFeatures, setLoadingFeatures] = useState(false);
  const [shouldVehicleDataUpdate, setVehicleDataUpdate] = useState(false);
  const [isFeatureDialogShown, setFeatureDialogShown] = useState(false);
  const [hotspotPictures, setHotspotPictures] = useState([]);
  const [currentView, setCurrentView] = useState(VIEWS.exterior);
  // Exterior
  const [xmlFile, setXmlFile] = useState();
  const [rotator, setRotator] = useState();
  const [rotatorApi, setRotatorApi] = useState();
  const [mapPicture, setMapPicture] = useState(null);
  const [exteriorHotspots, setExteriorHotspots] = useState([]);
  const [rotatorSettings, setRotatorSettings] = useState({
    disableRelativeAssets: true,
    graphicsPath: '/img',
    alt: `Stock ID #${data}`,
    googleEventTracking: false,
    responsiveBaseWidth: 400,
    responsiveMinHeight: 400,
    rootPath,
    apiReadyCallback: api => {
      setRotatorApi(api);
      const currentRow = api.images.getCurrentRowIndex();
      const currentImage = api.images.getCurrentImageIndex();
      setMapPicture(rows[currentRow][currentImage]);
      api.images.onFrame(({ index }) => {
        const { image, row } = index;
        setMapPicture(rows[row][image]);
      });
    },
  });
  // Interior
  const [isAddingInteriorPin, setAddingInteriorPin] = useState(false);
  const [interiorHotspotCoordinates, setHotSpotCoordinates] = useState({
    pitch: 0,
    yaw: 0,
  });
  const [interiorHotspots, setInteriorHotspots] = useState([]);
  const [updatingHotspot, setUpdatingHotspot] = useState(null);
  const [interiorImage, setInteriorImage] = useState('https://res.cloudinary.com/luxor-motor-cars-inc/image/upload/v1647196106/interior/IMG_0145.jpg');
  const [panoramaConfig, setPanoramaConfig] = useState({
    autoLoad: true,
    hotSpotDebug: true,
    width: 400,
  });
  function interiorHotspotClickHandler() {
    const { pitch, yaw } = this;
    const pinToEdit = {
      id: this.id,
      title: this.createTooltipArgs.title,
      type: this.createTooltipArgs.type,
      description: this.createTooltipArgs.description,
    };
    if (this.createTooltipArgs.picture) {
      pinToEdit.picture = this.createTooltipArgs.picture;
    }
    setHotSpotCoordinates({ pitch, yaw });
    setAddingInteriorPin(true);
    setUpdatingHotspot(pinToEdit);
  }
  const getXml = async () => {
    try {
      const stockXmlConfig = await Web360.getXMLById(data);
      setXmlFile(stockXmlConfig);
      return;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const getVehicleData = async () => {
    try {
      const configResponse = await Web360.get360VehicleConfig(data);
      setExteriorHotspots(configResponse.data.exteriorHotspots);
      setInteriorHotspots(
        configResponse.data.interiorHotspots.map(hp => ({
          ...interiorHotspotMapper(hp, classes),
          clickHandlerFunc: interiorHotspotClickHandler,
        }))
      );
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
    try {
      const response = await VehicleRoutes.getVehicleById(data);
      const { vehicle } = response.data;
      setVehicle(vehicle);
      if (vehicle && vehicle.features) {
        setFeatures(vehicle.features.features || []);
        setPossibleFeatures(vehicle.features ? vehicle.features.possibleFeatures.sort((a, b) => a.featureId - b.featureId) : []);
        setInstallFeatures(vehicle.features.installedPossibleFeatures.sort((a, b) => a.featureId - b.featureId) || []);
      }
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
    setVehicleDataUpdate(false);
  };
  const getHotspotPictures = async () => {
    try {
      const response = await Web360.getHotspotPictures(data);
      if (response.hotSpotPictures) {
        setHotspotPictures(response.hotSpotPictures.map(item => item.picture));
      }
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
  };
  const getInteriorImage = async () => {
    try {
      const response = await Web360.getInteriorImage(data);
      if (response.interiorAsset) {
        setInteriorImage(response.interiorAsset);
      }
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
  };

  useEffect(() => {
    if (data !== '0') {
      getXml();
      getVehicleData();
      getHotspotPictures();
      getInteriorImage();
    }
    if (currentView === VIEWS.exterior) {
      setRotator(window.WR360.ImageRotator.Create('wr360PlayerId'));
      setRotatorSettings({
        ...rotatorSettings,
        configFileURL,
      });
    }
    if (currentView === VIEWS.interior) {
      setRotator();
      const { configFileURL, ...rest } = rotatorSettings;
      setRotatorSettings(rest);
      setPanoramaConfig({
        ...panoramaConfig,
        hotSpots: interiorHotspots,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentView]);

  useEffect(() => {
    if (rotator) {
      rotator.licenseCode = process.env.REACT_APP_360_LICENSE_CODE;
      rotator.settings = {
        ...rotator.settings,
        ...rotatorSettings,
      };
      rotator.runImageRotator();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xmlFile]);

  useEffect(() => {
    if (shouldVehicleDataUpdate) {
      getVehicleData();
      rotatorApi && rotatorApi.reload(configFileURL, rootPath, null, rotatorApi.images.getCurrentImageIndex(), rotatorApi.images.getCurrentRowIndex());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldVehicleDataUpdate]);

  const handleClose = () => {
    setXmlFile();
    return handleCloseDialog();
  };

  const handleUpdateFeatures = async (installed, possible) => {
    const { stockid } = vehicle;
    if (!isLoadingFeatures) {
      setLoadingFeatures(true);
    }
    const UPDATE_DATA = {
      stockid,
      installedPossibleFeatures: installed.sort((a, b) => a.featureId - b.featureId),
      possibleFeatures: possible.sort((a, b) => a.featureId - b.featureId),
    };
    const SAVE_DATA = {
      stockId: stockid,
      possibleFeatures: [...featuresToSave, ...checkedFeatures],
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

      await VehicleRoutes.updateFeatures({ ...UPDATE_DATA });

      setFeaturesToSave([]);
      setCheckedFeatures([]);
      setVehicleDataUpdate(true);
      setLoadingFeatures(false);
      addToast('Features updated!');
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
      setLoadingFeatures(false);
    }
  };

  const handleParseFeatures = async installed => {
    const { stockid } = vehicle;
    if (!isLoadingFeatures) {
      setLoadingFeatures(true);
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
    const newFeaturesToSave = response
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
    setNadaFeatures(prevState => [...prevState, ...withName]);
    setFeatureDialogShown(withName.length > 0);
    setFeaturesToSave(prevState => [...prevState, ...newFeaturesToSave]);
    setLoadingFeatures(false);
  };

  const handleInstalled = array => setInstallFeatures(array);
  const handlePossible = array => setPossibleFeatures(array);

  const handleCheckBox = feature => {
    const isChecked = checkedFeatures.find(el => el.possibleFeatureId === feature.possibleFeatureId);
    if (!isChecked) {
      setCheckedFeatures([...checkedFeatures, feature]);
    }
    if (isChecked) {
      setCheckedFeatures([...checkedFeatures.filter(el => el.possibleFeatureId !== feature.possibleFeatureId)]);
    }
  };

  const handleCloseFeatureDialog = () => {
    if (nadaFeatures.length === checkedFeatures.length) {
      setFeatureDialogShown(false);
    } else {
      const notChecked = nadaFeatures.slice().filter(nada => typeof checkedFeatures.find(el => el.possibleFeatureId === nada.possibleFeatureId) === 'undefined');
      const fromInstalled = installedFeatures.slice().filter(inst => typeof notChecked.find(el => el.possibleFeatureId === inst.featureId) !== 'undefined');
      const newInstalled = installedFeatures.slice().filter(inst => typeof fromInstalled.find(el => el.featureId === inst.featureId) === 'undefined');
      const newChecked = nadaFeatures.slice().filter(nada => typeof checkedFeatures.find(el => el.possibleFeatureId === nada.possibleFeatureId) !== 'undefined');
      setInstallFeatures(newInstalled);
      setNadaFeatures(newChecked);
      setPossibleFeatures([...possibleFeatures, ...fromInstalled]);
      setFeatureDialogShown(false);
    }
  };

  const saveHotspots = async pinState => {
    const stockid = data;
    const { damageMap, damageMapDescriptions } = pinState;

    const pinData = {
      stockid,
      exteriorHotspots: damageMapDescriptions.map(pin => {
        const { coords } = damageMap.areas.find(p => p.name === pin.id);
        const [x, y] = coords;
        return {
          ...pin,
          offsetX: x,
          offsetY: y,
        };
      }),
    };

    try {
      await Web360.saveHotspots(pinData);
      setVehicleDataUpdate(true);
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
  };

  const handleDeleteHotspot = async id => {
    console.log(id);
    try {
      await Web360.deleteHotspot({
        stockid: data,
        hotspotid: id,
        currentView,
      });
      if (currentView === VIEWS.interior) {
        removeHotSpot(id);
      }
      setVehicleDataUpdate(true);
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
  };

  const handleJumpToHotspot = (event, rowData) => {
    event.preventDefault();
    if (currentView === VIEWS.exterior) {
      rotatorApi.images.playToLabel(rowData.title, {
        keyHotspot: rowData.id,
        activateHotspot: true,
        resetZoom: true,
        disableDrag: true,
        speed: 2,
        // More config in ./docs.js exteriorPlayToLabelConfig
      });
    } else {
      const { pitch, yaw } = rowData;
      lookAt(pitch, yaw);
    }
  };

  const createInteriorHotspot = async hotspotState => {
    if (!hotspotState) {
      setAddingInteriorPin(false);
      return;
    }
    await addHotSpot({
      ...generateInteriorHotspot(interiorHotspotCoordinates, hotspotState, classes),
      clickHandlerFunc: interiorHotspotClickHandler,
    });
    const { hotSpots } = getConfig();
    console.log(hotSpots);
    const hotSpotData = {
      stockid: data,
      interiorHotspots:
        hotSpots.length > 0
          ? hotSpots.map(hp => ({
              id: hp.id,
              pitch: hp.pitch,
              yaw: hp.yaw,
              createTooltipArgs: hp.createTooltipArgs,
            }))
          : [],
    };
    try {
      await Web360.saveHotspots(hotSpotData);
      setVehicleDataUpdate(true);
      setAddingInteriorPin(false);
      setUpdatingHotspot(null);
    } catch (error) {
      addToast(error.status || error.message, { severity: 'error' });
    }
  };

  const handleSwitchView = () => {
    setCurrentView(currentView === VIEWS.exterior ? VIEWS.interior : VIEWS.exterior);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullScreen
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.root,
        }}
      >
        <DialogTitle onClose={handleClose}>Exterior & Interior hotspots for Stock {data}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} container justifyContent="center" alignItems="flex-start">
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  {currentView === VIEWS.exterior ? 'Choose the image for hotspots' : 'Use the center of screen to locate hotsport'}
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.viewsContainer}>
                <div
                  id="wr360PlayerId"
                  className="wr360_player"
                  style={{
                    display: currentView === VIEWS.exterior ? 'block' : 'none',
                  }}
                />
                {currentView === VIEWS.interior && (
                  <ReactPannellum
                    id={VIEWS.interior}
                    sceneId={VIEWS.interior}
                    // replace with
                    imageSource={interiorImage}
                    config={panoramaConfig}
                    style={{
                      width: '100%',
                      borderRadius: 4,
                    }}
                  />
                )}
                <Button className={classNames(classes.viewSwitchButton, classes.blackBtn)} onClick={handleSwitchView} variant="contained" color="secondary" size="small">
                  Switch to {currentView === VIEWS.exterior ? VIEWS.interior : VIEWS.exterior}
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} container justifyContent="center" alignItems="flex-start">
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  Create your pins
                </Typography>
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <div
                  style={{
                    display: currentView === VIEWS.exterior ? 'block' : 'none',
                  }}
                >
                  <PinCreator
                    features={features}
                    installedFeatures={installedFeatures}
                    damageMapPicture={mapPicture}
                    vehicle={vehicle}
                    handleSaveHotSpots={saveHotspots}
                    rotatorApi={rotatorApi}
                    hotspotPictures={hotspotPictures}
                  />
                </div>
                <div
                  style={{
                    display: currentView === VIEWS.interior ? 'block' : 'none',
                    textAlign: 'center',
                  }}
                >
                  {/* <div style={{ width: '100%' }}> */}
                  <Typography align="center" style={{ marginBottom: 20 }}>
                    The pin will be created in a center of screen. The center is marked as a + in the circle
                  </Typography>
                  {/* </div> */}
                  <Button
                    className={classNames(classes.blackBtn)}
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                      setAddingInteriorPin(true);
                      setHotSpotCoordinates({
                        pitch: getPitch(),
                        yaw: getYaw(),
                      });
                    }}
                  >
                    Create pin
                  </Button>
                  <PinDrawer
                    isOpen={isAddingInteriorPin}
                    onClose={() => setAddingInteriorPin(false)}
                    handleCreatePin={createInteriorHotspot}
                    features={features}
                    installedFeatures={installedFeatures}
                    updatingHotspot={updatingHotspot}
                    hotspotPictures={hotspotPictures}
                    handleDeleteHotspot={handleDeleteHotspot}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <MaterialTable
                title="Hotspots"
                columns={getTableColums(currentView)}
                data={currentView === VIEWS.exterior ? exteriorHotspots : interiorHotspots}
                options={{
                  actionsColumnIndex: -1,
                  padding: 'dense',
                }}
                actions={[
                  {
                    icon: 'visibility',
                    tooltip: 'Show',
                    disabled: currentView.exterior ? !rotatorApi : false,
                    onClick: handleJumpToHotspot,
                  },
                  {
                    icon: 'deleteForever',
                    tooltip: 'Delete',
                    onClick: (e, rowData) => handleDeleteHotspot(rowData.id),
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Features section
              </Typography>
            </Grid>

            {installedFeatures && (
              <TransferList
                installed={installedFeatures}
                possible={possibleFeatures}
                handleUpdateFeatures={handleUpdateFeatures}
                handleParseFeatures={handleParseFeatures}
                handleInstalled={handleInstalled}
                handlePossible={handlePossible}
                loading={isLoadingFeatures}
              />
            )}
          </Grid>
          {isFeatureDialogShown && (
            <FeatureModal show={isFeatureDialogShown} features={nadaFeatures} handleCloseDialog={handleCloseFeatureDialog} handleCheckBox={handleCheckBox} checked={checkedFeatures} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

WebRotate360Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  data: PropTypes.string,
  rows: PropTypes.array.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
};

export default withStyles(mainStyles)(WebRotate360Dialog);
