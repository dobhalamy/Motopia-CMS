/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { useToasts } from 'react-toast-notifications';
import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import { RdsImageRoutes, RideShareRoutes } from 'client';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';
import { Button, Grid } from '@material-ui/core';
import RideShareHomeForm from 'components/RideShareHomeForm/RideShareHomeForm';
import BasicModal from 'components/BasicModal/BasicModal';
import { ViewSeo } from 'components/SeoSection/ViewSeo';

const RideShareHome = () => {
  const [rdsData, setRdsData] = React.useState({
    data: [],
    file: '',
  });
  const [financeSeo, setFinaceSeo] = React.useState();
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [deleteRdsData, setDeleteRdsData] = React.useState(null);

  const { addToast } = useToasts();

  const tableColumns = [
    {
      title: 'Title',
      field: 'title',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          maxRows="5"
          value={props.rowData.title}
          inputProps={{ maxLength: 70 }}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Visible',
      field: 'visible',
      cellStyle: {
        maxWidth: 30,
        padding: 10,
        margin: 10,
      },
      headerStyle: {
        padding: 10,
        margin: 10,
        maxWidth: 30,
      },
      editComponent: props => (
        <Switch
          checked={props.rowData.visible}
          onChange={event => {
            props.onChange(event.target.checked, props.rowData);
          }}
          value={props.rowData.visible}
        />
      ),
      render: rowData => <Switch checked={rowData.visible} value={rowData.visible} />,
    },
    {
      title: 'Image',
      field: 'img',
      render: rowData => (
        <div
          style={{
            width: 150,
            height: 150,
            backgroundImage: rowData.img.src ? `url(${rowData.img.src})` : 'transparent',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ),
      editComponent: props => (
        <CloudinaryUploadWidget
          folder="home-images"
          cropping
          croppingAspectRatio={16 / 4.98}
          preview={{ width: 150, height: 150, bg: props.rowData.img.src }}
          onUpload={file => {
            props.onChange(file, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Mobile Image',
      field: 'mobileImg',
      render: rowData => (
        <div
          style={{
            width: 150,
            height: 150,
            backgroundImage: rowData.mobileImg.mobileSrc ? `url(${rowData.mobileImg.mobileSrc})` : 'transparent',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ),
      editComponent: props => (
        <CloudinaryUploadWidget
          folder="home-images"
          isMobile
          cropping
          croppingAspectRatio={1}
          preview={{ width: 150, height: 150, bg: props.rowData.mobileImg.mobileSrc }}
          onUpload={file => {
            props.onChange(file, props.rowData);
          }}
        />
      ),
    },
  ];

  const loadSeo = React.useCallback(async () => {
    try {
      const response = await RideShareRoutes.getHomeRideShare();
      const filteredData = response.data.find(item => item.cityName.toLowerCase() === 'ride share home');
      setFinaceSeo(filteredData);
    } catch (err) {
      const message = err.message || err;
      addToast(message, { severity: 'info' });
    }
  }, [addToast]);

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
  const loadRdsData = React.useCallback(async () => {
    try {
      const response = await RdsImageRoutes.getrdsHomeList();
      setRdsData(pre => ({
        ...pre,
        data: response.data,
      }));
    } catch (err) {
      const message = err.response.data.message || err.response.message || err.message || err;
      addToast(message, { severity: 'info' });
    }
  }, [addToast]);

  const handleDeleteRdsData = React.useCallback(async () => {
    if ('_id' in deleteRdsData) {
      try {
        const response = await RdsImageRoutes.deleteRdsHomeData(deleteRdsData._id);
        if (response && response.status === 'success') {
          addToast('Data deleted successfully');
          loadRdsData();
          setDeleteRdsData(null);
        }
      } catch (error) {
        addToast(error.message);
      }
    }
  }, [addToast, deleteRdsData, loadRdsData]);

  React.useEffect(() => {
    loadRdsData();
  }, [loadRdsData]);
  React.useEffect(() => {
    loadSeo();
  }, [loadSeo]);

  const handleChangeRow = async (newData, oldData) => {
    try {
      await RdsImageRoutes.updateRdsHomeData(newData);
    } catch (err) {
      const message = (err.response && err.response.data && err.response.data.message) || err.message;
      addToast(message, { severity: 'error' });
    }
    loadRdsData();
  };

  return (
    <>
      <GridContainer>
        {showCreateForm ? (
          <RideShareHomeForm setShowCreateForm={setShowCreateForm} loadRdsData={loadRdsData} />
        ) : (
          <GridItem xs={12} sm={12} md={12}>
            <Button
              onClick={() => {
                setShowCreateForm(true);
              }}
              variant="contained"
              style={{ marginBottom: '1rem' }}
            >
              Add new Data
            </Button>
            <MaterialTable
              title="Ride Share Home"
              columns={tableColumns}
              data={rdsData.data}
              editable={{
                onRowUpdate: handleChangeRow,
              }}
              actions={[
                {
                  icon: 'delete',
                  tooltip: 'Delete RDS data',
                  onClick: (event, rowData) => {
                    setDeleteRdsData(rowData);
                  },
                },
              ]}
            />
          </GridItem>
        )}
        <BasicModal
          title="Are you want to delete the ride share data?"
          body="Are you sure you want to delete?"
          handleCancel={() => {
            setDeleteRdsData(null);
          }}
          handleAgree={handleDeleteRdsData}
          showModal={deleteRdsData ? true : false}
        />
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
};

RideShareHome.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  rowData: PropTypes.object,
};

RideShareHome.defaultProps = {
  value: '',
};

export default RideShareHome;
