import axios from "axios";

const rootAPI = import.meta.env.VITE_SERVER_ROOT + "/api/v1";
const productAPI = rootAPI + "/products";
const categoryAPI = rootAPI + "/categories";
const cartAPI = rootAPI + "/cart";
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
      // ContentType: "application/json",
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
    if (error.response?.data?.message.includes("jwt expired")) {
      const { accessJWT } = await getNewAccessJWT();

      if (accessJWT) {
        sessionStorage.setItem("accessJWT", accessJWT);
        return axiosProcessor({ method, url, data, isPrivate, refreshToken });
      }
    }

    return {
      status: "error",
      message: error.message,
    };
  }
};

// get products
export const getProducts = (slug, size) => {
  return axiosProcessor({
    method: "get",
    url:
      slug && size
        ? productAPI + "/" + slug + "/" + size
        : slug
        ? productAPI + "/" + slug
        : productAPI,
  });
};

// get products for cart
export const getProductsForCart = (data) => {
  return axiosProcessor({
    method: "get",
    url: productAPI + "/cart-item/" + data.slug + "&" + data.size,
  });
};

// get categories
export const getCategories = (_id) => {
  return axiosProcessor({
    method: "get",
    url: _id ? categoryAPI + "/" + _id : categoryAPI,
  });
};

// user login
export const userLogin = (data) => {
  return axiosProcessor({
    method: "post",
    url: userAPI + "/login",
    data,
  });
};

// get user
export const getUser = () => {
  return axiosProcessor({
    method: "get",
    url: userAPI,
    isPrivate: true,
  });
};

//post cart
export const postACart = (data) => {
  return axiosProcessor({
    method: "post",
    url: cartAPI,
    data,
    isPrivate: true,
  });
};

//get all cart for logged user
export const getUserCart = () => {
  return axiosProcessor({
    method: "get",
    url: cartAPI,
    isPrivate: true,
  });
};

//get a cart
export const getACart = (productId, size) => {
  return axiosProcessor({
    method: "get",
    url: cartAPI + "/" + productId + "&" + size,
    isPrivate: true,
  });
};

// update cart
export const updateCart = (data) => {
  return axiosProcessor({
    method: "patch",
    url: cartAPI,
    data,
    isPrivate: true,
  });
};

// delete cart
export const deleteCart = (data) => {
  return axiosProcessor({
    method: "delete",
    url: cartAPI,
    data,
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
