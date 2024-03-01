import React, { useState, createRef } from 'react';
import { compose } from 'recompose';
import uuid from 'uuid';
import ImageMapper from 'react-img-mapper';
import classNames from 'classnames';

import {
  Button,
  Typography,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemText,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@material-ui/core';
import { Close as CloseIcon, Save as SaveIcon } from '@material-ui/icons';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { withStyles } from '@material-ui/core/styles';

import { CIRCLE_RADIUS, PIN_SHAPE, DAMAGE_MAP_TYPES } from './constants';
import { DamageMapStyles } from './DamageMap';

export const renderFeatureDescription = description => {
  const descriptionArr = description.split(',');
  return descriptionArr.length > 1 ? (
    <List dense disablePadding>
      {descriptionArr.map(desc => {
        const text = desc.trim();
        if (text.length === 0) {
          return null;
        }
        return (
          <ListItem dense disableGutters key={text} style={{ padding: 0 }}>
            <ListItemText style={{ margin: 0 }}>
              <Typography variant="caption">• {text}</Typography>
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  ) : (
    <Typography variant="caption">{description.trim()}</Typography>
  );
};

const PinCreator = ({
  damageMapPicture,
  installedFeatures,
  features,
  handleSaveHotSpots,
  rotatorApi,
  hotspotPictures,
  classes,
}) => {
  const damageMapTitleInput = createRef();
  const damageMapDescriptionInput = createRef();
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [pinState, setPinState] = useState({
    arePinsSaved: false,
    addNewSelectedPin: null,
    damageMapDescriptions: [],
    damageMap: {
      name: 'pin-map',
      areas: [],
    },
  });
  const [selectedPicture, setPicture] = useState(null);

  const handleNewDamagePin = event => {
    event.persist();
    const entity = event.target.src;
    if (entity) {
      const coords = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };

      const id = uuid();
      const hasEmptyPins = state =>
        state.damageMapDescriptions.reduce((prevResult, pin) => {
          return pin.title.trim() === '' ? [...prevResult, pin.id] : prevResult;
        }, []);

      setPinState(prevState => ({
        ...prevState,
        addNewSelectedPin: hasEmptyPins(prevState).length
          ? prevState.damageMap.areas.filter(
              pin => !hasEmptyPins(prevState).includes(pin.name)
            ).length
          : prevState.damageMap.areas.length,
        damageMap: {
          ...prevState.damageMap,
          areas: prevState.damageMap.areas
            .filter(pin => !hasEmptyPins(prevState).includes(pin.name))
            .concat({
              name: id,
              shape: PIN_SHAPE,
              coords: [coords.x, coords.y, CIRCLE_RADIUS],
            }),
        },
        damageMapDescriptions: prevState.damageMapDescriptions
          .filter(pin => !hasEmptyPins(prevState).includes(pin.id))
          .concat({
            id,
            type: DAMAGE_MAP_TYPES[0],
            title: '',
            description: '',
            rowIndex: rotatorApi.images.getCurrentRowIndex(),
            imageIndex: rotatorApi.images.getCurrentImageIndex(),
            picture: selectedPicture,
          }),
      }));
    }
  };

  const getTipPosition = area => ({
    top: `${area.coords[1]}px`,
    left: `${area.coords[0]}px`,
  });

  const handleShowDamageDialog = addNewSelectedPin => () =>
    setPinState(prevState => ({ ...prevState, addNewSelectedPin }));

  const handleCloseDamageDialog = () =>
    setPinState(prevState => ({ ...prevState, addNewSelectedPin: null }));

  const saveDamageMapPin = pin => event => {
    event.preventDefault();
    const title = pin.title;
    const description = pin.description;
    const noTitle = title.trim() === '';
    const noDescription = description.trim() === '';

    if (pin.type === 'DAMAGE' && (noTitle || noDescription)) {
      setTitleError(noTitle ? 'Please enter title' : false);
      setDescriptionError(noDescription ? 'Please enter description' : false);
    } else {
      setTitleError(false);
      setDescriptionError(false);
      setPinState({
        ...pinState,
        damageMapDescriptions: pinState.damageMapDescriptions.map(item => {
          if (item.id === pin.id) {
            return pin
              ? {
                  ...item,
                  title,
                  description,
                  picture: selectedPicture,
                }
              : {
                  id: uuid(),
                  title,
                  description,
                  rowIndex: rotatorApi.images.getCurrentRowIndex(),
                  imageIndex: rotatorApi.images.getCurrentImageIndex(),
                  picture: selectedPicture,
                };
          }
          return item;
        }),
        addNewSelectedPin: null,
        arePinsSaved: false,
      });
    }
  };

  const handleChangePinType = pinId => event => {
    const type = event.target.value;

    const defaultFeature = features[0];
    const defaultInstalledFeature = installedFeatures[0];

    setPinState(prevState => ({
      ...prevState,
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

  const handleChangeDamageTextArea = (pinId, field) => event => {
    event.persist();

    setPinState(prevState => ({
      ...prevState,
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

  const handleChangeFeature = pinId => event => {
    const featureId = event.target.value;

    setPinState(prevState => ({
      ...prevState,
      damageMapDescriptions: prevState.damageMapDescriptions.map(pin => {
        if (pin.id === pinId) {
          const selectedFeature =
            pin.type === 'FEATURE'
              ? features.find(feature => feature.featureId === featureId)
              : installedFeatures.find(
                  feature => feature.featureId === featureId
                );
          return {
            ...pin,
            title: selectedFeature.featureName,
            description: selectedFeature.featureDesc,
          };
        } else return pin;
      }),
    }));
  };

  const handleDeleteDamagePin = pin => () => {
    setTitleError(false);
    setDescriptionError(false);
    setPinState(prevState => ({
      ...prevState,
      addNewSelectedPin: null,
      damageMap: {
        ...prevState.damageMap,
        areas: prevState.damageMap.areas.filter(item => item.name !== pin.id),
      },
      damageMapDescriptions: prevState.damageMapDescriptions.filter(
        item => item.id !== pin.id
      ),
      arePinsSaved: false,
    }));
  };

  const handleUploadSavedPins = () => {
    handleSaveHotSpots(pinState);
    setPinState({
      arePinsSaved: false,
      addNewSelectedPin: null,
      damageMapDescriptions: [],
      damageMap: {
        name: 'pin-map',
        areas: [],
      },
    });
    setPicture(null);
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <ImageMapper
          src={damageMapPicture}
          map={pinState.damageMap}
          width={520}
          onImageClick={e => handleNewDamagePin(e)}
          lineWidth={0}
          strokeColor="transparent"
          fillColor="transparent"
        />

        {!!pinState.damageMap.areas.length &&
          pinState.damageMap.areas.map((area, areaIndex) => {
            const damageDetails = pinState.damageMapDescriptions.find(
              data => data.id === area.name
            );

            return (
              <React.Fragment key={area.name + 1}>
                <span
                  aria-describedby={area.name}
                  style={{
                    ...getTipPosition(area),
                  }}
                  // NOTE: if there is a new damage pin we show red icon, if there is a feature pin we show green pin
                  // and if pin is selected it has yellow color
                  className={classNames(
                    classes.damageMapPin,
                    pinState.addNewSelectedPin === areaIndex
                      ? classes.damageMapSelectedPin
                      : damageDetails.type === 'DAMAGE'
                      ? classes.damageMapDefaultDamagePin
                      : classes.damageMapDefaultFeaturePin
                  )}
                  onClick={handleShowDamageDialog(areaIndex)}
                  aria-hidden="true"
                />

                <Drawer
                  open={pinState.addNewSelectedPin === areaIndex}
                  onClose={handleCloseDamageDialog}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                  <Grid container justify="flex-end">
                    <CloseIcon
                      classes={{ root: classes.damageDialogCloseIcon }}
                      onClick={saveDamageMapPin(damageDetails)}
                    />
                  </Grid>
                  <Grid container direction="column">
                    <InputLabel id="damage-map-type-select">Type</InputLabel>
                    <Select
                      labelid="damage-map-type-select"
                      id="damage-map-select"
                      value={damageDetails.type}
                      onChange={handleChangePinType(damageDetails.id)}
                      fullWidth
                    >
                      {DAMAGE_MAP_TYPES.map(type =>
                        type === 'INSTALLED FEATURE' &&
                        installedFeatures.length === 0 ? null : (
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
                            onChange={handleChangeDamageTextArea(
                              damageDetails.id,
                              'title'
                            )}
                            ref={damageMapTitleInput}
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
                            defaultValue={
                              damageDetails && damageDetails.description
                            }
                            onChange={handleChangeDamageTextArea(
                              damageDetails.id,
                              'description'
                            )}
                            ref={damageMapDescriptionInput}
                          />
                          {descriptionError && (
                            <Typography variant="caption" color="error">
                              {descriptionError}
                            </Typography>
                          )}
                        </Grid>
                      </>
                    )}
                    {(damageDetails.type === 'FEATURE' ||
                      damageDetails.type === 'INSTALLED FEATURE') && (
                      <Grid container>
                        <Grid container className={classes.pinFeatureSelector}>
                          <InputLabel id="damage-map-feature-select">
                            Title
                          </InputLabel>
                          <Select
                            labelid="damage-map-feature-select"
                            id="damage-map-feature"
                            value={damageDetails.title}
                            renderValue={value => value}
                            onChange={handleChangeFeature(damageDetails.id)}
                            fullWidth
                          >
                            {damageDetails.type === 'FEATURE' &&
                              features.map(item => (
                                <MenuItem
                                  key={item.featureId}
                                  value={item.featureId}
                                >
                                  {item.featureName}
                                </MenuItem>
                              ))}
                            {damageDetails.type === 'INSTALLED FEATURE' &&
                              installedFeatures.map(item => (
                                <MenuItem
                                  key={item.featureId}
                                  value={item.featureId}
                                >
                                  {item.featureName}
                                </MenuItem>
                              ))}
                          </Select>
                        </Grid>
                        <Grid container direction="column">
                          {renderFeatureDescription(damageDetails.description)}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  {hotspotPictures.length > 0 && (
                    <ImageList rowHeight={160} cols={3}>
                      {hotspotPictures.map(pic => (
                        <ImageListItem key={pic} cols={1}>
                          <img src={pic} alt="hotspot" />
                          <ImageListItemBar
                            className={classes.imageTitleBar}
                            position="top"
                            actionIcon={
                              pic === selectedPicture ? (
                                <IconButton
                                  className={classes.icon}
                                  onClickCapture={() => setPicture(null)}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  className={classes.icon}
                                  onClickCapture={() => setPicture(pic)}
                                >
                                  <RadioButtonUncheckedIcon />
                                </IconButton>
                              )
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                  <Grid
                    style={{ width: '100%', marginTop: 12 }}
                    container
                    justify="space-between"
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDeleteDamagePin(damageDetails)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={saveDamageMapPin(damageDetails)}
                    >
                      Save
                    </Button>
                  </Grid>
                </Drawer>
              </React.Fragment>
            );
          })}
      </div>
      {damageMapPicture && (
        <Fab
          size="large"
          className={classes.fab}
          color="primary"
          aria-label="upload"
          variant="extended"
          onClick={handleUploadSavedPins}
        >
          <SaveIcon />
          SAVE PINS
        </Fab>
      )}
    </>
  );
};

export default compose(withStyles(DamageMapStyles, { withTheme: true }))(
  PinCreator
);
