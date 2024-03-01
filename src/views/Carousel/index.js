import React, { useEffect } from 'react';
import uuid from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import BodyTypeAddDialog from 'components/BodyType/BodyTypeAddDialog';
import { CarouselRoutes } from 'client';
import SubCategory from './SubCategory';
import ColorDialog from './ColorDialog';

const useStyles = makeStyles({
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
  cardTitle: {
    padding: '16px 0px',
    borderBottom: '1px solid #001C5E',
  },
  cardImage: {
    width: '100%',
    height: 100,
    objectFit: 'cover',
  },
  emptyImgTitle: {
    height: 124,
    alignItems: 'center',
    display: 'flex',
  },
  ImgTitle: {
    height: 'auto',
    alignItems: 'center',
    display: 'flex',
  },
  cardViewAllLink: {
    borderTop: '1px solid #001C5E',
    paddingTop: 12,
  },
  addFloatingButton: {
    position: 'fixed',
    right: 24,
    bottom: 24,
  },
  addColorButton: {
    position: 'absolute',
    right: 25,
  },
  linkStyle: {
    color: '#001C5E',
    cursor: 'pointer',
  },
  infoText: {
    fontSize: 13,
    opacity: '0.6',
  },
});

export default function Carousel() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    cardList: [],
    addMode: false,
    editMode: false,
    addModeCard: null,
    updatedSuccessfully: false,
  });

  const [notificationState, setNotificationState] = React.useState({
    uploadingStatus: null,
  });

  const [subCategory, setSubCategory] = React.useState(false);
  const [subState, setSubState] = React.useState({
    categoryId: null,
    categoryName: '',
  });
  const [openSetting, setOpenSetting] = React.useState(false);
  const [errors, setErrors] = React.useState('');
  const [categorySetting, setCategorySetting] = React.useState({
    color: '#000000',
    bgColor: '#ffffff',
    slideSpeed: '300',
  });

  const getCarouselData = async () => {
    let response = await CarouselRoutes.getCarousel();
    setState({
      ...state,
      addMode: false,
      editMode: false,
      addModeCard: null,
      cardList: response.data
        .map(cardData => ({
          ...cardData,
        }))
        .sort((prev, curr) => (prev.position > curr.position ? 1 : -1)),
    });
  };

  useEffect(
    () => {
      async function getCardSetting() {
        try {
          const responseSetting = await CarouselRoutes.getCarouselSetting();
          const settingData = responseSetting.data;
          setCategorySetting({
            ...categorySetting,
            color: settingData.textColor,
            bgColor: settingData.backgroundColor,
            slideSpeed: settingData.sliderSpeed,
          });
        } catch (error) {
          alert(`Error ocurred ${error.message}`);
          setNotificationState({ ...notificationState, uploadingStatus: error });
        }
      }

      async function getAllCards() {
        try {
          const response = await CarouselRoutes.getCarousel();
          setState({
            ...state,
            cardList: response.data
              .map(cardData => ({
                ...cardData,
                _id: cardData._id,
              }))
              .sort((prev, curr) => (prev.position > curr.position ? 1 : -1)),
          });
        } catch (error) {
          alert(`Error ocurred ${error.message}`);
          setNotificationState({ ...notificationState, uploadingStatus: error });
        }
      }
      getAllCards();
      getCardSetting();
    },
    //eslint-disable-next-line
    []
  );

  const gotoFilterSubCategory = (_id, name) => {
    setSubCategory(true);
    setSubState({
      ...subState,
      categoryId: _id,
      categoryName: name,
    });
  };

  const gotoCategory = () => {
    setSubCategory(false);
  };

  const handleResetUploadingStatus = () => setNotificationState({ ...notificationState, uploadingStatus: null });

  const handleAddNewCard = card => {
    const data = {
      title: card.title,
      description: card.description,
      image: card.image,
      mobileImage: card.mobileImage,
      subCateogries: [],
    };
    if (card.title && card.description && card.image) {
      setState({
        ...state,
        cardList: state.cardList.concat({
          _id: uuid(),
          title: !card.title ? `Title ${state.cardList.length + 1}` : card.title,
          image: card.image,
          mobileImage: card.mobileImage,
          description: card.description,
          subCategories: [],
        }),
        addMode: false,
      });
    }

    const validateData = ValidateAddNewCard(card);
    setErrors(validateData.message);
    if (validateData.success) {
      CarouselRoutes.addCarousel(data)
        .then(res => {
          setNotificationState({ ...notificationState, uploadingStatus: res });
          getCarouselData();
        })
        .catch(error => {
          setNotificationState({ ...notificationState, uploadingStatus: error });
        });
    }
  };

  const ValidateAddNewCard = value => {
    const { title } = value;
    const validateData = [];
    let returnData = {};
    if (!title) {
      validateData.push('title');
    }

    if (validateData.length) {
      returnData = {
        success: false,
        message: validateData.join(' , ') + ' is required',
      };
    } else {
      returnData = {
        success: true,
        message: '',
      };
    }
    return returnData;
  };

  const handleDeleteCarousel = removeId => {
    CarouselRoutes.deleteCarousel(removeId).then(res => {
      setNotificationState({ ...notificationState, uploadingStatus: res });
      getCarouselData();
    });
  };

  const handleEditCard = cardId =>
    setState({
      ...state,
      addModeCard: Object.assign({}, ...state.cardList.filter(card => card._id === cardId)),
      editMode: true,
    });

  const handleUpdateCategory = card => {
    const data = {
      ...card,
    };

    setState({
      ...state,
      addMode: false,
      editMode: false,
      addModeCard: null,
      cardList: state.cardList.map(type => (type._id === card._id ? { ...type, ...card } : type)),
    });

    CarouselRoutes.updateCarousel(card._id, data).then(res => {
      setNotificationState({ ...notificationState, uploadingStatus: res });
    });
  };

  const handleAllUpdateCategory = (id, data) => {
    CarouselRoutes.updateCarousel(id, data).then(res => {
      setNotificationState({ ...notificationState, uploadingStatus: res });
    });
  };

  const handleCloseModal = () => {
    setState({
      ...state,
      addMode: false,
      editMode: false,
      addModeCard: null,
    });
  };

  const handleAddCard = cardId =>
    setState({
      ...state,
      addModeCard: Object.assign({}, ...state.cardList.filter(card => card._id === cardId)),
      addMode: true,
    });

  const { uploadingStatus } = notificationState;
  const snackbarMessage = (uploadingStatus && (uploadingStatus.status || uploadingStatus.message)) || '';

  /*  sub category methods */

  const handleAddSubCategory = cardData => {
    const data = {
      _id: cardData._id,
      title: cardData.title,
      description: cardData.description,
      logoImage: cardData.logoImage,
      link: cardData.mainLink,
    };
    let cardDatalist = state.cardList.map(item => (item._id === subState.categoryId ? { ...item, subCategories: item.subCategories.concat(data) } : item));

    setState({
      ...state,
      cardList: cardDatalist,
      addMode: false,
    });
  };

  const handleDeleteSubCard = removeId => {
    let cardDatalist = state.cardList.map(item => (item._id === subState.categoryId ? { ...item, subCategories: item.subCategories.filter(type => removeId !== type._id) } : item));

    setState({
      ...state,
      cardList: cardDatalist,
    });
  };

  const handleEditSubCard = cardId => {
    let cardDatalist = state.cardList.filter(item => item._id === subState.categoryId);
    setState({
      ...state,
      addModeCard: Object.assign({}, ...cardDatalist[0].subCategories.filter(type => type._id === cardId)),
      editMode: true,
    });
  };

  const handleUpdateSubCategory = cardData => {
    const data = {
      _id: cardData._id,
      title: cardData.title,
      description: cardData.description,
      logoImage: cardData.logoImage,
      link: cardData.link,
    };

    let cardDatalist = state.cardList.map(item => (item._id === subState.categoryId ? { ...item, subCategories: item.subCategories.map(type => (type._id === data._id ? { ...data } : type)) } : item));

    setState({
      ...state,
      cardList: cardDatalist,
      editMode: false,
    });
  };

  const handleAddSubCard = cardId => {
    setState({
      ...state,
      addModeCard: Object.assign({}, ...state.cardList.filter(card => card._id === cardId)),
      addMode: true,
    });
  };

  const handleColorSetting = () => {
    setOpenSetting(true);
  };

  const handleCloseCarouselSetting = () => {
    setOpenSetting(false);
  };

  const updatedCarouselSetting = data => {
    setCategorySetting({
      ...categorySetting,
      color: data.text,
      bgColor: data.bgColor,
      slideSpeed: data.slideSpeed,
    });

    const settingData = {
      backgroundColor: data.bgColor,
      textColor: data.text,
      sliderSpeed: data.slideSpeed,
    };

    CarouselRoutes.updateCarouselSetting(settingData).then(res => {
      setNotificationState({ ...notificationState, uploadingStatus: res });
    });
    handleCloseCarouselSetting();
  };

  /* render content */

  if (subCategory) {
    return (
      <SubCategory
        gotoCategory={gotoCategory}
        categoryId={subState.categoryId}
        categoryName={subState.categoryName}
        addSubCategory={handleAddSubCategory}
        subState={state}
        notificationState={notificationState}
        subCardList={state.cardList.filter(card => card._id === subState.categoryId)}
        handleAddSubCard={handleAddSubCard}
        handleUpdateSubCategory={handleUpdateSubCategory}
        handleAllUpdateCategory={handleAllUpdateCategory}
        handleCloseModal={handleCloseModal}
        handleResetUploadingSubStatus={handleResetUploadingStatus}
        handleEditSubCard={handleEditSubCard}
        handleDeleteSubCard={handleDeleteSubCard}
      />
    );
  }
  return (
    <Grid className={classes.mainWrapper} container direction="column">
      <Grid container alignItems="center">
        <Typography align="center" variant="h5" style={{ marginLeft: 16 }}>
          Category
        </Typography>
        <Button style={{ marginLeft: 16 }} onClick={handleColorSetting} variant="outlined" color="primary" className={classes.addColorButton}>
          Setting
        </Button>
        <Fab size="large" className={classes.addFloatingButton} color="primary" aria-label="add" onClick={handleAddCard}>
          <AddIcon />
        </Fab>
      </Grid>
      <Grid container>
        {!!state.cardList.length &&
          state.cardList.map(cardData => {
            return (
              <Paper className={classes.cardWrapper} key={cardData._id}>
                <Grid item container>
                  <Grid className={classes.cardTitle} container alignItems="center" justify="center" wrap="nowrap">
                    <Grid item container justify="center" xs={12}>
                      {cardData.image ? <Typography className={classes.ImgTitle}>Desktop icon</Typography> : null}
                      {cardData.image ? (
                        <img className={classes.cardImage} style={{ width: '100%' }} src={cardData.image.src} alt="body type" />
                      ) : (
                        <Typography className={classes.emptyImgTitle}>No desktop icon available</Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid className={classes.cardTitle} container alignItems="center" justify="center" wrap="nowrap">
                    <Grid item container justify="center" xs={12}>
                      {cardData.mobileImage ? <Typography className={classes.ImgTitle}>Mobile icon</Typography> : null}
                      {cardData.mobileImage ? (
                        <img className={classes.cardImage} style={{ width: '100%' }} src={cardData.mobileImage.src} alt="body type" />
                      ) : (
                        <Typography className={classes.emptyImgTitle}>No mobile icon available</Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid className={classes.cardViewAllLink} container justify="space-between" alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="body1">{cardData.title || 'No Title'}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container direction="column">
                  <Grid container item wrap="nowrap">
                    <Grid container item xs={12}>
                      <Typography className={classes.infoText}>{!cardData.description ? 'No text' : cardData.description}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid className={classes.cardViewAllLink} container justify="space-between" alignItems="center">
                  <Typography variant="button" className={classes.linkStyle} onClick={() => gotoFilterSubCategory(cardData._id, cardData.title)}>
                    Sub category
                  </Typography>
                </Grid>

                <Grid item container justify="space-between">
                  <IconButton onClick={() => handleEditCard(cardData._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCarousel(cardData._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Paper>
            );
          })}
      </Grid>
      {state.editMode && (
        <BodyTypeAddDialog
          headerTitle={'Edit Category'}
          isOpen={state.editMode}
          cardData={state.addModeCard}
          handleUpdateCategory={handleUpdateCategory}
          handleCloseModal={handleCloseModal}
          editMode
          noViewLink
        />
      )}
      {state.addMode && (
        <BodyTypeAddDialog headerTitle={'Add Category'} isOpen={state.addMode} cardData={state.addModeCard} handleCloseModal={handleCloseModal} submit={handleAddNewCard} errors={errors} noViewLink />
      )}

      <ColorDialog isOpen={openSetting} categorySetting={categorySetting} headerTitle={'Carousel Setting'} handleClose={handleCloseCarouselSetting} updateSetting={updatedCarouselSetting} />

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!uploadingStatus}
        autoHideDuration={2000}
        onClose={handleResetUploadingStatus}
        message={snackbarMessage}
      />
    </Grid>
  );
}
