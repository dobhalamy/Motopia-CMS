import api from './api';
import unify from './api/unify';

export const getRdsCompaniesList = () => unify(api.get('/ride-share-companies')).then(res => res.data);
export const addRdsCompany = data => unify(api.post('/ride-share-companies', data));
export const updateRdsCompany = data => unify(api.put(`/ride-share-companies/${data._id}`, data));
export const deleteRdsCompany = id => unify(api.delete(`/ride-share-companies/${id}`));
