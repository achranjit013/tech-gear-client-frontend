import axios from "axios";

const rootAPI = import.meta.env.VITE_SERVER_ROOT + "/api/v1";
const productAPI = rootAPI + "/products";

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

export const getProducts = () => {
  return axiosProcessor({
    method: "get",
    url: productAPI,
  });
};
