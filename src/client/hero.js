import api from './api';
import unify from './api/unify';

export const getPromo = () => unify(api.get('/hero'));

export const getPrimaryPromo = () => unify(api.get('/hero/primary'));

export const postPromo = hero => unify(api.post('/hero', { ...hero }));

export const updatePromo = hero => unify(api.patch(`/hero/${hero._id}`, hero));

export const deletePromo = id => unify(api.delete(`/hero/${id}`));
