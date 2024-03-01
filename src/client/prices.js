import api from "./api";
import unify from "./api/unify";

export const getPriceList = () => unify(api.get("/prices"));

export const setPriceList = prices => unify(api.post("/prices", { ...prices }));