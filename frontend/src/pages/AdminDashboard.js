import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);

  const role = "Admin";

  useEffect(() => {

    const fetchData = async () => {

      try {

        const appointmentsRes = await API.get("/admin/appointments/");
        setAppointments(appointmentsRes.data);

        const statsRes = await API.get("/admin/stats/");
        setStats(statsRes.data);

      } catch (err) {

        console.log("Admin error", err);

      }

    };

    fetchData();

  }, []);

  const chartData = stats ? {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Appointments",
        data: [
          stats.pending_appointments,
          stats.approved_appointments,
          stats.rejected_appointments
        ],
        backgroundColor: [
          "#f59e0b",
          "#22c55e",
          "#ef4444"
        ],
        borderWidth: 1
      }
    ]
  } : null;

  return (

    <Layout role={role}>

      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Admin Dashboard
      </h2>

      <div className="bg-white shadow rounded-lg p-4">

        {stats && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-sm text-gray-500">Doctors</p>
              <p className="text-lg md:text-xl font-semibold">{stats.doctors}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-sm text-gray-500">Patients</p>
              <p className="text-lg md:text-xl font-semibold">{stats.patients}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-lg md:text-xl font-semibold">{stats.appointments}</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg md:text-xl font-semibold text-orange-600">
                {stats.pending}
              </p>
            </div>

          </div>

        )}

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead>

              <tr className="border-b">

                <th className="text-left py-2 px-2">Patient</th>
                <th className="text-left py-2 px-2">Doctor</th>
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Status</th>

              </tr>

            </thead>

            <tbody>

              {appointments.map((a) => (

                <tr key={a.id} className="border-b">

                  <td className="py-2 px-2">{a.patient}</td>
                  <td className="py-2 px-2">{a.doctor}</td>
                  <td className="py-2 px-2">{a.date}</td>
                  <td className="py-2 px-2">{a.time}</td>
                  <td className="py-2 px-2">{a.status}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* CHART */}

      <div className="bg-white p-6 rounded-lg shadow border mt-6">

        <h3 className="text-lg font-semibold mb-4">
          Appointment Analytics
        </h3>

        <div className="w-full max-w-sm mx-auto">
          {chartData && <Pie data={chartData} />}
        </div>

      </div>

    </Layout>

  );

}

export default AdminDashboard;