import React from "react";

const CustomInputs = ({ label, forwardref, ...rest }) => {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-700">
        {label}
      </label>
      <div className="mt-2">
        <input
          {...rest}
          ref={forwardref}
          className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default CustomInputs;
