import React, { createRef, useState, useEffect } from 'react';
import {
  Button,
  Drawer,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Close as CloseIcon } from '@material-ui/icons';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { DamageMapStyles } from './DamageMap';
import { DAMAGE_MAP_TYPES } from './constants';
import { removeHotSpot } from 'react-pannellum';

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

const PinDrawer = props => {
  const { classes, isOpen, onClose, handleCreatePin, features = [], installedFeatures = [], updatingHotspot, hotspotPictures, handleDeleteHotspot } = props;
  const damageMapTitleInput = createRef();
  const damageMapDescriptionInput = createRef();
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [selectedPicture, setPicture] = useState(null);
  const [state, setState] = useState({
    type: 'FEATURE',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (!updatingHotspot) {
      return;
    }
    const { title, type, description } = updatingHotspot;
    setState({ title, type, description });
    if (updatingHotspot.picture) {
      setPicture(updatingHotspot.picture);
    }
  }, [updatingHotspot]);

  const onChangePinType = ({ target: { value } }) => {
    const defaultFeature = features[0];
    const defaultInstalledFeature = installedFeatures[0];
    const update = { type: value };
    switch (value) {
      case 'FEATURE':
        update.title = defaultFeature.featureName;
        update.description = defaultFeature.featureDesc;
        break;
      case 'INSTALLED FEATURE':
        update.title = defaultInstalledFeature.featureName;
        update.description = defaultInstalledFeature.featureDesc;
        break;
      default:
        update.title = '';
        update.description = '';
        break;
    }
    setState({
      ...state,
      ...update,
    });
  };

  const onChangeTextArea = field => e => {
    e.persist();
    setState({
      ...state,
      [field]: e.target.value,
    });
  };

  const isTitleAndDescriptionValid = () => {
    const { title, description, type } = state;
    const noTitle = title.trim() === '';
    const noDescription = description.trim() === '';
    if (type === 'DAMAGE' && (noTitle || noDescription)) {
      setTitleError(noTitle ? 'Please enter title' : '');
      setDescriptionError(noDescription ? 'Please enter description' : '');
      return false;
    }
    return true;
  };

  const onSavePin = isDelete => () => {
    if (isDelete) {
      if (updatingHotspot) {
        handleDeleteHotspot(updatingHotspot.id);
      }
      setPicture(null);
      return handleCreatePin(false);
    }

    if (!isTitleAndDescriptionValid()) {
      return;
    } else {
      const newHotspot = { ...state, picture: selectedPicture };
      if (updatingHotspot) {
        removeHotSpot(updatingHotspot.id);
      }
      const defaultFeature = features[0];
      setState({
        type: 'FEATURE',
        title: defaultFeature.featureName,
        description: defaultFeature.featureDesc,
      });
      setPicture(null);
      return handleCreatePin(newHotspot);
    }
  };

  const onChangeFeature = ({ target: { value } }) => {
    const selectedFeature = state.type === 'FEATURE' ? features.find(feature => feature.featureId === value) : installedFeatures.find(feature => feature.featureId === value);
    setState({
      ...state,
      title: selectedFeature.featureName,
      description: selectedFeature.featureDesc,
    });
  };
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Grid container justify="flex-end">
        <CloseIcon classes={{ root: classes.damageDialogCloseIcon }} onClick={onClose} />
      </Grid>
      <Grid container direction="column">
        <InputLabel id="damage-map-type-select">Type</InputLabel>
        <Select labelid="damage-map-type-select" id="damage-map-select" value={state.type} onChange={onChangePinType} fullWidth>
          {DAMAGE_MAP_TYPES.map(type =>
            type === 'INSTALLED FEATURE' && installedFeatures.length === 0 ? null : (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            )
          )}
        </Select>
        {state.type === 'DAMAGE' && (
          <>
            <Grid container>
              <TextareaAutosize
                className={classes.damageDialogWriteTextarea}
                aria-label="empty damage title"
                placeholder="Add title"
                defaultValue={state && state.title}
                onChange={onChangeTextArea('title')}
                ref={damageMapTitleInput}
              />
              {!!titleError && (
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
                defaultValue={state && state.description}
                onChange={onChangeTextArea('description')}
                ref={damageMapDescriptionInput}
              />
              {!!descriptionError && (
                <Typography variant="caption" color="error">
                  {descriptionError}
                </Typography>
              )}
            </Grid>
          </>
        )}
        {(state.type === 'FEATURE' || state.type === 'INSTALLED FEATURE') && (
          <Grid container>
            <Grid container className={classes.pinFeatureSelector}>
              <InputLabel id="damage-map-feature-select">Title</InputLabel>
              <Select labelid="damage-map-feature-select" id="damage-map-feature" value={state.title} renderValue={value => value} onChange={onChangeFeature} fullWidth>
                {state.type === 'FEATURE' &&
                  features.map(item => (
                    <MenuItem key={item.featureId} value={item.featureId}>
                      {item.featureName}
                    </MenuItem>
                  ))}
                {state.type === 'INSTALLED FEATURE' &&
                  installedFeatures.map(item => (
                    <MenuItem key={item.featureId} value={item.featureId}>
                      {item.featureName}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
            <Grid container direction="column">
              {renderFeatureDescription(state.description)}
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
                    <IconButton className={classes.icon} onClickCapture={() => setPicture(null)}>
                      <CheckCircleIcon />
                    </IconButton>
                  ) : (
                    <IconButton className={classes.icon} onClickCapture={() => setPicture(pic)}>
                      <RadioButtonUncheckedIcon />
                    </IconButton>
                  )
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      <Grid style={{ width: '100%', marginTop: 12 }} container justify="space-between">
        <Button variant="contained" color="secondary" onClick={updatingHotspot ? onSavePin(true) : onClose}>
          {updatingHotspot ? 'Delete' : 'Close'}
        </Button>
        <Button variant="contained" color="secondary" onClick={onSavePin(false)}>
          {updatingHotspot ? 'Update' : 'Save'}
        </Button>
      </Grid>
    </Drawer>
  );
};

export default compose(withStyles(DamageMapStyles, { withTheme: true }))(PinDrawer);
