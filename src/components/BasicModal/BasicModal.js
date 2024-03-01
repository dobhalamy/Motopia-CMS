import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

export default function BasicModal(props) {
  const { handleCancel, handleAgree, showModal, title, body } = props;

  return (
    <Dialog open={showModal} onClose={handleCancel}>
      <DialogTitle>{title || 'Are you sure to delete this data?'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body || 'Are you sure to delete ?'}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Disagree
        </Button>
        <Button onClick={handleAgree} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BasicModal.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleAgree: PropTypes.func.isRequired,
  title: PropTypes.string,
  body: PropTypes.string,
  showModal: PropTypes.bool.isRequired,
};
