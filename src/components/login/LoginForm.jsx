import { useEffect, useRef } from "react";
import CustomInputs from "../customInputs/CustomInputs";
import { toast } from "react-toastify";
import { userLogin } from "../../helper/axiosHelper";
import { autoLogin, getUserInfoAction } from "../../pages/user/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const { user } = useSelector((state) => state.userInfo);
  const fromLocation =
    location?.state?.from?.location?.pathname || "/dashboard";

  useEffect(() => {
    user?._id && navigate(fromLocation);
    dispatch(autoLogin());
  }, [user?._id, navigate, dispatch]);

  const handleOnFormSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passRef.current.value;

    if (!email || !password) {
      return toast.error("Email and / or password is required!");
    }

    // if has email and password
    const pending = userLogin({ email, password });

    toast.promise(pending, {
      pending: "Please wait...",
    });

    const { status, jwts } = await pending;

    if (status === "success") {
      const { accessJWT, refreshJWT } = jwts;
      if (accessJWT && refreshJWT) {
        sessionStorage.setItem("accessJWT", accessJWT);
        localStorage.setItem("refreshJWT", refreshJWT);

        // dispatch user to store in redux
        dispatch(getUserInfoAction());
        navigate("/dashboard");
      }
    }
  };

  const customInput = [
    {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      type: "email",
      required: true,
      forwardref: emailRef,
    },
    {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      type: "password",
      required: true,
      forwardref: passRef,
    },
  ];

  return (
    <div className=" bg-gray-100 flex flex-col py-28 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 xxs:mx-auto xxs:w-full xxs:max-w-md">
        <div className="bg-white py-8 px-4 shadow xxs:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleOnFormSubmit}>
            {customInput.map((item, i) => (
              <CustomInputs key={i} {...item} />
            ))}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-100 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/512120/facebook-176.svg"
                    alt=""
                  />
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5"
                    src="https://www.svgrepo.com/show/513008/twitter-154.svg"
                    alt=""
                  />
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                    className="h-6 w-6"
                    src="https://www.svgrepo.com/show/506498/google.svg"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className=" text-center text-sm text-gray-500">
              Not a member?{" "}
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Create account with us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
