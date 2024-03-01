import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { listOfVehiclesSelector } from 'redux/selectors';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ErrorIcon from '@material-ui/icons/Error';
import MaterialTable from 'material-table';
import SyncIcon from '@material-ui/icons/Sync';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import { VehicleRoutes } from 'client';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Typography from '@material-ui/core/Typography';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { makeStyles } from '@material-ui/core/styles';
import dateFormat from 'dateformat';
import VehicleDetails from './VehicleDetails';
import { Skeleton } from '@material-ui/lab';
import { BASE_URL } from 'client/api';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
      float: 'right',
      zIndex: 23,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  VehicleCountClass: {
    display: 'inline-block',
    fontSize: 20,
    fontWeight: 500,
    padding: 5,
  },
  searchBarTextField: {
    float: 'right',
    zIndex: 25,
  },
  searchIc: {
    float: 'right',
    zIndex: 25,
    cursor: 'pointer',
  },
  ExportIc: {
    cursor: 'pointer',
    zIndex: 25,
    float: 'right',
    fontSize: 15,
    display: 'flex',
    border: 'none',
  },
}));

const renderPicture = vehicleData => {
  try {
    const vehicleImageArray = vehicleData.picturesUrl.sort(
      (a, b) => a.name.split('.')[0].split('_')[a.name.split('.')[0].split('_').length - 1] - b.name.split('.')[0].split('_')[b.name.split('.')[0].split('_').length - 1]
    );
    return (
      <img
        src={vehicleImageArray[0].picture}
        style={{
          height: 100,
          width: 140,
        }}
        alt="vehicle preview"
      />
    );
  } catch (error) {
    return <p>No picture available</p>;
  }
};
const renderCheckBox = (isCheck, clicked) => {
  return <Checkbox checked={isCheck.active} disabled={clicked} color="default" style={{ justifyContent: 'center' }} inputProps={{ 'aria-label': 'checkbox with default color' }} />;
};

