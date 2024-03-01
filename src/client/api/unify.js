const DEFAULT_ERROR_MESSAGE = "Oops, Error! Something went wrong;(";

const unify = async request => {
  try {
    const { data } = await request;
    return data;
  } catch (err) {
    if (err.response && err.response.data) {
      err.description = err.response.data.msg || DEFAULT_ERROR_MESSAGE;
    }

    throw err;
  }
};

export default unify;
