import api from "./api";
import unify from "./api/unify";

export const getPins = () => unify(api.get("/finance-pins"));

export const updatePin = pin =>
  unify(api.patch(`/finance-pins/${pin._id}`, { ...pin }));
