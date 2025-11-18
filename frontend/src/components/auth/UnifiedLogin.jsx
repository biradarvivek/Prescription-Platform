import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UnifiedLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("formdata login", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(`/${formData.role}/dashboard`);
    } else {
      setError(result.message);
    }
    setLoading(false);
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
            className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
              formData.role === "doctor"
                ? "bg-gradient-to-r from-primary-500 to-purple-600"
                : "bg-gradient-to-r from-green-500 to-emerald-600"
            }`}
          >
            {formData.role === "doctor" ? (
              <Stethoscope className="h-10 w-10 text-white" />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
          </motion.div>
          <h2 className="text-3xl font-bold text-white">
            {formData.role === "doctor" ? "Doctor" : "Patient"} Login
          </h2>
          <p className="mt-2 text-white/70">
            Welcome back to your{" "}
            {formData.role === "doctor" ? "practice" : "health journey"}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "patient" })}
            className={`flex-1 py-3 rounded-xl border transition-all duration-200 ${
              formData.role === "patient"
                ? "bg-green-500/20 border-green-500 text-green-300"
                : "bg-white/5 border-white/10 text-white/70 hover:border-green-500/30"
            }`}
          >
            <User className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm">Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "doctor" })}
            className={`flex-1 py-3 rounded-xl border transition-all duration-200 ${
              formData.role === "doctor"
                ? "bg-primary-500/20 border-primary-500 text-primary-300"
                : "bg-white/5 border-white/10 text-white/70 hover:border-primary-500/30"
            }`}
          >
            <Stethoscope className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm">Doctor</span>
          </button>
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

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Email Address"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-12"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50 ${
              formData.role === "doctor"
                ? "bg-gradient-to-r from-primary-500 to-purple-600"
                : "bg-gradient-to-r from-green-500 to-emerald-600"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  Sign In as {formData.role === "doctor" ? "Doctor" : "Patient"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>

          <div className="text-center space-y-2">
            <p className="text-white/70">
              Don't have an account?{" "}
              <Link
                to={
                  formData.role === "doctor"
                    ? "/doctor/signup"
                    : "/patient/signup"
                }
                className={`hover:underline ${
                  formData.role === "doctor"
                    ? "text-primary-300"
                    : "text-green-300"
                }`}
              >
                Sign up as {formData.role === "doctor" ? "Doctor" : "Patient"}
              </Link>
            </p>
            <Link
              to="/"
              className="text-white/50 hover:text-white transition-colors duration-200 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UnifiedLogin;
