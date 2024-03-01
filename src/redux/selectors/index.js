import { createSelector } from 'reselect';

export const getAuth = state => state.auth;
const selectAvailableVehicle = state => state.vehicles;
const slectPrices = state => state.pricelist;
const selectDisounts = state => state.discounts;
const selectPromotion = state => state.promotion;
const selectDelivery = state => state.delivery;
const selectVehicleLimit = state => state.vehicleLimit;
const select360Vehicles = state => state.vehicles360;

export const userSelector = createSelector(
  getAuth,
  auth => auth.currentUser
);

export const isAppReadySelector = createSelector(
  getAuth,
  state => state.isAppReady
);

export const isAuthenticatedSelector = createSelector(
  getAuth,
  state => state.isAuthenticated
);

export const currentUserSelector = createSelector(
  userSelector,
  user => user
);

export const currentUserIdSelector = createSelector(
  userSelector,
  user => user && user._id
);

export const listOfVehiclesSelector = createSelector(
  selectAvailableVehicle,
  state => state.listOfVehicles
);

export const priceListSelector = createSelector(
  slectPrices,
  state => state.prices
);

export const discountsSelector = createSelector(
  selectDisounts,
  state => state.discounts
);

export const refererrsSelector = createSelector(
  selectPromotion,
  state => state.refererrs
);

export const partnersSelector = createSelector(
  selectPromotion,
  state => state.partners
);

export const deliverySelector = createSelector(
  selectDelivery,
  state => state.delivery
);

export const limitSelector = createSelector(
  selectVehicleLimit,
  state => state.vehicleLimit
);

export const vehicles360Selector = createSelector(
  select360Vehicles,
  state => state.listOf360Vehicles
);

export const vehicleSelector = stockid => createSelector(listOfVehiclesSelector, (vehicles) => {
  if (vehicles.length) {
    return vehicles.find(vehicle => {
      return vehicle.stockid === Number(stockid);
    });
  } else {
    return {};
  }
});