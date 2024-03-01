import React, { useEffect, useState } from "react";
import CustomInputs from "../customInputs/CustomInputs";
import { postNewReviewAction } from "../../pages/product/reviewAction";
import { useDispatch } from "react-redux";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Review = ({ productId, productName, productSlug, review }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ratings: "5" });

  useEffect(() => {
    if (review?._id) {
      setForm({
        title: review.title,
        ratings: review.ratings.toString(),
        feedback: review.feedback,
      });
    }
  }, []);

  const handleOnStar = (ratings) => {
    setForm({
      ...form,
      ratings: ratings.toString(),
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const obj = {
      ...form,
      productId,
      productSlug,
      productName,
      _id: review?._id,
      status: review?._id ? "inactive" : undefined,
    };

    dispatch(postNewReviewAction(obj));
  };

  return (
    <form className="" onSubmit={handleOnSubmit}>
      <h2 className="mb-4 text-xl text-gray-800 font-semibold">
        You are reviewing {productName}
      </h2>

      <CustomInputs
        name="title"
        label="Title"
        value={form.title}
        required={true}
        placeholder="Best Product Ever..."
        onChange={handleOnChange}
      />

      <label
        htmlFor="ratings"
        className="block text-sm font-medium leading-6 text-gray-800 mt-4"
      >
        Select ratings
      </label>
      <div className="mt-2 flex" id="ratings">
        {Array(5)
          .fill("")
          .map((str, i) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={classNames(
                form.ratings > i ? "text-warning" : "",
                "w-6 h-6 cursor-pointer"
              )}
              onClick={() => handleOnStar(i + 1)}
              key={i}
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          ))}
      </div>

      <div className="max-w-3xl">
        <label
          htmlFor="feedback"
          className="block text-sm font-medium leading-6 text-gray-800 mt-4"
        >
          Feedback
        </label>
        <textarea
          id="feedback"
          className="w-full resize rounded-md mt-2 border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6"
          name="feedback"
          value={form.feedback}
          required={true}
          rows="5"
          placeholder="Your feedback matters! Tell us about your experience with the product!"
          onChange={handleOnChange}
        ></textarea>
      </div>

      {/* submit btn */}
      <button
        type="submit"
        className={classNames(
          review?._id
            ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-700"
            : "bg-gray-800 hover:bg-gray-700 focus:ring-gray-800",
          "mt-10 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-gray-200 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
        )}
      >
        {review?._id ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
};

export default Review;
