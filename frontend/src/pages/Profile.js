import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { UserCircleIcon } from "@heroicons/react/24/solid";

function Profile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await API.get("/profile/");
        setProfile(res.data);

      } catch (err) {

        console.log("Profile fetch error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchProfile();

  }, []);

  const changePassword = async () => {

    if (!oldPassword || !newPassword) {
      alert("Please enter both passwords");
      return;
    }

    try {

      await API.post("/change-password/", {
        old_password: oldPassword,
        new_password: newPassword
      });

      alert("Password changed successfully");

      setOldPassword("");
      setNewPassword("");

    } catch (err) {

      console.log(err);
      alert("Password change failed");

    }

  };

  if (loading) {
    return (
      <Layout role={role}>
        <div className="text-center mt-10 text-gray-500">
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (

    <Layout role={role}>

      <div className="max-w-lg mx-auto">

        {/* Profile Card */}

        <div className="bg-white shadow-lg rounded-xl p-8 text-center">

          <UserCircleIcon className="h-24 w-24 text-blue-500 mx-auto mb-4" />

          <h2 className="text-xl font-semibold mb-4">
            {profile.username}
          </h2>

          <div className="text-left space-y-2">

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Email</span>
              <span>{profile.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Role</span>
              <span>{profile.role}</span>
            </div>

          {profile.role === "doctor" && (
  <>
    <div className="flex justify-between">
      <span className="font-semibold text-gray-600">Specialization</span>
      <span>{profile.specialization || "-"}</span>
    </div>

    <div className="flex justify-between">
      <span className="font-semibold text-gray-600">Experience</span>
      <span>{profile.experience || 0} Years</span>
    </div>
  </>
)}

          </div>

        </div>

        {/* Change Password */}

        <div className="mt-6 bg-white shadow rounded-xl p-6">

          <h3 className="text-lg font-semibold mb-3">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-3"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={changePassword}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
          >
            Update Password
          </button>

        </div>

      </div>

    </Layout>

  );

}

export default Profile;