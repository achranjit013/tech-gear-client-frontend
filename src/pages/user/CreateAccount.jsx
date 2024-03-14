import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { Link } from "react-router-dom";
import CustomInputs from "../../components/customInputs/CustomInputs";
import { toast } from "react-toastify";
import { postNewUser } from "../../helper/axiosHelper";

const initialState = {
  fname: "",
  lname: "",
  address: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const CreateAccount = () => {
  const [form, setForm] = useState(initialState);
  const [passwordValidationError, setPasswordValidationError] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // array of password validation error messages
  const validationMessage = [
    "Password must be between 6 to 16 characters and include at least:",
    "1. one uppercase",
    "2. one lowercase",
    "3. one number",
    "4. one special character",
    "5. and no spaces",
  ];

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // check if password is valid
    form.password = name === "password" ? value : form.password;
    form.confirmPassword =
      name === "confirmPassword" ? value : form.confirmPassword;

    // check new password
    if (form.password) {
      const regularExpression =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      const isPasswordValid = regularExpression.test(form.password);
      setPasswordValidationError(!isPasswordValid);
    } else {
      setPasswordValidationError(false);
    }

    // compare passwords
    if (form.confirmPassword) {
      const isPasswordMatch = form.password === form.confirmPassword;
      setPasswordMatch(isPasswordMatch);
    } else {
      setPasswordMatch(true);
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const { confirmPassword, ...rest } = form;

    // check password
    // if password do not match, alert user.
    if (confirmPassword !== rest.password) {
      return alert(
        "Oops! Passwords do not match. Please double-check and try again. Your security is our priority!"
      );
    }

    // if password match, call api to store admin data
    const userPromise = postNewUser(rest);

    toast.promise(userPromise, {
      pending: "Please wait...",
    });

    const { status, message } = await userPromise;

    if (status === "success") {
      setForm(initialState);
    }

    toast[status](message);
  };

  const customInput = [
    {
      label: "First Name",
      name: "fname",
      placeholder: "Enter your first name",
      type: "text",
      required: true,
      value: form.fname,
    },
    {
      label: "Last Name",
      name: "lname",
      placeholder: "Enter your last name",
      type: "text",
      required: true,
      value: form.lname,
    },
    {
      label: "Address",
      name: "address",
      placeholder: "Enter your full address",
      type: "text",
      value: form.address,
    },
    {
      label: "Phone",
      name: "phone",
      placeholder: "Enter your phone number",
      type: "text",
      value: form.phone,
    },
    {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      type: "email",
      required: true,
      value: form.email,
    },
    {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      type: "password",
      required: true,
      value: form.password,
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      placeholder: "Re-enter your password",
      type: "password",
      required: true,
      value: form.confirmPassword,
    },
  ];

  return (
    <MainLayout>
      <div className=" bg-gray-100 flex flex-col pb-8 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-700">
            Create account
          </h2>
        </div>

        <div className="mt-8 xxs:mx-auto xxs:w-full xxs:max-w-md">
          <div className="bg-gray-50 py-8 px-4 shadow xxs:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleOnSubmit}>
              {customInput.map((item, i) => (
                <CustomInputs key={i} {...item} onChange={handleOnChange} />
              ))}

              <div className="">
                {!passwordMatch && (
                  <div className="text-danger p-3">
                    <ul className="text-sm font-medium text-gray-700 bg-red-400 border rounded-lg">
                      <li className="w-full px-4 py-2">
                        Oops! Passwords do not match. Please double-check and
                        try again. Your security is our priority!
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="">
                {passwordValidationError && (
                  <div className="text-danger fw-light p-3">
                    <ul className="text-sm font-medium text-gray-700 bg-red-400 border rounded-lg">
                      {validationMessage.map((line, index) => (
                        <li key={index} className="w-full px-4 py-2">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-50 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-500"
                  disabled={passwordValidationError || !passwordMatch}
                >
                  Create account
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
                Already a member?{" "}
                <Link
                  to="/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Please login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateAccount;
