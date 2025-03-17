import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "../redux/AuthSlice.js"

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const dispatch = useDispatch(); // ✅ Move inside the component
  const navigate = useNavigate(); // ✅ Use navigate instead of `window.location.href`

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Signin Response:", res.data);
      // console.log("Signin Response Status:", res.status);
      //  prointing the cookie
      // console.log("Signin Response Cookies:", res.headers["set-cookie"]);

      if (res.status === 200) {
        dispatch(setIsAuthenticated(true)); // ✅ Correct dispatch syntax
        dispatch(setUser(res.data)); // ✅ Separate dispatch call

        // Navigate to dashboard
        navigate("/");
      }
    } catch (error) {
      console.error("Signin Error:", error.response?.data || error.message);
      setInvalidCredentials(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="bg-white w-96 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <h1 className="text-xl font-semibold mb-6 text-purple-600">
            Signin Page
          </h1>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium text-purple-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg bg-slate-100 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-purple-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg bg-slate-100 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 rounded-lg w-full transition-all"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm mt-2">
              <span>Need an account? </span>
              <a href="/signup" className="text-purple-600 hover:underline font-bold">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>

      {invalidCredentials && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Invalid Credentials
            </h2>
            <p className="text-gray-700">You have entered incorrect details.</p>
            <button
              onClick={() => setInvalidCredentials(false)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
