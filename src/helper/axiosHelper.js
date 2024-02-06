import axios from "axios";

const rootAPI = import.meta.env.VITE_SERVER_ROOT + "/api/v1";
const productAPI = rootAPI + "/products";
const categoryAPI = rootAPI + "/categories";
const userAPI = rootAPI + "/users";

const getAccessJWT = () => {
  return sessionStorage.getItem("accessJWT");
};

const getRefreshJWT = () => {
  return localStorage.getItem("refreshJWT");
};

const axiosProcessor = async ({
  method,
  url,
  data,
  isPrivate,
  refreshToken,
}) => {
  try {
    const token = refreshToken ? getRefreshJWT() : getAccessJWT();

    const headers = {
      Authorization: isPrivate ? token : null,
    };

    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

// products
export const getProducts = (slug) => {
  return axiosProcessor({
    method: "get",
    url: slug ? productAPI + "/" + slug : productAPI,
  });
};

// categories
export const getCategories = (_id) => {
  return axiosProcessor({
    method: "get",
    url: _id ? categoryAPI + "/" + _id : categoryAPI,
  });
};

// user
export const userLogin = (data) => {
  return axiosProcessor({
    method: "post",
    url: userAPI + "/login",
    data,
  });
};

export const getUser = () => {
  return axiosProcessor({
    method: "get",
    url: userAPI,
    isPrivate: true,
  });
};

// fetch new access jwt
export const getNewAccessJWT = () => {
  return axiosProcessor({
    method: "get",
    url: userAPI + "/get-accessjwt",
    isPrivate: true,
    refreshToken: true,
  });
};
