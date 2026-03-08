import { BuildingOffice2Icon } from "@heroicons/react/24/solid";
export default function Navbar({ role, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT – LOGO & TITLE */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary leading-tight">
              Clinic Management System
            </h1>
            <p className="text-xs text-gray-500">
              Healthcare Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT – ROLE & LOGOUT */}
        <div className="flex items-center gap-4">
          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              role === "Doctor"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {role === "Doctor" ? "👨‍⚕️ Doctor" : "🧑‍🦰 Patient"}
          </span>

          <button
            onClick={onLogout}
            className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}