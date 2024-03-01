/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import MaterialTable from 'material-table';

import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
// NOTE: uncomment when we need local URL's
// import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useToasts } from 'react-toast-notifications';

import GridItem from 'components/Grid/GridItem.js';
import GridContainer from 'components/Grid/GridContainer.js';

import { RideShareRoutes } from 'client';
import Grid from '@material-ui/core/Grid';
import { ViewSeo } from 'components/SeoSection/ViewSeo';
import { HeroRoutes, CarouselRoutes } from 'client';
import ColorDialog from 'views/Carousel/ColorDialog';
import CloudinaryUploadWidget from 'components/Cloudinary/UploadWidget';

const useStyles = makeStyles({
  addColorButton: {
    top: -25,
    cursor: 'pointer',
    display: 'flex',
    position: 'relative',
    justifyContent: 'flex-end',
  },
});

const HeroImages = () => {
  const classes = useStyles();
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
      title: 'Link Path',
      field: 'linkPath',
      editComponent: props => (
        <TextField
          value={props.rowData.linkPath}
          fullWidth
          multiline
          // NOTE: Uncomment when we need local URL's
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
          folder="home-images"
          cropping
          croppingAspectRatio={16 / 4.98}
          preview={{ width: 150, height: 150, bg: props.rowData.src }}
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
            backgroundImage: `url(${rowData.mobileSrc})`,
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
          preview={{ width: 150, height: 150, bg: props.rowData.mobileSrc }}
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
  const [homePageSeo, setHomePageSeo] = React.useState();
  const [openSetting, setOpenSetting] = React.useState(false);
  const [carousalSetting, setCarousalSetting] = React.useState({
    color: '#000000',
    bgColor: '#ffffff',
    slideSpeed: '300',
  });

  const loadBanners = async () => {
    try {
      const response = await HeroRoutes.getPromo();
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

  const getHeroCarousalData = async () => {
    try {
      const heroSetting = await CarouselRoutes.getHeroCarouselSetting();
      const heroCarousalData = heroSetting.data;
      setCarousalSetting({
        ...carousalSetting,
        color: heroCarousalData.textColor,
        bgColor: heroCarousalData.backgroundColor,
        slideSpeed: heroCarousalData.sliderSpeed,
      });
    } catch (err) {
      addToast(err.status, { severity: 'error' });
    }
  };

  React.useEffect(() => {
    loadBanners();
    getHeroCarousalData();
    // eslint-disable-next-line
  }, []);

  const handleChangeBanner = async newData => {
    console.log(newData);
    try {
      await HeroRoutes.updatePromo(newData);
    } catch (err) {
      const message = (err.response && err.response.data && err.response.data.message) || err.message;
      addToast(message, { severity: 'error' });
    }
    loadBanners();
  };

  const handleCloseCarouselSetting = () => {
    setOpenSetting(false);
  };

  const handleColorSetting = () => {
    setOpenSetting(true);
  };

  const updatedCarouselSetting = data => {
    setCarousalSetting({
      ...carousalSetting,
      color: data.text,
      bgColor: data.bgColor,
      slideSpeed: data.slideSpeed,
    });

    const settingData = {
      backgroundColor: data.bgColor,
      textColor: data.text,
      sliderSpeed: data.slideSpeed,
    };

    CarouselRoutes.updateHeroCarouselSetting(settingData).then(res => {
      addToast(res.status, { severity: 'success' });
    });
    handleCloseCarouselSetting();
  };
  const loadSeo = React.useCallback(async () => {
    try {
      const response = await RideShareRoutes.getHomeRideShare();
      const filteredData = response.data.find(item => item.cityName.toLowerCase() === 'home page');
      setHomePageSeo(filteredData);
    } catch (err) {
      const message = err.message || err;
      addToast(message, { severity: 'info' });
    }
  }, [addToast]);

  React.useEffect(() => {
    loadSeo();
  }, [loadSeo]);

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
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <div className={classes.addColorButton}>
            <Button onClick={handleColorSetting} variant="outlined" color="primary">
              Setting
            </Button>
          </div>
          <MaterialTable
            title="Hero Images"
            columns={tableColumns}
            data={state.data}
            editable={{
              onRowUpdate: (newData, oldData) => handleChangeBanner(newData, oldData),
            }}
          />
          <ColorDialog isOpen={openSetting} categorySetting={carousalSetting} headerTitle={'Carousel Setting'} handleClose={handleCloseCarouselSetting} updateSetting={updatedCarouselSetting} />
        </GridItem>
      </GridContainer>
      {homePageSeo && (
        <Grid container direction="column">
          <Grid container alignItems="center">
            <Grid container style={{ backgroundColor: 'white', paddingBottom: 4, paddingTop: '1em', borderRadius: '0.5em' }}>
              <ViewSeo data={homePageSeo} handleUpdateItem={handleUpdateItem} />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

HeroImages.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  rowData: PropTypes.object,
};

HeroImages.defaultProps = {
  value: '',
};

export default HeroImages;
