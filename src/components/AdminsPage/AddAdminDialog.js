import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";

export default function SimpleDialog(props) {
  const [newAdminEmail, setEmail] = React.useState("");
  const {
    handleCloseNewAdminDialog,
    handleAddAdmin,
    newAdminDialogOpen
  } = props;

  return (
    <Dialog open={newAdminDialogOpen} onClose={handleCloseNewAdminDialog}>
      <DialogTitle>Enter new admin&#39;s email for send invite:</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          variant="outlined"
          onChange={event => setEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleAddAdmin(newAdminEmail)} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  handleCloseNewAdminDialog: PropTypes.func.isRequired,
  handleAddAdmin: PropTypes.func.isRequired,
  newAdminDialogOpen: PropTypes.bool.isRequired
};
