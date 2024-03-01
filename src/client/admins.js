import api from "./api";
import unify from "./api/unify";

export const getAdmins = () => unify(api.get("/users"));

export const deleteAdmin = id => unify(api.delete(`/users/${id}`));

export const addNewAdmin = email => unify(api.post("users/invite", { email }));
