import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const TopNav = () => {
  const { user } = useSelector((state) => state.userInfo);

  return (
    <nav
      className="hidden lg:flex items-center justify-between px-6 py-3 lg:px-8 bg-gray-900 text-neutral-200"
      aria-label="Global"
    >
      <div className="hidden lg:flex lg:flex-1">
        <span className="font-mono text-sm uppercase">
          Discover the Whirlwind of Variety!
        </span>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
        {user?._id ? (
          <>
            <Link to="/dashboard" className="text-sm font-mono">
              My Account
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-mono">
              Sign In
            </Link>
            <Link to="/create-account" className="text-sm font-mono">
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
