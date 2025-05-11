import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/UserServices";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    api?: string;
  }>({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     const response = await login(credentials);
  //     localStorage.setItem("token", response.data.token); // Store JWT token
  //     alert("Login Successful!");
  //     navigate("/"); // Redirect to dashboard
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Invalid credentials");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { email?: string; password?: string; api?: string } = {};

    try {
      // Simple validation
      if (!credentials.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!credentials.password) {
        newErrors.password = "Password is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        console.log(credentials.email, credentials.password); // Debugging
        setErrors({});
        const response = await login(credentials);
        if (response.data.message != "") {
          newErrors.api = err.response?.data || "Invalid credentials";
          setErrors(newErrors);
        } else {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("email", response.data.email);
          // alert("Login Successful!");
          onLogin();
          navigate("/"); // Redirect to homepage
        }
      }
    } catch (err) {
      newErrors.api = err.response?.data || "Invalid credentials";
      setErrors(newErrors);
    }
  };

  return (
    <div className="h-full flex bg-[#FCF9DC] md:p-8 lg:p-16 md:gap-10 lg:gap-28">
      {/* Left Side Illustration */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 justify-end opacity-80">
        <img
          src="assets/Booklover.gif"
          className="w-auto md:h-[350px] lg:h-[450px]"
          alt="Book Illustration "
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 lg:w-2/3 flex justify-center md:justify-start">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#875332] text-center">
            Login
          </h2>

          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-[#875332] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center space-y-4">
            {errors.api && (
              <p className="text-red-500 text-xs italic">{errors.api}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#F8DAAB] hover:bg-[#CEA882] text-[#875332] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>

            {/* Sign Up Option */}
            <p className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#875332] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
