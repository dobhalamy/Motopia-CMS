import api from "./api";
import unify from "./api/unify";

export const getLifeStyleCategory = selectedCategory => unify(api.get(`/lifeStyle/${selectedCategory}`));

export const getCategoryDescription = selectedCategory => unify(api.get(`/lifeStyle/getDesc/${selectedCategory}`));

export const deleteLifeStyleCategory = id => unify(api.delete(`/lifeStyle/${id}`));

export const addNewLifeStyleCategory = categoryData => unify(api.post("lifeStyle/addlifeStyleCategory", { categoryData }));

export const updateLifeStyleCategory = categoryData => unify(api.post("lifeStyle/updatelifeStyleCategory", { categoryData }));