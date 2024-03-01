import React, { useCallback, useEffect, useState } from 'react';
import uuid from 'uuid';

import { makeStyles } from '@material-ui/core/styles';
import { useToasts } from 'react-toast-notifications';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import BodyTypeCardEditDialog from 'components/BodyType/BodyTypeCardEditDialog';
import { BodyTypeRoutes } from 'client';
import MaterialTable from 'material-table';
import { CircularProgress, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cardWrapper: {
    width: 250,
    minHeight: 320,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
    margin: 16,
    position: 'relative',
  },
  cardList: {
    overflowY: 'auto',
    maxHeight: 200,
  },
  cardTitle: {
    padding: '16px 0px',
    borderBottom: '1px solid #001C5E',
  },
  cardViewAllLink: {
    borderTop: '1px solid #001C5E',
    paddingTop: 16,
  },
  addFloatingButton: {
    position: 'fixed',
    right: 24,
    bottom: 24,
  },
  linkStyle: {
    color: '#001C5E',
  },
  bodyTypeHeading: {
    marginBottom: 16,
  },
  inventoryTable: {
    width: '80.5%',
    [theme.breakpoints.up('1500')]: {
      width: '95%',
    },
    [theme.breakpoints.between('1200', '1300')]: {
      width: '93%',
    },
    [theme.breakpoints.between('400', '500')]: {
      width: '83%',
    },
    [theme.breakpoints.between('500', '600')]: {
      width: '65%',
    },
    [theme.breakpoints.between('800', '900')]: {
      width: '80%',
    },
    [theme.breakpoints.between('900', '1000')]: {
      width: '70%',
    },
    [theme.breakpoints.between('1000', '1230')]: {
      width: '66%',
    },
  },
}));

const BodyTypeCards = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [state, setState] = useState({
    cardList: [],
    editMode: false,
    editModeCard: null,
    updatedSuccessfully: false,
    uploadingStatus: null,
    availableValues: [],
  });
  const [inventoryData, setInventoryData] = useState([]);

  const tableColumns = [
    {
      title: 'Inventory threshold count',
      field: 'inventoryThreshold',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          maxRows="4"
          value={props.rowData.inventoryThreshold}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Notification email',
      field: 'notificationEmail',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          maxRows="4"
          value={props.rowData.notificationEmail}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
  ];

  const getInventoryData = useCallback(async () => {
    const res = await BodyTypeRoutes.getInventoryThreshold();
    if (res.status === 'success' && res.data) {
      setInventoryData(() => res.data);
    }
  }, []);

  useEffect(
    () => {
      async function getAllCards() {
        try {
          const response = await BodyTypeRoutes.getAll();
          const secondResponse = await BodyTypeRoutes.getAvailable();
          setState({
            ...state,
            availableValues: secondResponse.data,
            cardList: response.data
              .map(cardData => ({
                ...cardData,
                id: cardData._id,
              }))
              .sort((prev, curr) => (prev.position > curr.position ? 1 : -1)),
          });
        } catch (error) {
          alert(`Error ocurred ${error.message}`);
          setState({ ...state, uploadingStatus: error });
        }
      }
      getAllCards();
      getInventoryData();
    },
    //eslint-disable-next-line
    []
  );

  const handleUpdateCards = async () => {
    const array = [...state.cardList];
    const response = await BodyTypeRoutes.update(
      array.map(cardData => {
        delete cardData.id;
        return cardData;
      })
    );
    setState({
      ...state,
      uploadingStatus: response,
      cardList: response.data
        .map(cardData => ({
          ...cardData,
          id: cardData._id,
        }))
        .sort((prev, curr) => (prev.position > curr.position ? 1 : -1)),
    });
    addToast('Success!');
  };

  const handleAddNewCard = () =>
    setState({
      ...state,
      cardList: state.cardList.concat({
        id: uuid(),
        carBody: `Title ${state.cardList.length + 1}`,
        dmsBodyValues: [],
      }),
    });

  const handleDeleteCard = card => {
    const { id, dmsBodyValues } = card;
    setState({
      ...state,
      availableValues: [...state.availableValues, ...dmsBodyValues],
      cardList: state.cardList.filter(list => id !== list.id),
    });
  };

  const handleEditCard = cardId => {
    setState({
      ...state,
      editModeCard: Object.assign({}, ...state.cardList.filter(card => card.id === cardId)),
      editMode: true,
    });
  };

  const handleCloseEditDialog = (card, available) =>
    setState({
      ...state,
      editMode: false,
      editModeCard: null,
      availableValues: available,
      cardList: state.cardList.map(type => (type.id === card.id ? { ...card } : type)),
    });

  const handleEditInventoryThreshold = useCallback(async newData => {
    try {
      const res = await BodyTypeRoutes.setInventoryThreshold(newData);
      if (res.status === 'success' && res.data) {
        setInventoryData(() => [res.data]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Grid className={classes.mainWrapper} container direction="column">
      <Grid container alignItems="center" className={classes.bodyTypeHeading}>
        <Typography align="center" variant="h5">
          Click plus to add new body type cards
        </Typography>
        <Button style={{ marginLeft: 16 }} onClick={handleUpdateCards} variant="outlined" color="primary">
          Update cards
        </Button>
        <Fab size="large" className={classes.addFloatingButton} color="primary" aria-label="add" onClick={handleAddNewCard}>
          <AddIcon />
        </Fab>
      </Grid>
      <Grid item className={classes.inventoryTable}>
        <MaterialTable
          style={{ marginLeft: '1rem' }}
          title="Inventory count"
          columns={tableColumns}
          data={inventoryData}
          editable={{
            onRowUpdate: handleEditInventoryThreshold,
          }}
          options={{
            paging: false,
            pageSize: 1,
            search: false,
            actionsColumnIndex: -1,
          }}
        />
      </Grid>
      {state.cardList.length < 1 ? (
        <Grid container justifyContent="center" spacing={0} direction="column" alignItems="center" style={{ minHeight: '50vh' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container>
          {state.cardList.length > 0 &&
            state.cardList.map(cardData => (
              <Paper className={classes.cardWrapper} key={cardData.id}>
                <Grid item container>
                  <Grid item container justifyContent="space-between" alignItems="center">
                    <IconButton onClick={() => handleEditCard(cardData.id)}>
                      <EditIcon />
                    </IconButton>
                    <Grid item>
                      <Typography variant="subtitle2">Ad campaign: {cardData.isCampaignActive ? 'ON' : 'OFF'}</Typography>
                      <Typography variant="subtitle2">Inventory count: {cardData.carCount || 0}</Typography>
                    </Grid>
                    <IconButton onClick={() => handleDeleteCard(cardData)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid className={classes.cardTitle} container alignItems="center">
                    <Grid>
                      <Typography variant="h6">{cardData.carBody ? `Displayed name: ${cardData.carBody}` : 'No Title'}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container className={classes.cardList}>
                    {cardData.dmsBodyValues.length > 0 ? (
                      cardData.dmsBodyValues.map(value => (
                        <ListItem key={value} role={undefined} dense divider>
                          <Typography variant="body2">{value}</Typography>
                        </ListItem>
                      ))
                    ) : (
                      <Typography align="center" variant="body1">
                        No records
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}
        </Grid>
      )}
      {state.editMode && <BodyTypeCardEditDialog isOpen={state.editMode} cardData={state.editModeCard} availableValues={state.availableValues} handleCloseEditDialog={handleCloseEditDialog} />}
    </Grid>
  );
};

export default BodyTypeCards;
