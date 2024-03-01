import api from './api';
import unify from './api/unify';

export const getPromo = () => unify(api.get('/promo'));

export const getPrimaryPromo = () => unify(api.get('/promo/primary'));

export const postPromo = promo => unify(api.post('/promo', { ...promo }));

export const updatePromo = promo => unify(api.patch(`/promo/${promo._id}`, promo));

export const deletePromo = id => unify(api.delete(`/promo/${id}`));
