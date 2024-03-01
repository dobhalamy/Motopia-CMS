import api from './api';
import unify from './api/unify';

export const getrdsHomeList = () => unify(api.get('/rds-list'));

export const postRdsHomeData = rdsImageData => {
  return unify(api.post('/rds-list', { ...rdsImageData }));
};

export const updateRdsHomeData = updateRdsData => unify(api.patch(`/rds-list/${updateRdsData._id}`, updateRdsData));

export const deleteRdsHomeData = id => unify(api.delete(`/rds-list/${id}`));
