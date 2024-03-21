import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteUserSubscription } from "../../helper/axiosHelper";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Unsubscribe = () => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [response, setResponse] = useState({});
  const [searchParams] = useSearchParams();
  const email = searchParams.get("e");

  useEffect(() => {
    // call axios helper to call api
    userEmailVerification();
  }, []);

  const userEmailVerification = async () => {
    const resp = await deleteUserSubscription({ email });
    setShowSpinner(false);
    setResponse(resp);
  };

  return (
    <div className="bg-gray-100 h-screen">
      <p className="shadow-lg p-6 text-center font-bold bg-gray-800 text-gray-50">
        Welcome{" "}
        <span className="bg-gray-100 text-gray-800 p-1 rounded">{email}</span>{" "}
        to MarketBay!
      </p>

      {showSpinner && (
        <button type="button" className="bg-gray-800 text-center" disabled>
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            viewBox="0 0 24 24"
          ></svg>
          Processing...
        </button>
      )}

      {response.message && (
        <p
          className={classNames(
            response.status === "success" ? "bg-green-400" : "bg-red-400",
            "text-center text-gray-800 p-4"
          )}
        >
          {response.message}
        </p>
      )}
    </div>
  );
};

export default Unsubscribe;
