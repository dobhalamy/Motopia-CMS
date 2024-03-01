import {
  GET_REFERRERS,
  GET_PARTNERS,
  REFERRERS_FETCH_ERROR,
  PARTNERS_FETCH_ERROR,
} from '../constants/promotion';

const initialState = {
  refererrs: [],
  refererrsFetchError: null,
  partners: [],
  partnersFetchError: null,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_REFERRERS:
      return {
        ...state,
        refererrsFetchError: null,
        refererrs: payload.data || [],
      };
    case REFERRERS_FETCH_ERROR:
      return {
        ...state,
        refererrs: [],
        refererrsFetchError: error,
      };
    case GET_PARTNERS:
      return {
        ...state,
        partnersFetchError: null,
        partners: payload.data || [],
      };
    case PARTNERS_FETCH_ERROR:
      return {
        ...state,
        partners: [],
        partnersFetchError: error,
      };
    default:
      return state;
  }
}
