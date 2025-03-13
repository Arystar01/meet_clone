import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          username: trimmedUsername,
          email: trimmedEmail,
          password: trimmedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSuccess(true);
      console.log("Signup successful:", res);
      navigate('/signin');
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      {/* Signup box */}
      <div className="bg-white w-96 p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-xl font-semibold mb-6 text-purple-600">Signup Page</h1>


        {success && <p className="text-green-500 text-sm mb-4">Signup successful! Redirecting...</p>}

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSignup}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="mb-1 text-sm font-medium text-purple-600">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 rounded-lg bg-slate-100 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-purple-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 rounded-lg bg-slate-100 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-purple-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 rounded-lg bg-slate-100 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm  text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
              } text-white font-medium py-2 rounded-lg w-full transition-all`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center text-sm mt-2">
            <span>Already have an account? </span>
            <a href="/signin" className="text-purple-600 hover:underline font-bold">Sign in</a>
          </div>
        </form>
      </div>
      {
        loading &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Registering .........
            </h2>
            <p className="text-gray-700"> Please wait .. </p>

          </div>
        </div>

      }


    </div>

  );
};

export default Signup;
