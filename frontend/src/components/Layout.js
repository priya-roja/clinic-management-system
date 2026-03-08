import { useNavigate, Link } from "react-router-dom";
import {
  HomeIcon,
  CalendarDaysIcon,
  UserIcon
} from "@heroicons/react/24/outline";

export default function Layout({ role, children }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <div className="w-full md:w-64 bg-white shadow-lg">

        <div className="p-5 border-b">

          <h1 className="text-xl font-bold text-blue-600">
            Clinic System
          </h1>

        </div>

        <nav className="p-4 space-y-3">

          {role === "Doctor" && (
            <Link
              to="/doctor"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-100 transition"
            >
              <HomeIcon className="h-5 w-5" />
              Doctor Dashboard
            </Link>
          )}

          {role === "Patient" && (
            <Link
              to="/patient"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-100 transition"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              My Appointments
            </Link>
          )}

          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-100 transition"
          >
            <UserIcon className="h-5 w-5" />
            Profile
          </Link>

        </nav>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}

        <div className="bg-white shadow px-4 md:px-6 py-3 flex justify-between items-center">

          <p className="font-semibold text-sm md:text-base">
            {role} Panel
          </p>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 md:px-4 py-1 rounded text-sm"
          >
            Logout
          </button>

        </div>

        {/* PAGE */}

        <div className="w-full max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>

      </div>

    </div>

  );
}