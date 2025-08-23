import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { useFormik } from "formik";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const validate = (values) => {
  const errors = {};

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
  const { authUser, setAuthUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      const userData = {
        email: values.email,
        password: values.password,
      };

      axios
        .post(`${API_BASE}/api/login`, userData, {
          withCredentials: true,
        })
        .then((res) => {

          localStorage.setItem("userInfo", JSON.stringify(res.data));

          setAuthUser(res.data);
          navigate("/");
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  });

  return (
    <>
      <div className="w-[100%] h-dvh flex items-center justify-center">
        <div className="w-[80%] sm:w-[30rem] p-8 py-16 bg-white rounded-xl">
          <div className="flex flex-col items-center text-xl sm:text-3xl mb-6 font-bold wrap">
            <LockOutlineIcon />
            <h1>Login</h1>
            <h1>Welcome to Chatably</h1>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="p-3 my-2 rounded-lg border-1 border-gray-300 focus:outline-3 outline-black text-sm"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email ? (
                <div className="text-sm text-red-600">
                  {formik.errors.email}
                </div>
              ) : null}

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="p-3 my-2 rounded-lg border-1 border-gray-300 focus:outline-3 outline-black text-sm"
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
                className="p-2 mt-4 rounded-lg text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition duration-300 ease-in-out"
              >
                LOGIN
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm sm:text-base">
            <p>
              Dont have an account?{" "}
              {/* <a href="#">
                <span className="text-blue-600">Signup Now</span>
              </a> */}
              <Link to="/signup">
                <span className="text-blue-600">Signup</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
