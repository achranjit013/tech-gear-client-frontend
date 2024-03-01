import { toast } from "react-toastify";
import { getReviews, postAReview } from "../../helper/axiosHelper";
import { setShowModal } from "../../components/modal/modalSlice";
import { setReviews } from "./reviewSlice";

export const getReviewAction = () => async (dispatch) => {
  const { status, findResult } = await getReviews();

  if (status === "success") {
    dispatch(setReviews(findResult));
  }
};

export const postNewReviewAction = (reviewObj) => async (dispatch) => {
  const pending = postAReview(reviewObj);
  toast.promise(pending, {
    pending: "Please wait...",
  });

  const { status, message } = await pending;
  toast[status](message);

  if (status === "success") {
    dispatch(getReviewAction());
    dispatch(setShowModal(false));
  }
};
