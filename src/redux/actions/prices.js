import { PricesRoutes } from "client";
import {
  GET_PRICE_LIST,
  PRICE_LIST_FETCH_ERROR
} from "../constants/prices";

export const getPrices = () => async dispatch => {
  try {
    const response = await PricesRoutes.getPriceList();
    dispatch({ type: GET_PRICE_LIST, payload: response });
  } catch (error) {
    dispatch({ type: PRICE_LIST_FETCH_ERROR, error });
  }
};
