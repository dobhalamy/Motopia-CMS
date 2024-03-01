import api from "./api";
import unify from "./api/unify";

export const getCategory = selectedCategory => unify(api.get(`/category/${selectedCategory}`));

export const deleteCategory = id => unify(api.delete(`/category/${id}`));

export const addNewCategory = categoryData => unify(api.post("category/addCategory", { categoryData }));

export const getCategoryDescription = selectedCategory => unify(api.get(`/category/getDesc/${selectedCategory}`));