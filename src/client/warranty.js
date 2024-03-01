import api from './api';
import unify from './api/unify';

export const getWarranty = () => unify(api.get('/warranty'));

export const getPrimaryWarranty = () => unify(api.get('/warranty/primary'));

export const postWarranty = warranty => unify(api.post('/warranty', warranty));

export const updateWarranty = warranty => unify(api.patch(`/warranty/${warranty._id}`, warranty));

export const deleteWarranty = id => unify(api.delete(`/warranty/${id}`));
