import api from './api';
import unify from './api/unify';

export const getCarousel = () => unify(api.get(`carousel`));

export const addCarousel = payload => unify(api.post(`carousel`, payload));

export const deleteCarousel = id => unify(api.delete(`carousel/${id}`));

export const updateCarousel = (id, payload) => unify(api.put(`carousel/${id}`, payload));

export const getCarouselSetting = () => unify(api.get(`carousel-setting`));

export const updateCarouselSetting = payload => unify(api.put(`carousel-setting`, payload));

export const getHeroCarouselSetting = () => unify(api.get(`hero-carousel-setting`));

export const updateHeroCarouselSetting = payload => unify(api.put(`hero-carousel-setting`, payload));
