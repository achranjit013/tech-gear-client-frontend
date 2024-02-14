import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const TopNav = () => {
  const { user } = useSelector((state) => state.userInfo);
  console.log(user);

  return (
    <nav
      className="hidden lg:flex items-center justify-between px-6 py-3 lg:px-8 bg-gray-900 text-neutral-600 dark:text-neutral-200"
      aria-label="Global"
    >
      <div className="hidden lg:flex lg:flex-1">
        <span className="font-semibold text-sm">NEW STYLES JUST ADDED!</span>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
        {user?._id ? (
          <>
            <Link to="/my-account" className="text-sm font-semibold">
              My Account
            </Link>
            <Link to="/" className="text-sm font-semibold">
              Log Out
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-semibold">
              Log In
            </Link>
            <Link to="/signup" className="text-sm font-semibold">
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
