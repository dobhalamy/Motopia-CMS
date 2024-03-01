import api from "./api";
import unify from "./api/unify";

export const getDelivery = () => unify(api.get("/delivery"));

export const setDelivery = delivery => unify(api.post("/delivery", { ...delivery }));
