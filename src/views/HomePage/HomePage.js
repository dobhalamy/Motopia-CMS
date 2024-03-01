/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { useToasts } from 'react-toast-notifications';

import TextField from '@material-ui/core/TextField';
// NOTE: uncomment when we need local URL's
// import InputAdornment from "@material-ui/core/InputAdornment";

import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';
import Switch from '@material-ui/core/Switch';

import { PromoRoutes } from 'client';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';
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
    title: 'Text',
    field: 'text',
    editComponent: props => (
      <TextField
        fullWidth
        multiline
        rowsMax="4"
        value={props.rowData.text}
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
      maxWidth: 50,
      padding: 25,
      margin: 10,
    },
    headerStyle: {
      padding: 30,
      margin: 10,
      maxWidth: 50,
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
  { title: 'Link Text', field: 'linkText' },
  {
    title: 'Link Path',
    field: 'linkPath',
    cellStyle: {
      padding: 0,
      margin: 10,
      minWidth: 150,
    },
    headerStyle: {
      padding: 0,
      margin: 10,
      minWidth: 150,
    },
    editComponent: props => (
      <TextField
        value={props.rowData.linkPath}
        fullWidth
        multiline
        // NOTE: uncomment when we need local URL's
        // InputProps={{
        //   startAdornment: (
        //     <InputAdornment style={{ fontSize: 12 }} position="start">
        //       motopia.com
        //     </InputAdornment>
        //   )
        // }}
        placeholder="/about"
        onChange={event => {
          props.onChange(
            // NOTE: uncomment when we do not need whole URL
            //event.target.value.split(".com").pop(),
            event.target.value,
            props.rowData
          );
        }}
      />
    ),
  },
  { title: 'Link Color', field: 'linkColor' },
  { title: 'Background Color', field: 'background' },
  { title: 'Text Color', field: 'textColor' },
  {
    title: 'Image',
    field: 'img',
    render: rowData => (
      <div
        style={{
          width: 150,
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
        folder="promo"
        cropping
        croppingAspectRatio={16 / 10}
        preview={{ width: 150, height: 150, bg: props.rowData.src }}
        onUpload={file => {
          props.onChange(file, props.rowData);
        }}
      />
    ),
  },
];
export default function HomePageBanners() {
  const { addToast } = useToasts();

  const [state, setState] = React.useState({
    data: [],
    file: '',
  });

  const loadBanners = async () => {
    try {
      const response = await PromoRoutes.getPromo();
      setState({
        ...state,
        data: response.data,
      });
    } catch (err) {
      alert(err);
    }
  };

  React.useEffect(() => {
    loadBanners();
    // eslint-disable-next-line
  }, []);

  const handleChangeBanner = async newData => {
    try {
      await PromoRoutes.updatePromo(newData);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    loadBanners();
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <MaterialTable
          title="Home Page Promo Banners"
          columns={tableColumns}
          data={state.data}
          editable={{
            onRowUpdate: (newData, oldData) => handleChangeBanner(newData, oldData),
          }}
        />
      </GridItem>
    </GridContainer>
  );
}

HomePageBanners.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  rowData: PropTypes.object,
};

HomePageBanners.defaultProps = {
  value: '',
};
