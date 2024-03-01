import api from './api';
import unify from './api/unify';

export const getAll = () => unify(api.get('/body-types'));

export const getAvailable = () => unify(api.get('/body-types/available'));
export const getInventoryThreshold = () => unify(api.get('/inventory'));
export const setInventoryThreshold = data => unify(api.post('/inventory', data));

export const update = cardsData => unify(api.post(`/body-types`, { cards: cardsData }));
