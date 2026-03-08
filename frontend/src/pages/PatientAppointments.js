import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { UserIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

function PatientAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [searchDoctor, setSearchDoctor] = useState("");

  useEffect(() => {

    const fetchDoctors = async () => {

      try {
        const res = await API.get("/doctors/");
        setDoctors(res.data);
      } catch (error) {
        console.error("Doctor fetch error", error);
      }

    };

    fetchDoctors();

  }, []);

  const itemsPerPage = 5;

  const fetchAppointments = useCallback(async () => {

    setLoading(true);

    try {

      const res = await API.get("/patient/appointments/list/");
      setAppointments(res.data);

    } catch (err) {

      console.error("Error fetching appointments", err);

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const createAppointment = async (e) => {

    e.preventDefault();

    if (!doctor) {
      toast.error("Please select a doctor");
      return;
    }

    try {

      await API.post("/patient/appointments/", {
        doctor: doctor,
        date: date,
        time: time,
        reason: reason
      });

      toast.success("Appointment requested successfully");

      fetchAppointments();

      setDate("");
      setTime("");
      setReason("");
      setDoctor(null);

    } catch (err) {

      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to request appointment");
      }

    }

  };

  const cancelAppointment = async (id) => {

    try {

      await API.patch(`/patient/appointments/${id}/cancel/`);

      toast.success("Appointment cancelled");

      fetchAppointments();

    } catch (err) {

      toast.error("Cancel failed");

    }

  };

  const filteredAppointments =
    filter === "ALL"
      ? appointments
      : appointments.filter(a => a.status === filter);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const badgeClass = status =>
    status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-orange-100 text-orange-700";

  return (

    <Layout role="Patient">

      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        My Appointments
      </h2>

      {/* HEADER */}

      <div className="bg-white rounded-lg shadow-sm border p-5 mb-6 flex items-center gap-4">

        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-green-500" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-800">
            Patient Dashboard
          </p>
          <p className="text-xs text-gray-500">
            Manage your clinic appointments
          </p>
        </div>

      </div>

      {/* REQUEST BUTTON */}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Request Appointment"}
      </button>

      {/* REQUEST FORM */}

      {showForm && (

        <form
          onSubmit={createAppointment}
          className="bg-white p-5 rounded-lg shadow-sm border mb-6 w-full max-w-xl space-y-4"
        >

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Reason"
            required
          />

          {/* SEARCH DOCTOR */}

          <input
            type="text"
            placeholder="Search doctor..."
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* DOCTOR GRID */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {doctors
              .filter((doc) =>
                doc.name?.toLowerCase().includes(searchDoctor.toLowerCase())
              )
              .map((doc) => (

                <div
                  key={doc.id}
                  onClick={() => setDoctor(doc.id)}
                  className={`cursor-pointer border rounded-lg p-4 transition
                  ${doctor === doc.id
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-blue-400"}`}
                >

                  <p className="font-semibold text-sm">
                    Dr. {doc.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {doc.specialization}
                  </p>

                </div>

              ))}

          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Submit
          </button>

        </form>

      )}

      {/* FILTERS */}

      <div className="flex flex-wrap gap-2 mb-4">

        <button
          onClick={() => setFilter("ALL")}
          className="px-3 py-1 rounded bg-gray-200"
        >
          All
        </button>

        <button
          onClick={() => setFilter("PENDING")}
          className="px-3 py-1 rounded bg-orange-200"
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("APPROVED")}
          className="px-3 py-1 rounded bg-green-200"
        >
          Approved
        </button>

      </div>

      {/* LIST */}

      {!loading && (

        <div className="grid gap-4">

          {paginatedAppointments.map(a => (

            <div
              key={a.id}
              className="bg-white rounded-lg shadow-sm border p-5"
            >

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">

                <p className="text-sm font-semibold text-gray-800">
                  Doctor: {a.doctor_name}
                </p>

                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${badgeClass(a.status)}`}>
                  {a.status}
                </span>

              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">

                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                  <span>{a.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                  <span>{a.time}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-medium">Reason:</span> {a.reason}
                </div>

              </div>

              {a.status === "Pending" && (
                <button
                  onClick={() => cancelAppointment(a.id)}
                  className="mt-3 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 w-full md:w-auto"
                >
                  Cancel
                </button>
              )}

            </div>

          ))}

        </div>

      )}

    </Layout>

  );

}

export default PatientAppointments;