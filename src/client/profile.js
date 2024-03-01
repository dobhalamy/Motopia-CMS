import api from "./api";
import unify from "./api/unify";

export const getMe = () => unify(api.get("/users/profile"));
