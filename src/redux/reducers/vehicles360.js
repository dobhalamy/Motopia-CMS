import {
  GET_LIST_OF_360_VEHICLES,
  VEHICLES_360_FETCH_ERROR,
} from '../constants/vehicles360';

const initialState = {
  listOf360Vehicles: [],
  vehicles360FetchError: null,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_LIST_OF_360_VEHICLES:
      return {
        ...state,
        vehicles360FetchError: null,
        listOf360Vehicles: payload.data || [],
      };
    case VEHICLES_360_FETCH_ERROR:
      return {
        ...state,
        listOf360Vehicles: [],
        vehicles360FetchError: error,
      };
    default:
      return state;
  }
}
