import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { createStructuredSelector } from 'reselect';

import TextField from '@material-ui/core/TextField';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';

import { PricesRoutes, PromotionRoutes, DeliveryRoutes } from 'client';
import { getPrices } from '../../redux/actions/prices';
import { getDiscounts } from '../../redux/actions/discounts';
import { getDelivery } from '../../redux/actions/delivery';
import { getVehicleLimit } from '../../redux/actions/VehicleLimit';
import { priceListSelector, discountsSelector, deliverySelector, limitSelector } from '../../redux/selectors';
import { VehicleRoutes } from 'client';

const PriceList = props => {
  const { addToast } = useToasts();

  const mile_Error = 'Please set delivery miles in range of 100-10,000';

  useEffect(() => {
    props.getPrices();
    props.getDiscounts();
    props.getDelivery();
    props.getVehicleLimit();
    // eslint-disable-next-line
  }, []);

  const priceTableColumns = [
    {
      title: 'Lock down payment, $',
      field: 'lockDown',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="lockDown"
          value={props.rowData.lockDown}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Minimal Downpayment, $',
      field: 'downPayment',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="downPayment"
          value={props.rowData.downPayment}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Retail Deposit, $',
      field: 'retailDeposit',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="retailDeposit"
          value={props.rowData.retailDeposit}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
  ];

  const discountTableColumns = [
    {
      title: 'Discount for Sale, $',
      field: 'saleDiscount',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="saleDiscount"
          value={props.rowData.saleDiscount}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Discount for Rent, $',
      field: 'rentDiscount',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="rentDiscount"
          value={props.rowData.rentDiscount}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
  ];

  const deliveryTableColumns = [
    {
      title: 'Delivery Miles From Pickup Location(miles)',
      field: 'deliveryMiles',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="deliveryMiles"
          value={props.rowData.deliveryMiles}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Days To Delivery From Pickup Date',
      field: 'deliveryDays',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="deliveryDays"
          value={props.rowData.deliveryDays}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Delivery Fee, $',
      field: 'deliveryFee',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="deliveryFee"
          value={props.rowData.deliveryFee}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
    {
      title: 'Ride Share OFF/ON',
      field: 'isRideShareEnabled',
      render: rowData => <Switch checked={rowData.isRideShareEnabled} name="isRideShareEnabled" disabled />,
      editComponent: props => (
        <Switch
          checked={props.rowData.isRideShareEnabled}
          name="isRideShareEnabled"
          onChange={event => {
            props.onChange(event.target.checked, props.rowData);
          }}
        />
      ),
    },
  ];

  const vehicleLimitTableColumns = [
    {
      title: 'Vehicle Limits',
      field: 'synclimit',
      editComponent: props => (
        <TextField
          fullWidth
          multiline
          rowsMax="3"
          name="synclimit"
          value={props.rowData.synclimit}
          onChange={event => {
            props.onChange(event.target.value, props.rowData);
          }}
        />
      ),
    },
  ];

  const handleChangePrices = async newData => {
    const obj = {
      _id: newData._id,
      lockDown: String(newData.lockDown),
      downPayment: String(newData.downPayment),
      retailDeposit: String(newData.retailDeposit),
    };
    try {
      const response = await PricesRoutes.setPriceList(obj);
      addToast(response.status);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    props.getPrices();
  };

  const handleChangeDiscounts = async newData => {
    const obj = {
      _id: newData._id,
      saleDiscount: String(newData.saleDiscount),
      rentDiscount: String(newData.rentDiscount),
    };
    try {
      const response = await PromotionRoutes.setDiscounts(obj);
      addToast(response.status);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    props.getDiscounts();
  };

  const handleDeliverySettings = async newData => {
    const obj = {
      _id: newData._id,
      deliveryDays: String(newData.deliveryDays),
      deliveryMiles: String(newData.deliveryMiles),
      isRideShareEnabled: newData.isRideShareEnabled,
      deliveryFee: String(newData.deliveryFee),
    };
    if (newData.deliveryMiles >= 50 && newData.deliveryMiles <= 10000) {
      try {
        const response = await DeliveryRoutes.setDelivery(obj);
        addToast(response.status);
      } catch (err) {
        addToast(err.response.data.message, { severity: 'error' });
      }
      props.getDelivery();
    } else {
      addToast(mile_Error, { severity: 'error' });
    }
  };

  const handleVehicleLimitSettings = async newData => {
    const obj = {
      _id: newData._id,
      vehicleLimit: String(newData.synclimit),
    };
    try {
      const response = await VehicleRoutes.setVehiclelimit(obj);
      addToast(response.status);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    props.getVehicleLimit();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MaterialTable
          title="Price List"
          columns={priceTableColumns}
          data={props.prices}
          editable={{
            onRowUpdate: newData => handleChangePrices(newData),
          }}
          options={{
            paging: false,
            pageSize: 1,
            search: false,
            actionsColumnIndex: -1,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <MaterialTable
          title="Referral Discounts"
          columns={discountTableColumns}
          data={props.discounts}
          editable={{
            onRowUpdate: newData => handleChangeDiscounts(newData),
          }}
          options={{
            paging: false,
            pageSize: 1,
            search: false,
            actionsColumnIndex: -1,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <MaterialTable
          title="Delivery Settings"
          columns={deliveryTableColumns}
          data={props.delivery}
          editable={{
            onRowUpdate: newData => handleDeliverySettings(newData),
          }}
          options={{
            paging: false,
            pageSize: 1,
            search: false,
            actionsColumnIndex: -1,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <MaterialTable
          title="VehicleSync Limit Settings"
          columns={vehicleLimitTableColumns}
          data={props.vehicleLimit}
          editable={{
            onRowUpdate: newData => handleVehicleLimitSettings(newData),
          }}
          options={{
            paging: false,
            pageSize: 1,
            search: false,
            actionsColumnIndex: -1,
          }}
        />
      </Grid>
    </Grid>
  );
};

PriceList.propTypes = {
  prices: PropTypes.array.isRequired,
  getPrices: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  prices: priceListSelector,
  discounts: discountsSelector,
  delivery: deliverySelector,
  vehicleLimit: limitSelector,
});

const mapDispatchToProps = {
  getPrices,
  getDiscounts,
  getDelivery,
  getVehicleLimit,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceList);
