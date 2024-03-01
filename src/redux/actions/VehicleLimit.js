import { VehicleRoutes } from "client";
import {
  GET_VEHICLES_SYNC_LIMIT,
  VEHICLE_LIMIT_FETCH_ERROR,
} from '../constants/vehicleLimit';

export const getVehicleLimit = () => async dispatch => {
  try {
    const response = await VehicleRoutes.getVehicleLimit();
    dispatch({ type: GET_VEHICLES_SYNC_LIMIT, payload: response });
  } catch (error) {
    dispatch({ type: VEHICLE_LIMIT_FETCH_ERROR, error });
  }
}