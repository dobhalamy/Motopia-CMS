/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import MaterialTable from 'material-table';

import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { useToasts } from 'react-toast-notifications';

import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';

import { WarrantyRoutes } from 'client';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';

const WarrantyImage = () => {
  const { addToast } = useToasts();
  const tableColumns = [
    {
      title: 'Title',
      field: 'title',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="4"
          value={props.rowData.title}
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
            width: '100%',
            height: 150,
            backgroundImage: `url(${rowData.src})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ),
      editComponent: props => (
        <CloudinaryUploadWidget
          folder="warranty-images"
          cropping
          croppingAspectRatio={16 / 2.64}
          preview={{ width: '100%', height: 150, bg: props.rowData.src }}
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
            width: '100%',
            height: 150,
            backgroundImage: `url(${rowData.mobileImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ),
      editComponent: props => (
        <CloudinaryUploadWidget
          folder="warranty-images"
          isMobile
          cropping
          croppingAspectRatio={61.4 / 16}
          preview={{ width: '100%', height: 150, bg: props.rowData.mobileImg }}
          onUpload={file => {
            props.onChange(file, props.rowData);
          }}
        />
      ),
    },
  ];

  const [state, setState] = React.useState({
    data: [],
    file: '',
  });

  const loadWarrantyImages = async () => {
    try {
      const response = await WarrantyRoutes.getWarranty();
      console.clear();
      console.info(response);
      // NOTE: instead new route in API we separate banners via positions numbers
      setState({
        ...state,
        data: response.data,
      });
    } catch (err) {
      const message = err.response.data.message || err.response.message || err.message || err;
      addToast(message, { severity: 'info' });
    }
  };

  React.useEffect(() => {
    loadWarrantyImages();
    // eslint-disable-next-line
  }, []);

  const handleChangeBanner = async newData => {
    try {
      await WarrantyRoutes.updateWarranty(newData);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    loadWarrantyImages();
  };

  // eslint-disable-next-line
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <MaterialTable
          title="Warranty Images"
          columns={tableColumns}
          data={state.data}
          editable={{
            onRowUpdate: (newData, oldData) => handleChangeBanner(newData, oldData),
          }}
        />
      </GridItem>
    </GridContainer>
  );
};

WarrantyImage.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  rowData: PropTypes.object.isRequired,
};

WarrantyImage.defaultProps = {
  value: '',
};

export default WarrantyImage;
