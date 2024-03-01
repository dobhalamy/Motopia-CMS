import api, { customerAPI } from './api';
import unify from './api/unify';

export const getVehicles = queryParams => unify(api.get('/vehicles', { params: queryParams }));

export const exportInventory = () => unify(api.get('/vehicles/exportInventory'));

export const updateVehicles = () => unify(api.put('/vehicles'));

export const updateVehicleById = (id, data) => unify(api.put(`/vehicles/${id}`, { ...data }));

export const getVehicleById = id => unify(api.get(`/vehicles/${id}`));

export const getVehicleSeoById = id => unify(api.get(`/vehicles/vehiclesSeo/${id}`));

export const getVehiclePins = () => unify(api.get('/vehicle-pins'));

export const postVehiclePins = data => unify(api.post('/vehicle-pins', { ...data }));

export const getVehiclePinsById = id => unify(api.get(`/vehicle-pins/${id}`));

export const updateVehiclePinsById = data => unify(api.patch(`/vehicle-pins`, { ...data }));

export const deleteVehiclePinsById = id => unify(api.delete(`/vehicle-pins/${id}`));

export const updateFeatures = data => unify(api.put('/features', { ...data }));

export const checkNada = data => unify(customerAPI.post('/Inventory/CheckNADAEquipment', { ...data }));

export const saveFeatures = data => unify(customerAPI.post('/Inventory/SavePossibleFeature', { ...data }));

export const deleteFeatures = data => unify(customerAPI.post('/Inventory/DeleteInventoryFeature', { ...data }));

export const getVehicleLimit = () => unify(api.get('/syncLimit'));

export const setVehiclelimit = limitData => unify(api.post('/syncLimit', { ...limitData }));

export const getAllRds = () => unify(customerAPI.get('/Inventory/RSDVehicleList'));
