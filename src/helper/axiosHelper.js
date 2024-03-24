import axios from "axios";

const rootAPI = import.meta.env.VITE_SERVER_ROOT + "/api/v1";
const productAPI = rootAPI + "/products";
const categoryAPI = rootAPI + "/categories";
const subCategoryAPI = rootAPI + "/subcategories";
const cartAPI = rootAPI + "/cart";
const favouriteAPI = rootAPI + "/favourites";
const userAPI = rootAPI + "/users";
const stripeAPI = rootAPI + "/payments";
const orderAPI = rootAPI + "/orders";
const reviewAPI = rootAPI + "/reviews";
const subscriptionAPI = rootAPI + "/subscriptions";

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
    if (error.response?.data?.message?.includes("jwt expired")) {
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
export const getProducts = (obj) => {
  return axiosProcessor({
    method: "get",
    isPrivate: obj?.ids ? true : false,
    url:
      obj?.slug && obj?.size
        ? productAPI + "?slug=" + obj.slug + "&size=" + obj.size
        : obj?.slug
        ? productAPI + "/" + obj.slug
        : obj?.categoryId
        ? productAPI + "?categoryId=" + obj.categoryId
        : obj?.ids
        ? productAPI + "?ids=" + obj.ids.join(",")
        : obj?.subCategoryId
        ? productAPI + "?subCategoryId=" + obj.subCategoryId
        : obj?.prducts === "all"
        ? productAPI + "/all"
        : productAPI,
  });
};

// update product quantity after payment success
export const updateProductsQty = (data) => {
  return axiosProcessor({
    method: "patch",
    url: productAPI,
    data,
    isPrivate: true,
  });
};

// get categories
export const getCategories = (obj) => {
  return axiosProcessor({
    method: "get",
    url: obj?._id
      ? categoryAPI + "/?_id=" + obj._id
      : obj?.slug
      ? categoryAPI + "/?slug=" + obj.slug
      : categoryAPI,
  });
};

// get subcategories
export const getSubCategories = (obj) => {
  return axiosProcessor({
    method: "get",
    url: obj?._id
      ? subCategoryAPI + "/?_id=" + obj._id
      : obj?.categoryId
      ? subCategoryAPI + "/?categoryId=" + obj.categoryId
      : obj?.slug
      ? subCategoryAPI + "/?slug=" + obj.slug
      : subCategoryAPI,
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

// user logout
export const userLogout = (_id) => {
  return axiosProcessor({
    method: "post",
    url: userAPI + "/logout",
    data: {
      _id,
      accessJWT: getAccessJWT(),
    },
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

// create new user
export const postNewUser = (data) => {
  return axiosProcessor({
    method: "post",
    url: userAPI,
    data,
  });
};

// verify email
export const postVerifyEmail = (data) => {
  return axiosProcessor({
    method: "post",
    url: userAPI + "/verify-email",
    data,
  });
};

//post favorite
export const postAFavourite = (data) => {
  return axiosProcessor({
    method: "post",
    url: favouriteAPI,
    data,
    isPrivate: true,
  });
};

//get favorite
export const fetchFavourites = () => {
  return axiosProcessor({
    method: "get",
    url: favouriteAPI,
    isPrivate: true,
  });
};

//delete favorite
export const deleteAFavourite = (data) => {
  return axiosProcessor({
    method: "delete",
    url: favouriteAPI,
    data,
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

// fetch payment intent
export const fetchPaymentIntent = (data) => {
  return axiosProcessor({
    method: "post",
    url: stripeAPI + "/create-payment-intent",
    isPrivate: true,
    data,
  });
};

// post a order
export const postAOrder = (data) => {
  return axiosProcessor({
    method: "post",
    url: orderAPI,
    isPrivate: true,
    data,
  });
};

// get orders for logged user
export const getOrders = (obj) => {
  const { date, limit, skip, text } = obj;

  const conditionMatches = date && limit && skip >= 0;
  const onlyC2C3Matches = !date && limit && skip >= 0;
  const onlyC1Matches = date && !limit && !skip;

  const result = conditionMatches
    ? orderAPI +
      "/?date=" +
      date +
      "&limit=" +
      limit +
      "&skip=" +
      skip +
      "&text=" +
      text
    : onlyC2C3Matches
    ? orderAPI + "/?limit=" + limit + "&skip=" + skip + "&text=" + text
    : onlyC1Matches
    ? orderAPI + "/?date=" + date + "&text=" + text
    : orderAPI + "/?text=" + text;

  return axiosProcessor({
    method: "get",
    url: result,
    isPrivate: true,
  });
};

// post a review
export const postAReview = (data) => {
  return axiosProcessor({
    method: data?._id ? "put" : "post",
    url: reviewAPI,
    isPrivate: true,
    data,
  });
};

// get reviews for logged user
export const getReviews = (obj) => {
  return axiosProcessor({
    method: "get",
    url: obj?.userId
      ? reviewAPI + "/user" + obj.userId
      : obj?.productId
      ? reviewAPI + "/product" + obj.productId
      : reviewAPI,
    // isPrivate: true,
  });
};

// create subscription
export const postNewSubscription = (data) => {
  return axiosProcessor({
    method: "post",
    url: subscriptionAPI,
    data,
  });
};

// delete subscription
export const deleteUserSubscription = (data) => {
  return axiosProcessor({
    method: "delete",
    url: subscriptionAPI,
    data,
  });
};
