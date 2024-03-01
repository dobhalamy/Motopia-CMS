import { Web360 } from "client";
import {
  GET_LIST_OF_360_VEHICLES,
  VEHICLES_360_FETCH_ERROR,
} from '../constants/vehicles360';

export const get360List = () => async dispatch => {
  try {
    const response = await Web360.get360List();
    dispatch({ type: GET_LIST_OF_360_VEHICLES, payload: response });
  } catch (error) {
    dispatch({ type: VEHICLES_360_FETCH_ERROR, error });
  }
};
