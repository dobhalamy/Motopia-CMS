import api, { customerAPI } from './api';
import unify from './api/unify';

export const get360List = () => unify(api.get('web360/vehicles'));

export const get360VehicleConfig = stockid => unify(api.get(`web360/vehicles/${stockid}`));

export const getXMLById = id => unify(api.get(`web360/${id}`));

export const saveHotspots = data => unify(api.post('web360/hotspot', { ...data }));

export const deleteHotspot = ({ stockid, hotspotid, currentView }) => unify(api.delete(`web360/hotspot/${stockid}/${currentView}/${hotspotid}`));

export const getHotspotPictures = stockid => unify(customerAPI.get(`/Inventory/GetHotSpotPictures?StockId=${stockid}`));
export const getInteriorImage = stockid => unify(customerAPI.get(`/Inventory/GetInteriorAsset?StockId=${stockid}`));
