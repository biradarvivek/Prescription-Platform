import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Upload, ArrowRight } from "lucide-react";
import api from "../../utils/api";

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    historyOfSurgery: "",
    historyOfIllness: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      if (profilePicture) {
        submitData.append("profilePicture", profilePicture);
      }

      const response = await api.post("/auth/patient/signup", submitData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4"
          >
            <User className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Patient Sign Up</h2>
          <p className="mt-2 text-white/70">Start your healthcare journey</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="hidden"
              />
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center hover:border-green-400 transition-all duration-200 group">
                {profilePicture ? (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-white/50 group-hover:text-green-400" />
                )}
              </div>
            </label>
          </div>

          <div className="space-y-4">
            {[
              { name: "name", type: "text", placeholder: "Full Name" },
              { name: "email", type: "email", placeholder: "Email Address" },
              { name: "password", type: "password", placeholder: "Password" },
              { name: "age", type: "number", placeholder: "Age" },
              { name: "phoneNumber", type: "tel", placeholder: "Phone Number" },
              {
                name: "historyOfSurgery",
                type: "text",
                placeholder: "History of Surgery (comma separated)",
              },
              {
                name: "historyOfIllness",
                type: "text",
                placeholder: "History of Illness (comma separated)",
              },
            ].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <input
                  name={field.name}
                  type={field.type}
                  required={
                    field.name !== "historyOfSurgery" &&
                    field.name !== "historyOfIllness"
                  }
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder={field.placeholder}
                />
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-green-300 hover:text-green-200 transition-colors duration-200"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PatientSignup;
