import { VehicleRoutes } from "client";
import {
  GET_LIST_OF_VEHICLES,
  VEHICLE_LIST_FETCH_ERROR,
} from '../constants/vehicles';

export const getListOfVehicles = () => async dispatch => {
  try {
    const response = await VehicleRoutes.getVehicles();
    dispatch({ type: GET_LIST_OF_VEHICLES, payload: response });
  } catch (error) {
    dispatch({ type: VEHICLE_LIST_FETCH_ERROR, error });
  }
};
