import api from './api';
import unify from './api/unify';

const PROMOTION_REFERRER = '/promotion/referrer';
const PROMOTION_PARTNER = '/promotion/partner';
const PROMOTION_DISCOUNTS = '/promotion/discounts';

export const getReferrerList = () => unify(api.get(PROMOTION_REFERRER));

export const getPartnerList = () => unify(api.get(PROMOTION_PARTNER));

export const getDiscounts = () => unify(api.get(PROMOTION_DISCOUNTS));

export const setDiscounts = discounts =>
  unify(api.post(PROMOTION_DISCOUNTS, { ...discounts }));

export const addPartner = data =>
  unify(api.post(`${PROMOTION_PARTNER}`, { ...data }));

export const updatePartner = (id, data) =>
  unify(api.patch(`${PROMOTION_PARTNER}/${id}`, { ...data }));

export const deletePartner = id =>
  unify(api.delete(`${PROMOTION_PARTNER}/${id}`));
