import React from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

export default function NewPasswordDialog(props) {
  const [newPass, setPass] = React.useState("");
  const { handleSetNewPass, newPasswordDialogOpen } = props;

  return (
    <Dialog open={newPasswordDialogOpen}>
      <DialogTitle>Welcome to Motopia Admin Panel</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please set your password for Sign In:
        </DialogContentText>
        <TextField
          fullWidth
          variant="outlined"
          onChange={event => setPass(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSetNewPass(newPass)} color="primary">
          SET NEW PASS
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NewPasswordDialog.propTypes = {
  handleSetNewPass: PropTypes.func.isRequired,
  newPasswordDialogOpen: PropTypes.bool.isRequired
};
