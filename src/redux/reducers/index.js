import { combineReducers } from 'redux';
import auth from './auth';
import vehicles from './vehicles';
import pricelist from './prices';
import discounts from './discounts';
import promotion from './promotion';
import delivery from './delivery';
import vehicleLimit from './vehicleLimit';
import vehicles360 from './vehicles360';

export default combineReducers({
  auth,
  vehicles,
  pricelist,
  discounts,
  promotion,
  delivery,
  vehicleLimit,
  vehicles360
});
