import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/UserServices";
import { toast } from "react-toastify";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    api?: string;
  }>({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      api?: string;
    } = {};

    try {
      if (!user.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(user.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!user.password) {
        newErrors.password = "Password is required";
      }
      if (!user.password) {
        newErrors.name = "Full Name is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        await signup(user);
        toast.success("Signup Successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      // setError(err.response?.data?.message || "Signup failed");
      newErrors.api = err.response?.data?.message || "Something went wrong. Try again later";
      setErrors(newErrors);
    }
  };

  return (
    <div className="h-full flex bg-[#FCF9DC] md:p-8 lg:p-16 md:gap-10 lg:gap-28">
      {/* Left Side Illustration */}

      <div className="w-full md:w-1/2 lg:w-2/3 flex justify-center md:justify-end">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#875332] text-center">
            Sign Up
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={user.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
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
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
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
              Sign Up
            </button>

            {/* Sign Up Option */}
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#875332] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      {/* Right Side Form */}

      <div className="hidden md:flex md:w-1/2 lg:w-2/3 justify-center opacity-80">
        <img
          src="assets/Booklover2.gif"
          className="w-auto md:h-[350px] lg:h-[450px]"
          alt="Book Illustration "
        />
      </div>
    </div>
  );
};

export default SignUp;
