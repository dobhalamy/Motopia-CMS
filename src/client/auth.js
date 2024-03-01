import api from "./api";
import unify from "./api/unify";

export const login = data => unify(api.post("/auth/login", data));

export const setNewPass = data => unify(api.post("/users/set-password", data));

export const getProfile = () => unify(api.get("/auth/profile"));
