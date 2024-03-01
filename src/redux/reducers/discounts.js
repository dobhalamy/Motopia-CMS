import { GET_DISCOUNTS, DISCOUNTS_FETCH_ERROR } from '../constants/discounts';

const initialState = {
  discounts: [],
  discountsFetchError: null,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_DISCOUNTS:
      return {
        ...state,
        discountsFetchError: null,
        discounts: [payload.data] || [],
      };
    case DISCOUNTS_FETCH_ERROR:
      return {
        ...state,
        discounts: [],
        discountsFetchError: error,
      };
    default:
      return state;
  }
}
