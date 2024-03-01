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
    onCloseDeleteAdminDialog,
    handleDeleteAdmin,
    deleteAdminDialogOpen,
    adminName
  } = props;

  return (
    <Dialog open={deleteAdminDialogOpen} onClose={onCloseDeleteAdminDialog}>
      <DialogTitle>Are you sure to delete this Admin User?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure to delete {adminName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDeleteAdminDialog} color="primary">
          Disagree
        </Button>
        <Button onClick={handleDeleteAdmin} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onCloseDeleteAdminDialog: PropTypes.func.isRequired,
  handleDeleteAdmin: PropTypes.func.isRequired,
  deleteAdminDialogOpen: PropTypes.bool.isRequired,
  adminName: PropTypes.string.isRequired
};
