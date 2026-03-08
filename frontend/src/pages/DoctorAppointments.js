import emptyIllustration from "../assets/illustrations/empty-appointments.png";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState, useCallback } from "react";

const BASE_URL = "https://clinic-backend-d1b4.onrender.com/api";

function DoctorAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [, setUpdatingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateString = selectedDate
    .toISOString()
    .split("T")[0];

  const selectedDayAppointments = appointments.filter(
    (a) => a.date === selectedDateString
  );

  const token = localStorage.getItem("token");

  /* FETCH APPOINTMENTS */

  const fetchAppointments = useCallback(async () => {

    setLoading(true);

    try {

      const res = await axios.get(
        `${BASE_URL}/doctor/appointments/`,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      setAppointments(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }, [token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* UPDATE STATUS */

  const updateStatus = async (id, status) => {

    setUpdatingId(id);

    try {

      await axios.patch(
        `${BASE_URL}/doctor/appointments/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      toast.success(`Appointment ${status.toLowerCase()}`);

      fetchAppointments();

    } catch (err) {

      toast.error("Status update failed");

    } finally {

      setUpdatingId(null);

    }

  };

  /* STATS */

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (a) => a.status === "PENDING"
  ).length;

  const approvedAppointments = appointments.filter(
    (a) => a.status === "APPROVED"
  ).length;

  const rejectedAppointments = appointments.filter(
    (a) => a.status === "REJECTED"
  ).length;

  /* SEARCH */

  const filteredAppointments = appointments.filter((a) =>
    a.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* GROUP BY DATE */

  const groupedAppointments = filteredAppointments.reduce((acc, appt) => {

    if (!acc[appt.date]) {
      acc[appt.date] = [];
    }

    acc[appt.date].push(appt);

    return acc;

  }, {});

  if (!token) return null;

  return (

    <Layout role="Doctor">

      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Doctor Appointments
      </h2>

      {/* CALENDAR */}

      <div className="bg-white p-5 rounded-lg shadow-sm border mb-8">

        <h3 className="text-lg font-semibold mb-4">
          Appointment Calendar
        </h3>

        <div className="flex justify-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
          />
        </div>

      </div>

      {/* SELECTED DAY APPOINTMENTS */}

      <div className="mt-6 mb-8">

        <h3 className="text-lg font-semibold mb-3">
          Appointments on {selectedDateString}
        </h3>

        {selectedDayAppointments.length === 0 && (
          <p className="text-gray-500 text-sm">
            No appointments for this day
          </p>
        )}

        {selectedDayAppointments.map((a) => (

          <div
            key={a.id}
            className="bg-gray-50 border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between gap-2 mb-2"
          >

            <div>
              <p className="font-medium">{a.patient_name}</p>
              <p className="text-sm text-gray-500">{a.reason}</p>
            </div>

            <div className="text-sm text-gray-700">
              {a.time}
            </div>

          </div>

        ))}

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl md:text-2xl font-semibold">{totalAppointments}</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg shadow border text-center">
          <p className="text-sm text-orange-600">Pending</p>
          <p className="text-xl md:text-2xl font-semibold text-orange-700">{pendingAppointments}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow border text-center">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-xl md:text-2xl font-semibold text-green-700">{approvedAppointments}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg shadow border text-center">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-xl md:text-2xl font-semibold text-red-700">{rejectedAppointments}</p>
        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-6 flex justify-center md:justify-start">

        <input
          type="text"
          placeholder="Search patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 border rounded-lg px-3 py-2"
        />

      </div>

      {/* LOADING */}

      {loading && (
        <p className="text-center text-gray-500">Loading appointments...</p>
      )}

      {/* EMPTY */}

      {!loading && filteredAppointments.length === 0 && (

        <div className="bg-white p-10 rounded-lg shadow border text-center">

          <img
            src={emptyIllustration}
            alt="No appointments"
            className="w-40 md:w-48 mx-auto mb-4"
          />

          <p className="text-gray-700 font-medium">
            No appointment requests yet
          </p>

        </div>

      )}

      {/* APPOINTMENT LIST */}

      {!loading && (

        <div className="grid gap-4">

          {filteredAppointments.map((a) => (

            <div
              key={a.id}
              className="bg-white rounded-lg shadow border p-5"
            >

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 mb-4 gap-2">

                <div className="flex items-center gap-3">

                  <UserCircleIcon className="h-10 w-10 text-blue-600" />

                  <div>

                    <p className="text-sm font-semibold text-gray-800">
                      {a.patient_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Appointment Request
                    </p>

                  </div>

                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    a.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : a.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {a.status}
                </span>

              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">

                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                  {a.date}
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                  {a.time}
                </div>

                <div className="sm:col-span-2">
                  <b>Reason:</b> {a.reason}
                </div>

              </div>

              {a.status === "Pending" && (

                <div className="flex flex-col sm:flex-row gap-2 mt-4">

                  <button
                    onClick={() => updateStatus(a.id, "APPROVED")}
                    className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 w-full sm:w-auto"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(a.id, "REJECTED")}
                    className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 w-full sm:w-auto"
                  >
                    Reject
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

      {/* GROUPED BY DATE */}

      <div className="mt-10">

        <h3 className="text-lg font-semibold mb-4">
          Appointments by Date
        </h3>

        {Object.entries(groupedAppointments).map(([date, appts]) => (

          <div key={date} className="mb-6">

            <h4 className="font-semibold text-blue-600 mb-2">
              {date}
            </h4>

            <div className="space-y-2">

              {appts.map((a) => (

                <div
                  key={a.id}
                  className="bg-gray-50 border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between gap-2"
                >

                  <div>
                    <p className="font-medium">{a.patient_name}</p>
                    <p className="text-sm text-gray-500">{a.reason}</p>
                  </div>

                  <div className="text-sm text-gray-700">
                    {a.time}
                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </Layout>

  );

}

export default DoctorAppointments;