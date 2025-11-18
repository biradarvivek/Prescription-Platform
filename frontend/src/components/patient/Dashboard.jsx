import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, UserPlus, FileText, ArrowRight } from "lucide-react";
import api from "../../utils/api";

const PatientDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await api.get("/consultations/my-consultations");
      console.log("consultations", response);
      setConsultations(response.data.consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Consultations",
      value: consultations.length,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pending",
      value: consultations.filter((c) => c.status === "pending").length,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Completed",
      value: consultations.filter((c) => c.status === "completed").length,
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Patient Dashboard
          </h1>
          <p className="text-white/70">Manage your healthcare journey</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <Link
            to="/patient/doctors"
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-primary-500/50 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Find Doctors
                </h3>
                <p className="text-white/70">
                  Book consultation with specialists
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  My Prescriptions
                </h3>
                <p className="text-white/70">View your medical prescriptions</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Recent Consultations
            </h2>
            <Link
              to="/patient/doctors"
              className="flex items-center space-x-2 text-primary-300 hover:text-primary-200 transition-colors duration-200"
            >
              <span>Book New</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.slice(0, 5).map((consultation, index) => (
                <motion.div
                  key={consultation._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        consultation.status === "completed"
                          ? "bg-green-500"
                          : consultation.status === "in-progress"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <h3 className="text-white font-semibold">
                        Dr. {consultation.doctor?.name}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {consultation.doctor?.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-sm capitalize ${
                        consultation.status === "completed"
                          ? "text-green-400"
                          : consultation.status === "in-progress"
                          ? "text-amber-400"
                          : "text-blue-400"
                      }`}
                    >
                      {consultation.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">No consultations yet</p>
              <Link
                to="/patient/doctors"
                className="inline-flex items-center space-x-2 text-primary-300 hover:text-primary-200 mt-2"
              >
                <span>Book your first consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
