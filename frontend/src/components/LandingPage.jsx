import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Stethoscope,
  User,
  ArrowRight,
  Heart,
  Shield,
  Clock,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Consult doctors anytime, anywhere",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical data is completely secure",
    },
    {
      icon: Heart,
      title: "Expert Care",
      description: "Verified doctors and specialists",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MediCare</span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              Doctor Login
            </Link>
            <Link
              to="/login"
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              Patient Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-white mb-6"
          >
            Your Health, Our
            <span className="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Priority
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 mb-12 max-w-3xl mx-auto"
          >
            Experience seamless healthcare with our online prescription
            platform. Connect with expert doctors and manage your health journey
            effortlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-green-500/50 transition-all duration-300 group cursor-pointer"
            >
              <Link to="/patient/signup" className="block">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  I'm a Patient
                </h3>
                <p className="text-white/70 mb-6">
                  Book consultations, get prescriptions, and manage your health
                  records securely.
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-300 group-hover:text-green-200 transition-colors duration-200">
                  <span className="font-semibold">Get Started as Patient</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-primary-500/50 transition-all duration-300 group cursor-pointer"
            >
              <Link to="/doctor/signup" className="block">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  I'm a Doctor
                </h3>
                <p className="text-white/70 mb-6">
                  Join our platform to consult patients and manage prescriptions
                  efficiently.
                </p>
                <div className="flex items-center justify-center space-x-2 text-primary-300 group-hover:text-primary-200 transition-colors duration-200">
                  <span className="font-semibold">Join as Doctor</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <feature.icon className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
