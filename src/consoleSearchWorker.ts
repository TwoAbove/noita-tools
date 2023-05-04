import lambdaSearch from "./lambdaSearch";

const work = async (event, callback) => {
  try {
    const res = lambdaSearch(event);
    callback(null, res);
  } catch (e) {
    callback(e);
  }
};

export default work;
