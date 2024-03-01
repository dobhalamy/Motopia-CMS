import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, Dialog, Button, DialogActions, DialogContent, Grid, InputLabel, Input, InputAdornment } from '@material-ui/core';

const AddPartnerDialog = props => {
  const { open, onClose, handleAddPartner } = props;

  const [state, setState] = useState({
    name: '',
    promoCode: '',
    partnerSaleDiscount: '',
    partnerRentDiscount: '',
    rentWeeklyDiscount: '',
  });

  const handleSubmit = () => {
    handleAddPartner(state);
    setState({
      name: '',
      promoCode: '',
      partnerSaleDiscount: '',
      partnerRentDiscount: '',
      rentWeeklyDiscount: '',
    });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add new Partner for referral program</DialogTitle>
      <DialogContent>
        <Grid container justify="space-between" alignItems="center">
          <InputLabel htmlFor="partner-name">Name</InputLabel>
          <Input id="partner-name" name="name" value={state.name} onChange={event => handleChange(event)} />
        </Grid>
        <Grid container justify="space-between" alignItems="center">
          <InputLabel htmlFor="promo-code">Promo Code</InputLabel>
          <Input id="promo-code" name="promoCode" value={state.promoCode} onChange={event => handleChange(event)} />
        </Grid>
        <Grid container justify="space-between" alignItems="center">
          <InputLabel htmlFor="sale-discount">Sale Discount</InputLabel>
          <Input
            id="sale-discount"
            name="partnerSaleDiscount"
            type="number"
            value={state.partnerSaleDiscount}
            onChange={event => handleChange(event)}
            endAdornment={<InputAdornment position="end">$</InputAdornment>}
          />
        </Grid>
        <Grid container justify="space-between" alignItems="center">
          <InputLabel htmlFor="rent-discount">Rent Discount</InputLabel>
          <Input
            id="rent-discount"
            name="partnerRentDiscount"
            type="number"
            value={state.partnerRentDiscount}
            onChange={event => handleChange(event)}
            endAdornment={<InputAdornment position="end">$</InputAdornment>}
          />
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <InputLabel htmlFor="rent-weekly-discount" style={{ width: '6rem' }}>
            Rent Weekly Discount
          </InputLabel>
          <Input
            id="rent-weekly-discount"
            name="rentWeeklyDiscount"
            type="text"
            inputProps={{
              maxLength: 20,
            }}
            value={state.rentWeeklyDiscount}
            onChange={event => handleChange(event)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddPartnerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleAddPartner: PropTypes.func.isRequired,
};

export default AddPartnerDialog;
