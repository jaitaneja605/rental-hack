import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "./Loading";
import store from "../store";
import config from "../config";
import { SimpleApiHandler, ApiHandler } from "../utils/ApiHandler";


const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    SimpleApiHandler("users/login", "POST", credentials)
      .then((data) => {
        sessionStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        sessionStorage.setItem("userId", data.data.user._id);
       navigate("/dashboard");
      })
      .catch((error) => {
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
    {loading  && <Loading />}
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-pink-400 p-6">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email ID"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition duration-200">
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
