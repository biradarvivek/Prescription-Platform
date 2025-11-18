import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock, ArrowRight } from "lucide-react";
import api from "../../utils/api";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/doctors");
      console.log("doctors", response);
      setDoctors(response.data.doctors);
      setFilteredDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Find Doctors</h1>
          <p className="text-white/70">
            Book consultation with specialist doctors
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-primary-500/50 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    {doctor.profilePicture ? (
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {doctor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-primary-300 font-medium">
                      {doctor.specialty}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="text-white/70 text-sm">4.8</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span className="text-white/70 text-sm">
                          {doctor.yearsOfExperience} years
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      Available for Online Consultation
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Response time: 2-4 hours</span>
                  </div>
                </div>
                <Link
                  to={`/patient/consult/${doctor._id}`}
                  className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                >
                  <span>Consult Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No doctors found
            </h3>
            <p className="text-white/70">Try adjusting your search terms</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
