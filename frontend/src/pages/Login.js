import loginIllustration from "../assets/illustrations/login-medical.png";
import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";



function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
const handleLogin = async (e) => {

  e.preventDefault();

  setLoading(true);
  setError("");

  try {

    const res = await API.post("/login/", {
      username,
      password
    });

    console.log("LOGIN RESPONSE:", res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    if (res.data.role === "doctor") {
      navigate("/doctor");
    } 
    else if (res.data.role === "patient") {
      navigate("/patient");
    } 
    else {
      navigate("/admin");
    }

  } catch (err) {

    console.error(err);
    setError("Invalid username or password");

  }

  setLoading(false);

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center bg-blue-50 p-6 md:w-1/2">

          <img
            src={loginIllustration}
            alt="Doctor Illustration"
            className="w-40 md:w-64 mb-4"
          />

          <h2 className="text-xl md:text-2xl font-semibold text-blue-700 text-center">
            Clinic Management System
          </h2>

          <p className="text-gray-500 text-center">
            Secure & simple healthcare portal
          </p>

        </div>

        {/* RIGHT SIDE LOGIN */}
        <div className="p-6 md:w-1/2 w-full">

          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Welcome Back
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Please login to continue
          </p>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register Link */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;