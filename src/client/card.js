import api from "./api";
import unify from "./api/unify";

export const getAll = () => unify(api.get("/cards"));

export const update = cardsData =>
  unify(api.post(`/cards`, { cards: cardsData }));
