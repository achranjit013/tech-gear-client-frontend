import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { postVerifyEmail } from "../../helper/axiosHelper";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VerifyEmail = () => {
  const [showSpinner, setShowSpinner] = useState(true);
  const [response, setResponse] = useState({});
  const [searchParams] = useSearchParams();
  const associate = searchParams.get("e");
  const token = searchParams.get("c");

  useEffect(() => {
    // call axios helper to call api
    userEmailVerification();
  }, []);

  const userEmailVerification = async () => {
    const resp = await postVerifyEmail({ associate, token });
    setShowSpinner(false);
    setResponse(resp);
  };

  return (
    <div className="bg-gray-100 h-screen">
      <p className="shadow-lg p-6 text-center font-bold bg-gray-700 text-gray-50">
        Welcome{" "}
        <span className="bg-gray-100 text-gray-700 p-1 rounded">
          {associate}
        </span>{" "}
        to Variété Vortéx!
      </p>

      {showSpinner && (
        <button type="button" className="bg-gray-700 text-center" disabled>
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
            "text-center text-gray-700 p-4"
          )}
        >
          {response.message}
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;
