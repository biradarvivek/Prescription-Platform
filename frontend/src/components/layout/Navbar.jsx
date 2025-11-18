import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  LogOut,
  Stethoscope,
  UserPlus,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems =
    user?.role === "doctor"
      ? [
          {
            path: "/doctor/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            path: "/doctor/prescriptions",
            label: "Prescriptions",
            icon: FileText,
          },
        ]
      : [
          {
            path: "/patient/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          { path: "/patient/doctors", label: "Find Doctors", icon: UserPlus },
        ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/10 backdrop-blur-md border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MediCare</span>
          </Link>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="h-5 w-5" />
              <span className="capitalize">{user?.role}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
