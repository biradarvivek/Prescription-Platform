import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import api from "../../utils/api";

const ConsultationForm = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");

  const [formData, setFormData] = useState({
    doctor: doctorId,
    currentIllnessHistory: "",
    recentSurgery: {
      surgery: "",
      timeSpan: "",
    },
    familyMedicalHistory: {
      diabetics: "Non-Diabetic",
      allergies: "",
      others: "",
    },
    payment: {
      transactionId: "",
    },
  });

  const steps = [
    { number: 1, title: "Health Info", description: "Current health details" },
    {
      number: 2,
      title: "Medical History",
      description: "Family medical background",
    },
    { number: 3, title: "Payment", description: "Complete payment" },
  ];

  useEffect(() => {
    const getQR = async () => {
      const res = await api.get("/consultations/payment-qr");
      setQrCode(res.data.qr);
    };
    getQR();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("recentSurgery.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        recentSurgery: { ...prev.recentSurgery, [field]: value },
      }));
    } else if (name.startsWith("familyMedicalHistory.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        familyMedicalHistory: { ...prev.familyMedicalHistory, [field]: value },
      }));
    } else if (name.startsWith("payment.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        payment: { ...prev.payment, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("formdata", formData);
      await api.post("/consultations", formData);
      navigate("/patient/dashboard", {
        state: { message: "Consultation booked successfully!" },
      });
    } catch (error) {
      console.error("Error submitting consultation:", error);
      alert("Error submitting consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-white mb-2">
        Current Health Information
      </h3>

      <div>
        <label className="block text-white/80 font-medium mb-3">
          Current Illness History
        </label>
        <textarea
          name="currentIllnessHistory"
          value={formData.currentIllnessHistory}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Describe your current symptoms, duration, and any concerns..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 font-medium mb-3">
            Recent Surgery (if any)
          </label>
          <input
            type="text"
            name="recentSurgery.surgery"
            value={formData.recentSurgery.surgery}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Type of surgery"
          />
        </div>
        <div>
          <label className="block text-white/80 font-medium mb-3">
            Time Span
          </label>
          <input
            type="text"
            name="recentSurgery.timeSpan"
            value={formData.recentSurgery.timeSpan}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., 6 months ago"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-white mb-2">
        Family Medical History
      </h3>

      <div>
        <label className="block text-white/80 font-medium mb-3">
          Diabetics in Family
        </label>
        <div className="flex space-x-6">
          {["Diabetic", "Non-Diabetic"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="familyMedicalHistory.diabetics"
                value={option}
                checked={formData.familyMedicalHistory.diabetics === option}
                onChange={handleChange}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white/80 font-medium mb-3">
          Any Allergies
        </label>
        <input
          type="text"
          name="familyMedicalHistory.allergies"
          value={formData.familyMedicalHistory.allergies}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          placeholder="List any allergies (food, medication, etc.)"
        />
      </div>

      <div>
        <label className="block text-white/80 font-medium mb-3">
          Other Medical History
        </label>
        <textarea
          name="familyMedicalHistory.others"
          value={formData.familyMedicalHistory.others}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Any other relevant family medical history..."
        />
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-white mb-2">Payment</h3>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="text-center mb-6">
          <CreditCard className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <p className="text-white/80 mb-2">Consultation Fee</p>
          <p className="text-3xl font-bold text-white">₹500</p>
        </div>

        <div className="bg-black/30 rounded-xl p-6 mb-6">
          {qrCode ? (
            <img
              src={qrCode}
              alt="UPI QR"
              className="w-48 h-48 mx-auto mb-4 rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 mx-auto mb-4 border border-white/20 rounded-lg animate-pulse" />
          )}
          <p className="text-white/70 text-center text-sm">
            Scan this QR code with your UPI app to complete payment
          </p>
        </div>

        <div>
          <label className="block text-white/80 font-medium mb-3">
            Transaction ID
          </label>
          <input
            type="text"
            name="payment.transactionId"
            value={formData.payment.transactionId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter UPI transaction ID"
          />
          <p className="text-white/50 text-sm mt-2">
            Please enter the transaction ID from your payment confirmation
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Book Consultation
          </h1>
          <p className="text-white/70">Complete your consultation request</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      step >= stepItem.number
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "bg-white/10 border-white/20 text-white/50"
                    }`}
                  >
                    {step > stepItem.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{stepItem.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${
                        step >= stepItem.number ? "text-white" : "text-white/50"
                      }`}
                    >
                      {stepItem.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {stepItem.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all duration-200 ${
                      step > stepItem.number ? "bg-primary-500" : "bg-white/20"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            {step > 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </motion.button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 ml-auto"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Booking</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;
