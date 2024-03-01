import {
  GET_LIST_OF_VEHICLES,
  VEHICLE_LIST_FETCH_ERROR,
} from '../constants/vehicles';

const initialState = {
  listOfVehicles: [],
  vehicleListFetchError: null,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_LIST_OF_VEHICLES:
      return {
        ...state,
        vehicleListFetchError: null,
        listOfVehicles: payload.data || [],
      };
    case VEHICLE_LIST_FETCH_ERROR:
      return {
        ...state,
        listOfVehicles: [],
        vehicleListFetchError: error,
      };
    default:
      return state;
  }
}
