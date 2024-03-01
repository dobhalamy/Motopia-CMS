import {
  GET_VEHICLES_SYNC_LIMIT,
  VEHICLE_LIMIT_FETCH_ERROR
} from '../constants/vehicleLimit';

const initialState = {
  vehicleLimit: [],
  vehicleLimitFetchError: null
};

export default function (state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_VEHICLES_SYNC_LIMIT:
      return {
        ...state,
        vehicleLimitFetchError: null,
        vehicleLimit: [payload.data] || [],
      };
    case VEHICLE_LIMIT_FETCH_ERROR:
      return {
        ...state,
        vehicleLimit: [],
        vehicleLimitFetchError: error,
      };
    default:
      return state;
  }
}