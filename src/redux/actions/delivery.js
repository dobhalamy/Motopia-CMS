import { DeliveryRoutes } from '../../client';
import { GET_DELIVERY, DELIVERY_FETCH_ERROR } from '../constants/delivery';

export const getDelivery = () => async dispatch => {
  try {
    const response = await DeliveryRoutes.getDelivery();
    dispatch({ type: GET_DELIVERY, payload: response });
  } catch (error) {
    dispatch({ type: DELIVERY_FETCH_ERROR, error });
  }
};
