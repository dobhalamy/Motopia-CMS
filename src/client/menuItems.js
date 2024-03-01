import api from "./api";
import unify from "./api/unify";

export const getMenuItem = () => unify(api.get("/menuItems"));

export const addMenuItem = data => unify(api.post("/menuItems/createMenu", { data }));

export const updateMenuItem = data =>
  unify(api.post("/menuItems/updateMenuItem", data));

export const deleteMenuItem = id => unify(api.delete(`/menuItems/${id}`));
