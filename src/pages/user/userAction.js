import { getNewAccessJWT, getUser } from "../../helper/axiosHelper";
import { setUser } from "./userSlice";

export const getUserInfoAction = () => async (dispatch) => {
  const resp = await getUser();
  if (resp?.user) {
    dispatch(setUser(resp.user));
  }
};

export const autoLogin = () => async (dispatch) => {
  // check if we have access jwt, then fetch user
  const accessJWT = sessionStorage.getItem("accessJWT");
  if (accessJWT) {
    return dispatch(getUserInfoAction());
  }

  const refreshJWT = localStorage.getItem("refreshJWT");

  // get access jwt
  if (refreshJWT) {
    const token = await getNewAccessJWT();

    if (token?.accessJWT) {
      sessionStorage.setItem("accessJWT", token.accessJWT);

      dispatch(getUserInfoAction());
    }
  }
};
