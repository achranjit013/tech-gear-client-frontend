import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersAction, getTenOrdersAction } from "./orderAction";
import Sidebar from "../../components/layouts/Sidebar";
import { Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import { setShowModal } from "../../components/modal/modalSlice";
import CustomModal from "../../components/modal/CustomModal";
import Review from "../../components/review/Review";
import { getReviewAction } from "../product/reviewAction";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userInfo);
  const { orders } = useSelector((state) => state.orderInfo);
  const { tenOrders } = useSelector((state) => state.orderInfo);
  const { showModal } = useSelector((state) => state.modalInfo);
  const { reviews } = useSelector((state) => state.reviewInfo);

  const today = new Date();

  // last day
  const lastDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );

  // Last 7 days
  const last7Days = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 6
  );

  // Last 30 days
  const last30Days = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 29
  );

  // Last month
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);

  // Last year
  const lastYear = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );

  const dropDownMenu = [
    {
      name: "Last day",
      value: lastDay,
    },
    {
      name: "Last 7 days",
      value: last7Days,
    },
    {
      name: "Last 30 days",
      value: last30Days,
    },
    {
      name: "Last month",
      value: lastMonth,
    },
    {
      name: "Last year",
      value: lastYear,
    },
    {
      name: "All",
      value: undefined,
    },
  ];

  const [activePage, setActivePage] = useState(1); // State to track the active page
  const [activeSelection, setActiveSelection] = useState({
    name: "Last 30 days",
    value: last30Days,
  });
  const [filterText, setFilterText] = useState("");
  const [reviewProduct, setReviewProduct] = useState({});

  const itemsPerPage = 10; // Number of items per page
  const totalPageCount = Math.ceil(orders.length / itemsPerPage); // Total number of pages
  const startIndex = (activePage - 1) * itemsPerPage + 1; // Calculate start index of items
  const endIndex = Math.min(startIndex + itemsPerPage - 1, orders.length); // Calculate end index of items

  useEffect(() => {
    if (user?._id) {
      dispatch(
        getAllOrdersAction({
          date: activeSelection.value,
          text: filterText,
        })
      );

      dispatch(
        getTenOrdersAction({
          date: activeSelection.value,
          limit: 10,
          skip: startIndex - 1,
          text: filterText,
        })
      );

      dispatch(getReviewAction({ userId: user._id }));
    }
  }, [user?._id, activeSelection, activePage, filterText, showModal]);

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  const handlePreviousClick = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextClick = () => {
    const totalPageCount = Math.ceil(orders.length / 10);
    if (activePage < totalPageCount) {
      setActivePage(activePage + 1);
    }
  };

  const handleOnDropdownChange = (item) => {
    setActivePage(1);
    setActiveSelection({ name: item.name, value: item.value });
  };

  const handleOnSearch = (e) => {
    const { value } = e.target;
    const str = value.toLowerCase();

    setFilterText(str);
  };

  const handleOnReview = (obj) => {
    setReviewProduct(obj);
    // show modal
    dispatch(setShowModal(true));
  };

  const getReviewStatus = (productId) => {
    return reviews.find((item) => item.productId === productId);
  };

  const renderReviewComponent = (productId, productName, productSlug) => {
    const review = getReviewStatus(productId);
    // Case 1: Review not given
    if (!review) {
      return (
        <button
          type="button"
          className="w-full font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-gray-50 rounded flex items-center justify-center px-2 py-1"
          onClick={() => {
            handleOnReview({
              productId,
              productName,
              productSlug,
            });
          }}
        >
          {/* Write a Review */}
          Share Your Feedback
        </button>
      );
    }

    // Case 2: Review given but not approved
    if (review?.status === "inactive") {
      return (
        <span
          type="button"
          className="w-full font-medium bg-red-500 text-gray-800 rounded flex items-center justify-center px-2"
        >
          Pending Approval
        </span>
      );
    }

    // Case 3: Review given and approved
    if (review?.status === "active") {
      return (
        <div>
          <div className="mb-2 flex" id="ratings">
            {Array(5)
              .fill("")
              .map((str, i) => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={classNames(
                    review?.ratings > i
                      ? "text-warning"
                      : "text-gray-400 group-hover:text-gray-200",
                    "w-4 h-4"
                  )}
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

          <button
            type="button"
            className="w-full font-medium bg-yellow-600 hover:bg-yellow-700 text-gray-200 hover:text-gray-50 rounded flex items-center justify-center px-2 py-1"
            onClick={() => {
              handleOnReview({
                productId,
                productName,
                productSlug,
                review,
              });
            }}
          >
            Update Your Feedback
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <MainLayout>
      {showModal && (
        <CustomModal title="Product Feedback form!">
          <Review {...reviewProduct} />
        </CustomModal>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[256px,minmax(0,1fr)]">
        <Sidebar />

        <div className="p-4">
          <div className="p-4 border-2 border-dashed rounded-lg border-gray-800">
            <div className="relative shadow-md rounded-lg bg-gray-200">
              {/* filter bar */}
              <div className="flex flex-column gap-2 flex-wrap  items-center justify-between py-4">
                <div>
                  <Dropdown
                    label={activeSelection.name}
                    placement="bottom"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "2.2rem",
                      width: "9.2rem",
                      marginLeft: "0",
                      lineHeight: "1.25",
                      color: "#D1D5DB",
                      backgroundColor: "#1F2937",
                      border: "1px solid #D1D5DB",
                      borderTopRightRadius: "0.5rem",
                      borderBottomRightRadius: "0.5rem",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0",
                      hover: {
                        backgroundColor: "#4B5563",
                        color: "#D1D5DB",
                      },
                      focus: {
                        ringColor: "#1F2937",
                        borderColor: "#1F2937",
                      },
                    }}
                    className="bg-gray-800"
                  >
                    {dropDownMenu.map((item, i) => (
                      <Dropdown.Item
                        className="text-gray-300 hover:text-gray-800"
                        key={i}
                        onClick={() => handleOnDropdownChange(item)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>

                {/* search bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className="block p-2 ps-10 text-sm text-gray-300 border border-gray-300 rounded-s-lg w-80 bg-gray-800 focus:ring-gray-800 focus:border-gray-800 placeholder:text-gray-400"
                    placeholder="Search for items"
                    onChange={handleOnSearch}
                  />
                </div>
              </div>

              {/* table */}
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-800 uppercase bg-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Cart
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total price
                        <br />
                        (inc. shipping)
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Shipping Details
                      </th>
                      <th scope="col" className="px-6 py-3">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Purchased At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenOrders.map(
                      (
                        {
                          carts,
                          amount,
                          shippingState,
                          shippingStreet,
                          shippingZip,
                          email,
                          name,
                          createdAt,
                        },
                        index
                      ) => (
                        <tr
                          className={classNames(
                            index % 2 === 0 ? "bg-gray-100" : "bg-gray-300",
                            "group hover:bg-gray-400 hover:text-gray-800"
                          )}
                          key={index}
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap"
                          >
                            {carts.map(
                              (
                                {
                                  orderedQty,
                                  orderedSize,
                                  productName,
                                  productSlug,
                                  thumbnail,
                                  totalPrice,
                                  cartId,
                                  productId,
                                },
                                i
                              ) => (
                                <div className="flex gap-2 py-2" key={i}>
                                  <div className="flex flex-col gap-2 w-40">
                                    <img
                                      src={`http://localhost:8000` + thumbnail}
                                      alt={productName}
                                      className="w-full"
                                    />
                                    {renderReviewComponent(
                                      productId,
                                      productName,
                                      productSlug
                                    )}
                                  </div>
                                  <div>
                                    Product: {productName}
                                    <br />
                                    Size: {orderedSize}
                                    <br />
                                    Qty: {orderedQty}
                                    <br />
                                    Price: {totalPrice}
                                  </div>
                                </div>
                              )
                            )}
                          </th>
                          <td className="px-6 py-4">{amount}</td>
                          <td className="px-6 py-4">
                            {shippingStreet}
                            {", "}
                            {shippingState}
                            {", "}
                            {shippingZip}
                          </td>
                          <td className="px-6 py-4">
                            Name: {name}
                            <br />
                            Email: {email}
                          </td>
                          <td className="px-6 py-4">
                            {createdAt.substr(0, 10)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <nav
                className="flex items-center flex-column flex-wrap gap-2 md:flex-row justify-between pt-4 pb-4"
                aria-label="Table navigation"
              >
                <span className="flex items-center justify-center gap-2 px-3 text-sm h-8 ms-0 leading-tight text-gray-400 rounded-e-lg bg-gray-800">
                  <span>Showing</span>
                  <span className="font-semibold text-gray-300">
                    {endIndex === 0 ? 0 : startIndex}-{endIndex}
                  </span>
                  <span>of</span>
                  <span className="font-semibold text-gray-300">
                    {orders.length}
                  </span>
                </span>

                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                  <li>
                    <Link
                      to="#"
                      className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-400 bg-gray-800 border border-gray-700 rounded-s-lg hover:bg-gray-700 hover:text-gray-300"
                      onClick={handlePreviousClick}
                    >
                      Previous
                    </Link>
                  </li>

                  {Array.from({ length: totalPageCount }).map((_, index) => (
                    <li key={index}>
                      <Link
                        to="#"
                        className={`flex items-center justify-center px-3 h-8 leading-tight ${
                          activePage === index + 1
                            ? "bg-gray-600 text-gray-300 font-semibold"
                            : "text-gray-400 bg-gray-800 hover:text-gray-300 hover:bg-gray-700"
                        } border border-gray-700`}
                        onClick={() => handlePageClick(index + 1)}
                      >
                        {index + 1}
                      </Link>
                    </li>
                  ))}

                  <li>
                    <Link
                      to="#"
                      className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-400 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-gray-300"
                      onClick={handleNextClick}
                    >
                      Next
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
