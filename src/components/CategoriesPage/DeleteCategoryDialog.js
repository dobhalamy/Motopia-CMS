import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function SimpleDialog(props) {
  const {
    onCloseDeleteCategoryDialog,
    handleDeleteCategory,
    DeleteCategoryDialogOpen,
    categoryName
  } = props;
  return (
    <Dialog open={DeleteCategoryDialogOpen} onClose={onCloseDeleteCategoryDialog}>
      <DialogTitle>Are you sure to delete this Category?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure to delete {categoryName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDeleteCategoryDialog} color="primary">
          Disagree
        </Button>
        <Button onClick={handleDeleteCategory} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onCloseDeleteCategoryDialog: PropTypes.func.isRequired,
  handleDeleteCategory: PropTypes.func.isRequired,
  DeleteCategoryDialogOpen: PropTypes.bool.isRequired,
  categoryName: PropTypes.string.isRequired
};
