import api, { customerAPI } from './api';
import unify from './api/unify';
import flattenDeep from 'lodash.flattendeep';

export const getRideShares = () => unify(api.get('/ride-share-seo'));

export const getHomeRideShare = () => unify(api.get('/ride-share-seo/seo-list'));

export const addRideShare = data => unify(api.post('/ride-share-seo', data));

export const updateRideShare = (id, data) => unify(api.put(`/ride-share-seo/${id}`, data));

export const deleteRideShare = id => unify(api.delete(`/ride-share-seo/${id}`));

export const deleteRideShareImage = id => unify(api.delete(`/ride-share-seo/image/${id}`));

const getAllZones = () => unify(customerAPI.get('/Inventory/RSDZoneCount'));

export const getAvailableZones = () =>
  getAllZones().then(({ rsdZoneList }) => {
    if (rsdZoneList && rsdZoneList.length) {
      return rsdZoneList.filter(zone => zone.count > 0).map(zone => zone.zoneName);
    } else {
      console.error('There is no zones.');
      return [];
    }
  });

export const getStatesByZone = Zone =>
  unify(customerAPI.get('/Inventory/GetStateByZone', { params: { Zone } })).then(({ response: { data } }) => {
    if (data && data.length) {
      return data.map(({ state, stateAbbrevation }) => ({
        text: state,
        value: stateAbbrevation,
      }));
    } else {
      console.error('There is no states.');
      return [];
    }
  });

export const getZoneByState = (state, statesList, isAbbriv = true) => {
  let stateName = state;
  if (isAbbriv) {
    stateName = statesList.find(el => el.value === state).text;
  }
  return unify(customerAPI.get('/Inventory/GetZoneByState', { params: { State: stateName } })).then(({ response: { data } }) => {
    if (data && data.length) {
      return data[0].zone;
    } else {
      console.error('There is no zones.');
      return null;
    }
  });
};

export const getStatesByZoneList = zoneArray => {
  const ZoneList = zoneArray.join(',');
  return unify(customerAPI.get('/Inventory/GetStateByMultipleZones', { params: { ZoneList } })).then(({ response }) => {
    if (response) {
      return flattenDeep(response.map(el => el.statelist))
        .map(({ state, stateAbbrevation }) => ({
          text: state,
          value: stateAbbrevation,
        }))
        .sort((a, b) => {
          if (a.text < b.text) {
            return -1;
          }
          if (a.text > b.text) {
            return 1;
          }
          return 0;
        });
    } else {
      console.error('There are no states for multiple zones');
      return [];
    }
  });
};

export const getAllStates = () =>
  getAllZones()
    .then(({ rsdZoneList }) => {
      if (rsdZoneList && rsdZoneList.length) {
        return rsdZoneList.map(zone => zone.zoneName);
      } else {
        return [];
      }
    })
    .then(zones => (zones.length ? getStatesByZoneList(zones) : zones));
