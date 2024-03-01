import { PromotionRoutes } from '../../client';
import { GET_DISCOUNTS, DISCOUNTS_FETCH_ERROR } from '../constants/discounts';

export const getDiscounts = () => async dispatch => {
  try {
    const response = await PromotionRoutes.getDiscounts();
    dispatch({ type: GET_DISCOUNTS, payload: response });
  } catch (error) {
    dispatch({ type: DISCOUNTS_FETCH_ERROR, error });
  }
};
