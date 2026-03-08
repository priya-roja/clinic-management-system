import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

const BASE_URL = "https://clinic-backend-d1b4.onrender.com/api";

function CreateAppointment() {

  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {

  const fetchDoctors = async () => {
    try {

      const res = await API.get("/doctors/");

      setDoctors(res.data);

    } catch (err) {
      console.log("Error loading doctors");
    }
  };

  fetchDoctors();

}, [])

  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("TOKEN:", localStorage.getItem("token"));

    try {
      await API.post(
  "/patient/appointments/",

        {
          doctor,
          date,
          time,
          reason
        },
        
         
        
      );

      toast.success("Appointment requested successfully");

      setDoctor("");
      setDate("");
      setTime("");
      setReason("");

    } catch (err) {

      toast.error("Failed to request appointment");

    }

  };

  return (

    <Layout role="Patient">

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create Appointment
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm border max-w-md space-y-4"
      >

        {/* Doctor */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Select Doctor
          </label>

          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          >

            <option value="">select doctor</option>

            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.user.username}
              </option>
            ))}

          </select>

        </div>

        {/* Date */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Appointment Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

        </div>

        {/* Time */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Appointment Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

        </div>

        {/* Reason */}

        <div>

          <label className="block text-sm text-gray-600 mb-1">
            Reason
          </label>

          <input
            type="text"
            placeholder="Fever, headache, checkup..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Book Appointment
        </button>

      </form>

    </Layout>

  );

}

export default CreateAppointment;