const renderDateTime = data => {
  const newDate = new Date(data);
  const purchaseDate = new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60000);
  return dateFormat(purchaseDate, 'mm/ dd/ yy');
};
export default connect(
  createStructuredSelector({
    listOfVehicles: listOfVehiclesSelector,
  })
)(function CarsList() {
  const classes = useStyles();
  const history = useHistory();
  const CarListPage = [20, 50, 100, 200];
  const tableRef = createRef();
  const { addToast } = useToasts();
  const [clicked, setClicked] = useState(false);
  const [CurrentPage, setCurrentPage] = useState(0);
  const [sortCheck, setSortCheck] = useState(true);
  const [isStreamOpen, setStream] = useState(false);
  const [state, setState] = useState({
    isLoading: false,
    columns: [
      { title: 'ID', field: 'stockid' },
      { title: 'Year', field: 'carYear' },
      { title: 'Make', field: 'make' },
      { title: 'Model', field: 'model' },
      { title: 'Series', field: 'series' },
      { title: 'Mileage', field: 'mileage' },
      {
        title: 'Purchase Date',
        field: 'purchaseDate',
        render: data => renderDateTime(data.purchaseDate),

        type: 'date',
      },
      {
        title: 'Mark For Deletion',
        field: 'markForDeletion',
        render: data => (
          <div>
            {renderDateTime(data.markForDeletion ?? data.purchaseDate)}
            {data.markForDeletion != null && <ErrorIcon style={{ fill: 'red' }} />}
          </div>
        ),
        type: 'date',
      },
      { title: 'Price', field: 'listPrice' },
      {
        title: 'Picture',
        field: 'picturesUrl',
        render: data => renderPicture(data),
      },
    ],
    listOfVehicles: [],
    totalCount: 0,
    UpdatedCount: 0,
    feVehicleCount: 0,
    searchInputValue: '',
    lastUpdated: {
      isInProgress: false,
      lastRunAt: '-',
      lastFinishedAt: '-',
      nextRunAt: '-',
    },
  });

  const handleCheck = async data => {
    setState({ ...state, isLoading: true });
    let isCheck = null;
    if (clicked === true) {
      return;
    }
    setClicked(true);

    if (data && data.active === true) {
      isCheck = false;
    } else {
      isCheck = true;
    }
    try {
      await VehicleRoutes.updateVehicleById(data._id, {
        ...data,
        active: isCheck,
      }).then(resData => {
        setClicked(false);
        setState({
          ...state,
          listOfVehicles: state.listOfVehicles.map(vehicleData => (vehicleData._id === resData.data._id ? { ...resData.data } : vehicleData)),
          feVehicleCount: resData.FeVehiclesCount,
          isLoading: false,
        });
      });
    } catch (error) {
      setClicked(false);
      addToast(error.status, { severity: 'error' });
    }
  };

  const sortCheckList = async () => {
    setSortCheck(!sortCheck);
    setState({ ...state, isLoading: true });
    let sortedParams = {
      orderCol: 'active',
      orderDirec: sortCheck === true ? 1 : -1,
    };
    try {
      window.sessionStorage.setItem('PageSize', 20);
      window.sessionStorage.setItem('PageDefault', 0);
      window.sessionStorage.setItem('orderCol', sortedParams.orderCol);
      window.sessionStorage.setItem('orderDirec', sortedParams.orderDirec);
      const searchValue = window.sessionStorage.getItem('searchVal');
      const params = {
        orderCol: sortedParams.orderCol,
        orderDirec: sortedParams.orderDirec,
        pageSize: 20,
        page: 0,
      };
      if (Boolean(searchValue)) {
        params.querySearch = searchValue;
      }
      const response = await VehicleRoutes.getVehicles(params);
      setState({
        ...state,
        isLoading: false,
        listOfVehicles: [...response.data],
      });
      setCurrentPage(0);
    } catch (err) {
      addToast(err.status, { severity: 'error' });
    }
  };

  useEffect(() => {
    vehicleWithLayer();
    // eslint-disable-next-line
  }, [state.listOfVehicles]);

  useEffect(() => {
    const source = new EventSource(`${BASE_URL}vehicles/update-all`);
    if (isStreamOpen) {
      source.addEventListener('message', async e => {
        const isSyncInProgress = JSON.parse(e.data);
        if (!isSyncInProgress) {
          await loadVehicle();
          setStream(isSyncInProgress);
        }
      });
      source.addEventListener('error', e => {
        console.error('Error: ', e);
      });
    } else {
      source.close();
    }

    return () => {
      source.close();
    };

    // eslint-disable-next-line
  }, [isStreamOpen]);

  const loadVehicle = async (page, pageSize, force = false) => {
    setState({ ...state, isLoading: true });
    try {
      let defaultVal = window.sessionStorage.getItem('searchVal');
      const params = {
        orderCol: window.sessionStorage.getItem('orderCol'),
        orderDirec: window.sessionStorage.getItem('orderDirec'),
        querySearch: defaultVal === null ? '' : defaultVal,
        page,
        pageSize: pageSize || 50,
      };
      if (force) {
        params.timeStamp = new Date().getTime();
      }
      const response = await VehicleRoutes.getVehicles(params);
      const newState = {
        ...state,
        isLoading: false,
        listOfVehicles: [...response.data],
        totalCount: response.totalResults.VehiclesCount,
        UpdatedCount: response.totalResults.UpdatedCount,
        feVehicleCount: response.totalResults.FeVehiclesCount,
        lastUpdated: {
          ...response.lastUpdated,
          isInProgress: (response.lastUpdated && response.lastUpdated.isInProgress) || false,
        },
      };
      setState(newState);
      if (response.lastUpdated && response.lastUpdated.isInProgress) {
        setStream(true);
      }
      setCurrentPage(page);
      return newState;
    } catch (err) {
      addToast(err.status, { severity: 'error' });
    }
  };

  const Icon = () => {
    const updateList = async () => {
      addToast('Process is running', { autoDismissTimeout: 1000 });
      setState({ ...state, isLoading: true });
      try {
        VehicleRoutes.updateVehicles();
        addToast('Sync with DMS is started manually. This process will take approximately 3 minutes.', {
          autoDismissTimeout: 10000,
          severity: 'info',
        });
        await loadVehicle();
      } catch (error) {
        console.error(error);
        addToast('Fail! Try again in 2 minutes', { severity: 'error' });
      }
    };

    return <SyncIcon onClick={updateList} />;
  };

  const vehicleWithLayer = () => {
    let hasLayer = 0;
    if (state.listOfVehicles.length > 0) {
      let listOfVehicles = [];
      listOfVehicles = state.listOfVehicles;
      let i = 0;
      for (i; i < listOfVehicles.length; i += 1) {
        if (listOfVehicles[i].vehiclePinCount != null) {
          if (listOfVehicles[i].vehiclePinCount.damageCount > 0) {
            hasLayer = hasLayer + 1;
          } else if (listOfVehicles[i].vehiclePinCount.featureCount > 0) {
            hasLayer = hasLayer + 1;
          } else if (listOfVehicles[i].vehiclePinCount.instFeatureCount > 0) {
            hasLayer = hasLayer + 1;
          }
        }
      }
      return hasLayer;
    } else {
      return hasLayer;
    }
  };

  const handleKeyPress = async event => {
    if (event.key === 'Enter') {
      const scopedRef = tableRef.current;
      sendSearchQuery().then(() => scopedRef.onQueryChange());
    }
  };

  const sendSearchQuery = async () => {
    setState({ ...state, isLoading: true });
    try {
      window.sessionStorage.setItem('PageSize', 20);
      window.sessionStorage.setItem('PageDefault', 0);
      window.sessionStorage.removeItem('orderCol', 'orderDirec');
      const params = {
        querySearch: window.sessionStorage.getItem('searchVal'),
        pageSize: 20,
        page: 0,
      };
      const response = await VehicleRoutes.getVehicles(params);
      setState({
        ...state,
        isLoading: false,
        listOfVehicles: [...response.data],
        UpdatedCount: response.totalResults.UpdatedCount,
      });
      setCurrentPage(0);
    } catch (err) {
      addToast(err.status, { severity: 'error' });
    }
  };

  const handleSearchInput = async event => {
    let searchVal = event.target.value;
    window.sessionStorage.setItem('searchVal', searchVal);
  };

  const openNewTab = data => {
    window.open('/admin/vehicle?id=' + data, '_blank');
  };

  let defaultSearchValue = window.sessionStorage.getItem('searchVal');
  const sortData = async (orderBy, orderDirection) => {
    const notOrderBy = [11, 12, 13, 15];
    console.log(orderBy);
    console.log(orderDirection);
    if (!notOrderBy.includes(orderBy)) {
      let sortedParams = switchData(orderBy, orderDirection);
      setState({ ...state, isLoading: true });
      try {
        window.sessionStorage.setItem('PageSize', 20);
        window.sessionStorage.setItem('PageDefault', 0);
        window.sessionStorage.setItem('orderCol', sortedParams.orderCol);
        window.sessionStorage.setItem('orderDirec', sortedParams.orderDirec);
        const params = {
          orderCol: sortedParams.orderCol,
          orderDirec: sortedParams.orderDirec,
          querySearch: window.sessionStorage.getItem('searchVal'),
          pageSize: 20,
          page: 0,
        };
        const response = await VehicleRoutes.getVehicles(params);
        setState({
          ...state,
          isLoading: false,
          listOfVehicles: [...response.data],
          UpdatedCount: response.totalResults.UpdatedCount,
        });
        setCurrentPage(0);
      } catch (err) {
        addToast(err.status, { severity: 'error' });
      }
    }
  };

  const switchData = (orderBy, orderDirection) => {
    const orderDirec = orderDirection === 'asc' ? 1 : -1;
    if (orderBy) {
      return {
        orderCol: state.columns[orderBy].field,
        orderDirec,
      };
    }
    return {
      orderCol: 'purchaseDate',
      orderDirec: -1,
    };
  };

  const exportData = async () => {
    try {
      const response = await VehicleRoutes.exportInventory();
      addToast(response.message);
    } catch (err) {
      addToast(err.status, { severity: 'error' });
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Typography component="div" className={classes.VehicleCountClass}>
          Total Vehicles: {state.totalCount}
          <span style={{ padding: '30px' }}>Vehicles on FE: {state.feVehicleCount}</span>
        </Typography>
        <button className={classes.ExportIc} display="Export CMS Data" onClick={() => exportData()} title="Export Vehicle List">
          <ImportExportIcon />
        </button>
        <Tooltip title="Search">
          <SearchIcon
            className={classes.searchIc}
            onClick={() => {
              const scopedRef = tableRef.current;
              sendSearchQuery().then(() => scopedRef.onQueryChange());
            }}
          />
        </Tooltip>
        <TextField onKeyPress={handleKeyPress} className={classes.searchBarTextField} defaultValue={defaultSearchValue} onChange={handleSearchInput} placeholder="Search" />
        <MaterialTable
          isLoading={state.isLoading}
          title={
            <Typography
              variant="h6"
              style={{
                overflow: 'visible',
              }}
            >
              Vehicle list
            </Typography>
          }
          columns={state.columns}
          tableRef={tableRef}
          data={async query => {
            return await new Promise(async resolve => {
              const result = await loadVehicle(query.page, query.pageSize, query.force || false);
              resolve({
                data: result.listOfVehicles,
                page: CurrentPage,
                totalCount: result.UpdatedCount,
              });
            });
          }}
          onOrderChange={(orderBy, orderDirection) => {
            const scopedRef = tableRef.current;
            sortData(orderBy, orderDirection).then(() => scopedRef.onQueryChange());
          }}
          onRowClick={(event, vehicle) => history.push(`/admin/vehicle?id=${vehicle.stockid}`)}
          onChangeRowsPerPage={pageSize => {
            window.sessionStorage.setItem('PageSize', pageSize);
          }}
          options={{
            pageSize: Number(window.sessionStorage.getItem('PageSize')) || 20,
            pageSizeOptions: CarListPage,
            search: false,
            tableLayout: 'auto',
            padding: 'dense',
          }}
          actions={[
            {
              icon: () => <Typography color="primary">Last sync start: {state.lastUpdated.lastRunAt}</Typography>,
              disabled: true,
              isFreeAction: true,
            },
            {
              icon: () => (
                <Typography color="primary">
                  Last sync finish: {state.lastUpdated.isInProgress ? <Skeleton animation="wave" width={260} style={{ display: 'inline-flex' }} /> : state.lastUpdated.lastFinishedAt}
                </Typography>
              ),
              disabled: true,
              isFreeAction: true,
            },
            {
              icon: () => <Typography color="primary">Next sync: {state.lastUpdated.nextRunAt}</Typography>,
              disabled: true,
              isFreeAction: true,
            },
            {
              icon: () => <Icon />,
              isFreeAction: true,
              tooltip: state.lastUpdated.isInProgress ? 'Sync in progress' : 'Refersh vehicle list',
              disabled: state.lastUpdated.isInProgress,
            },
            rowData => ({
              icon: () => <OpenInNewIcon />,
              tooltip: 'Open stock in new tab',
              onClick: (event, rowData) => openNewTab(rowData.stockid),
            }),
            rowData => ({
              icon: () => renderCheckBox(rowData, clicked),
              onClick: async (event, rowData) => {
                const scopedRef = tableRef.current;
                await handleCheck(rowData, rowData._id).then(() => scopedRef.onQueryChange({ force: true }));
              },
            }),
          ]}
          localization={{
            header: {
              actions: (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    flexDirection: 'inherit',
                    justifyContent: 'flex-start',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const scopedRef = tableRef.current;
                    sortCheckList().then(() => scopedRef.onQueryChange());
                  }}
                >
                  <div>Show on FE </div>
                </span>
              ),
            },
          }}
          detailPanel={rowData => {
            return <VehicleDetails {...rowData} />;
          }}
        />
      </GridItem>
    </GridContainer>
  );
});
