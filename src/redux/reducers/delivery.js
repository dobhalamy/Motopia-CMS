import { GET_DELIVERY, DELIVERY_FETCH_ERROR } from '../constants/delivery';

const initialState = {
  delivery: [],
  deliveryFetchError: null,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_DELIVERY:
      return {
        ...state,
        deliveryFetchError: null,
        delivery: [payload.data] || [],
      };
    case DELIVERY_FETCH_ERROR:
      return {
        ...state,
        delivery: [],
        deliveryFetchError: error,
      };
    default:
      return state;
  }
}
