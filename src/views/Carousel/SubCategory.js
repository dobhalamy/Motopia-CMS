import React from 'react';

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
    height: 200,
    objectFit: 'cover',
  },
  emptyImgTitle: {
    height: 200,
    alignItems: 'center',
    display: 'flex',
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
    cursor: 'pointer',
  },
  infoText: {
    fontSize: 13,
    opacity: '0.6',
  },
});

export default function SubCategory(props) {
  const classes = useStyles();

  const {
    gotoCategory,
    categoryId,
    addSubCategory,
    subState,
    handleAddSubCard,
    handleUpdateSubCategory,
    handleResetUploadingSubStatus,
    handleEditSubCard,
    handleDeleteSubCard,
    subCardList,
    categoryName,
    handleCloseModal,
    handleAllUpdateCategory,
    notificationState,
  } = props;
  const { uploadingStatus } = notificationState;
  const snackbarMessage = (uploadingStatus && (uploadingStatus.status || uploadingStatus.message)) || '';

  return (
    <Grid className={classes.mainWrapper} container direction="column">
      <Grid container alignItems="center">
        <Typography align="center" variant="h5" style={{ marginLeft: 16 }}>
          Sub Category : {categoryName}
        </Typography>
        <Button style={{ marginLeft: 16 }} onClick={gotoCategory} variant="outlined" color="primary">
          Back to Category
        </Button>
        <Button style={{ marginLeft: 16 }} onClick={() => handleAllUpdateCategory(categoryId, subCardList[0])} variant="outlined" color="primary">
          Update Sub Category
        </Button>
        <Fab size="large" className={classes.addFloatingButton} color="primary" aria-label="add" onClick={handleAddSubCard}>
          <AddIcon />
        </Fab>
      </Grid>
      <Grid container>
        {!!subCardList[0].subCategories &&
          subCardList[0].subCategories.map((cardData, index) => {
            return (
              <Paper className={classes.cardWrapper} key={index}>
                <Grid item container>
                  <Grid className={classes.cardTitle} container alignItems="center" justify="center" wrap="nowrap">
                    <Grid item container justify="center" xs={12}>
                      {cardData.logoImage ? (
                        <img className={classes.cardImage} style={{ width: '100%' }} src={cardData.logoImage.src} alt="body type" />
                      ) : (
                        <Typography className={classes.emptyImgTitle}>No icon available</Typography>
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

                <Grid item container justify="space-between">
                  <IconButton onClick={() => handleEditSubCard(cardData._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteSubCard(cardData._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Paper>
            );
          })}
      </Grid>
      {subState.editMode && (
        <BodyTypeAddDialog
          headerTitle={'Edit Category'}
          isOpen={subState.editMode}
          cardData={subState.addModeCard}
          handleUpdateSubCategory={handleUpdateSubCategory}
          handleCloseModal={handleCloseModal}
          subCategoryMode
        />
      )}
      {subState.addMode && (
        <BodyTypeAddDialog headerTitle={'Add Category'} isOpen={subState.addMode} cardData={subState.addModeCard} handleCloseModal={handleCloseModal} submit={addSubCategory} subCategoryMode />
      )}

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!uploadingStatus}
        autoHideDuration={3000}
        onClose={handleResetUploadingSubStatus}
        message={snackbarMessage}
      />
    </Grid>
  );
}
