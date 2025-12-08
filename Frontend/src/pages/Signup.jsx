import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { useFormik } from "formik";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Divider from '@mui/material/Divider';

const validate = (values) => {
  const errors = {};
  if (!values.fullName) {
    errors.fullName = "fullname is required";
  }

  if (!values.email) {
    errors.email = "email is required";
  }

  if (!values.password) {
    errors.password = "password is required";
  }

  return errors;
};

export default function signup() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      const userData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      };

      axios
        .post(`https://chatably.onrender.com/api/signup`, userData)
        .then((response) => {
          console.log("Ok");
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <>
      <div className="text-sm w-[100%] h-dvh flex items-center justify-center">
        <div className="w-[80%] sm:w-[30rem] p-8 py-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-500 mb-2">
              Create an account
            </h1>
            <p className="mb-5 md:text-sm">Please enter your details to Sign up</p>
          </div>

          <div className="cursor-pointer mb-5 flex items-center justify-center space-x-2 rounded-lg border-1 border-black/10 p-2">
            <FcGoogle className="text-lg" /> <span>Sign up with Google</span>
          </div>

          <div className="mb-5">
             <Divider>Or sign up with email</Divider>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col">
              <input
                type="text"
                id="fullName"
                placeholder="Enter your name"
                className="p-2 outline-0 border-1 border-black/10 rounded-lg mt-3"
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
              {formik.errors.fullName ? (
                <div className="text-sm text-red-600">
                  {formik.errors.fullName}
                </div>
              ) : null}

              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="p-2 outline-0 border-1 border-black/10 rounded-lg mt-3"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email ? (
                <div className="text-sm text-red-600">
                  {formik.errors.email}
                </div>
              ) : null}

              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="p-2 outline-0 border-1 border-black/10 rounded-lg mt-3"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password ? (
                <div className="text-sm text-red-600">
                  {formik.errors.password}
                </div>
              ) : null}

              <button
                type="submit"
                className="p-2 mt-8 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <p>
              Already have an account?{" "}
              {/* <a href="#">
                <span className="text-blue-600">Login Now</span>
              </a> */}
              <Link to="/login">
                <span className="text-green-500">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
