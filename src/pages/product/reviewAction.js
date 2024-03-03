import { toast } from "react-toastify";
import { getReviews, postAReview } from "../../helper/axiosHelper";
import { setShowModal } from "../../components/modal/modalSlice";
import { setReviews } from "./reviewSlice";

export const getReviewAction = (obj) => async (dispatch) => {
  const { status, findResult } = await getReviews(obj);

  if (status === "success") {
    dispatch(setReviews(findResult));
  }
};

export const postNewReviewAction = (reviewObj) => async (dispatch) => {
  const { userId, ...rest } = reviewObj;
  const pending = postAReview(rest);
  toast.promise(pending, {
    pending: "Please wait...",
  });

  const { status, message } = await pending;
  toast[status](message);

  if (status === "success") {
    dispatch(getReviewAction({ userId }));
    dispatch(setShowModal(false));
  }
};
