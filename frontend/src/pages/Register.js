import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://clinic-backend-d1b4.onrender.com/api";

function Register() {

  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

     await axios.post(`${BASE_URL}/api/register/`, {
  username: username,
  email: email,
  password: password,
  role: role
});

      setMessage("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      console.log(err);
      setMessage("Registration failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-96">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleRegister}>

          {/* Username */}

          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 mb-4 rounded"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />

          {/* Email */}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          {/* Password */}

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          {/* Role */}

          <select
            className="w-full border p-2 mb-4 rounded"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
          >

            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>

          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>

        </form>

        {message && (
          <p className="text-center text-sm mt-4">
            {message}
          </p>
        )}

      </div>

    </div>

  );

}

export default Register;