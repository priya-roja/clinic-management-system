import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

function DoctorProfile() {

  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {

    const fetchDoctor = async () => {

      try {

        const res = await API.get(`/doctors/${id}/profile/`);
        setDoctor(res.data);

      } catch (err) {

        console.error("Error fetching doctor profile", err);

      }

    };

    fetchDoctor();

  }, [id]);

  if (!doctor) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (

    <Layout role="Patient">

      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Dr. {doctor.name}
        </h2>

        <p className="text-gray-600 mb-2">
          <strong>Specialization:</strong> {doctor.specialization}
        </p>

        <p className="text-gray-600">
          <strong>Experience:</strong> {doctor.experience} years
        </p>

      </div>

    </Layout>

  );

}

export default DoctorProfile;