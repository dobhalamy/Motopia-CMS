import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { createStructuredSelector } from 'reselect';

import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import AddPartnerDialog from '../../components/ReferralProgram/AddPartnerDialog';

import { PromotionRoutes } from 'client';
import { getRefererrs, getPartners } from '../../redux/actions/promotion';
import { refererrsSelector, partnersSelector } from '../../redux/selectors';

const ReferalProgram = props => {
  const { addToast } = useToasts();
  const [isPartnerDialogOpen, setPartnerDialog] = useState(false);

  useEffect(() => {
    props.getRefererrs();
    props.getPartners();
    // eslint-disable-next-line
  }, []);

  const partnerTableColumns = [
    {
      title: 'Partner Name',
      field: 'name',
      editable: 'never',
    },
    {
      title: 'Promo Code',
      field: 'promoCode',
      editable: 'never',
    },
    {
      title: 'Promo Link',
      field: 'promoLink',
      editable: 'never',
    },
    {
      title: 'Sale Discount, $',
      field: 'partnerSaleDiscount',
    },
    {
      title: 'Rent Discount, $',
      field: 'partnerRentDiscount',
    },
    {
      title: 'Rent Weekly Discount',
      field: 'rentWeeklyDiscount',
    },
  ];

  const refererrsTableColumns = [
    {
      title: 'Prospect ID',
      field: 'prospectId',
    },
    {
      title: 'Prospect Name',
      field: 'name',
    },
    {
      title: 'Promo Code',
      field: 'promoCode',
    },
    {
      title: 'Prospect phone',
      field: 'prospectPhoneNumber',
    },
    {
      title: 'Referrer ID',
      field: 'referralProspectId',
    },
    {
      title: 'Referrer Name',
      field: 'referralName',
    },
    {
      title: 'Referrer phone',
      field: 'referralPhoneNumber',
    },
    {
      title: 'Purchased Vehicle',
      field: 'isPurchased',
    },
    {
      title: 'Deal Type',
      field: 'dealType',
      render: data => (data.dealType === 'Offline' ? 'Physical' : 'Online'),
    },
    {
      title: 'Location',
      field: 'source',
    },
  ];

  const baseTableOptions = {
    paging: true,
    pageSize: 5,
    search: true,
    sorting: false,
    draggable: false,
  };

  const handleUpdatePartner = async newData => {
    const obj = {
      name: newData.name,
      partnerSaleDiscount: String(newData.partnerSaleDiscount),
      partnerRentDiscount: String(newData.partnerRentDiscount),
    };
    try {
      const response = await PromotionRoutes.updatePartner(newData._id, obj);
      addToast(response.status);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    props.getPartners();
  };

  const handleDeletePartner = async rowData => {
    try {
      const response = await PromotionRoutes.deletePartner(rowData._id);
      addToast(response.status);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    props.getPartners();
  };

  const openPartnerDialog = () => setPartnerDialog(true);

  const closePartnerDialog = () => setPartnerDialog(false);

  const addNewPartner = async data => {
    try {
      const response = await PromotionRoutes.addPartner(data);
      addToast(response.status);
    } catch (err) {
      addToast(err.response.data.message, { severity: 'error' });
    }
    closePartnerDialog();
    props.getPartners();
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MaterialTable
            title="Our Partners"
            columns={partnerTableColumns}
            data={props.partners}
            editable={{
              onRowUpdate: newData => handleUpdatePartner(newData),
              onRowDelete: rowData => handleDeletePartner(rowData),
            }}
            options={{
              ...baseTableOptions,
              actionsColumnIndex: -1,
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add User',
                isFreeAction: true,
                onClick: openPartnerDialog,
              },
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <MaterialTable
            title="Referrers"
            columns={refererrsTableColumns}
            data={props.refererrs}
            options={{
              ...baseTableOptions,
            }}
          />
        </Grid>
      </Grid>
      <AddPartnerDialog open={isPartnerDialogOpen} onClose={closePartnerDialog} handleAddPartner={addNewPartner} />
    </>
  );
};

ReferalProgram.propTypes = {
  refererrs: PropTypes.array.isRequired,
  partners: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  refererrs: refererrsSelector,
  partners: partnersSelector,
});

const mapDispatchToProps = {
  getRefererrs,
  getPartners,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferalProgram);
