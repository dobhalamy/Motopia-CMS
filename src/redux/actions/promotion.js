import { PromotionRoutes } from '../../client';
import {
  GET_REFERRERS,
  GET_PARTNERS,
  REFERRERS_FETCH_ERROR,
  PARTNERS_FETCH_ERROR,
} from '../constants/promotion';

export const getRefererrs = () => async dispatch => {
  try {
    const response = await PromotionRoutes.getReferrerList();
    dispatch({ type: GET_REFERRERS, payload: response });
  } catch (error) {
    dispatch({ type: REFERRERS_FETCH_ERROR, error });
  }
};

export const getPartners = () => async dispatch => {
  try {
    const response = await PromotionRoutes.getPartnerList();
    dispatch({ type: GET_PARTNERS, payload: response });
  } catch (error) {
    dispatch({ type: PARTNERS_FETCH_ERROR, error });
  }
};
