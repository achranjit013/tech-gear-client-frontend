import axios from "axios";

const rootAPI = import.meta.env.VITE_SERVER_ROOT + "/api/v1";
const productAPI = rootAPI + "/products";
const categoryAPI = rootAPI + "/categories";

const axiosProcessor = async ({ method, url }) => {
  try {
    const response = await axios({
      method,
      url,
    });

    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const getProducts = (slug) => {
  return axiosProcessor({
    method: "get",
    url: slug ? productAPI + "/" + slug : productAPI,
  });
};

export const getCategories = (_id) => {
  return axiosProcessor({
    method: "get",
    url: _id ? categoryAPI + "/" + _id : categoryAPI,
  });
};
