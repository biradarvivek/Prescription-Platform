import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, FileText, Download, Edit, Send, X } from "lucide-react";
import api from "../../utils/api";

const PrescriptionPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptions, setPrescriptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    consultation: "",
    careToBeTaken: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await api.get("/doctors/consultations");
      setConsultations(response.data.consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (consultationId) => {
    try {
      const response = await api.get(
        `/prescriptions/consultation/${consultationId}`
      );
      setPrescriptions((prev) => ({
        ...prev,
        [consultationId]: response.data.prescriptions,
      }));
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleAddMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index][field] = value;
    setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));
  };

  const handleRemoveMedicine = (index) => {
    if (formData.medicines.length > 1) {
      const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));
    }
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    try {
      await api.post("/prescriptions", formData);
      setShowPrescriptionForm(false);
      setFormData({
        consultation: "",
        careToBeTaken: "",
        medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
      });
      fetchPrescriptions(selectedConsultation._id);
      fetchConsultations(); // Refresh consultations to update status
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Error creating prescription. Please try again.");
    }
  };

  // inside PrescriptionPage.jsx
  const handleGeneratePDF = async (prescriptionId) => {
    try {
      // request binary response
      const response = await api.get(
        `/prescriptions/${prescriptionId}/generate-pdf?download=true`,
        { responseType: "blob" }
      );

      // create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription-${prescriptionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.patient?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.patient?.age.toString().includes(searchTerm)
  );

  const pendingConsultations = filteredConsultations.filter(
    (c) => c.status === "pending"
  );
  const completedConsultations = filteredConsultations.filter(
    (c) => c.status === "completed"
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Prescription Management
          </h1>
          <p className="text-white/70">
            Manage patient consultations and prescriptions
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
              placeholder="Search patients by name or age..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Pending Consultations
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : pendingConsultations.length > 0 ? (
                <div className="space-y-4">
                  {pendingConsultations.map((consultation, index) => (
                    <motion.div
                      key={consultation._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-primary-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {consultation.patient?.name}
                          </h3>
                          <p className="text-white/70">
                            Age: {consultation.patient?.age}
                          </p>
                          <p className="text-white/60 text-sm mt-1 line-clamp-2">
                            {consultation.currentIllnessHistory}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setShowPrescriptionForm(true);
                            setFormData((prev) => ({
                              ...prev,
                              consultation: consultation._id,
                            }));
                            fetchPrescriptions(consultation._id);
                          }}
                          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-200 group-hover:scale-105"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Prescribe</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">No pending consultations</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                Completed Consultations
              </h2>

              {completedConsultations.length > 0 ? (
                <div className="space-y-4">
                  {completedConsultations.map((consultation, index) => (
                    <motion.div
                      key={consultation._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">
                            {consultation.patient?.name}
                          </h3>
                          <p className="text-white/70">
                            Age: {consultation.patient?.age}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {prescriptions[consultation._id]?.map(
                            (prescription) => (
                              <button
                                key={prescription._id}
                                onClick={() =>
                                  handleGeneratePDF(prescription._id)
                                }
                                className="flex items-center space-x-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 px-3 py-1 rounded-lg transition-all duration-200 border border-green-500/30"
                              >
                                <Download className="h-3 w-3" />
                                <span className="text-sm">PDF</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70">No completed consultations</p>
                </div>
              )}
            </motion.div>
          </div>

          <AnimatePresence>
            {showPrescriptionForm && selectedConsultation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Write Prescription
                    </h2>
                    <p className="text-white/70">
                      for {selectedConsultation.patient?.name} (Age:{" "}
                      {selectedConsultation.patient?.age})
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPrescriptionForm(false)}
                    className="text-white/50 hover:text-white transition-colors duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitPrescription} className="space-y-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-3">
                      Care to be taken *
                    </label>
                    <textarea
                      value={formData.careToBeTaken}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          careToBeTaken: e.target.value,
                        }))
                      }
                      required
                      rows="4"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Provide detailed care instructions, lifestyle changes, and follow-up advice..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-white/80 font-medium">
                        Medicines
                      </label>
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="flex items-center space-x-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 hover:text-primary-200 px-3 py-1 rounded-lg transition-all duration-200 border border-primary-500/30"
                      >
                        <Plus className="h-3 w-3" />
                        <span className="text-sm">Add Medicine</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.medicines.map((medicine, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="grid grid-cols-12 gap-2 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <input
                            type="text"
                            placeholder="Medicine name"
                            value={medicine.name}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="col-span-4 px-3 py-2 bg-white/10 border border-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Dosage"
                            value={medicine.dosage}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "dosage",
                                e.target.value
                              )
                            }
                            className="col-span-2 px-3 py-2 bg-white/10 border border-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Frequency"
                            value={medicine.frequency}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                            className="col-span-3 px-3 py-2 bg-white/10 border border-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Duration"
                            value={medicine.duration}
                            onChange={(e) =>
                              handleMedicineChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            className="col-span-2 px-3 py-2 bg-white/10 border border-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                          />
                          {formData.medicines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(index)}
                              className="col-span-1 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex-1 justify-center"
                    >
                      <Send className="h-4 w-4" />
                      <span>Save & Send</span>
                    </motion.button>
                  </div>
                </form>

                {prescriptions[selectedConsultation._id] &&
                  prescriptions[selectedConsultation._id].length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Previous Prescriptions
                      </h3>
                      <div className="space-y-3">
                        {prescriptions[selectedConsultation._id].map(
                          (prescription) => (
                            <div
                              key={prescription._id}
                              className="p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <p className="text-white text-sm mb-2 line-clamp-2">
                                {prescription.careToBeTaken}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70 text-xs">
                                  {prescription.medicines.length} medicines
                                </span>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleGeneratePDF(prescription._id)
                                    }
                                    className="flex items-center space-x-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 px-2 py-1 rounded text-xs transition-all duration-200 border border-green-500/30"
                                  >
                                    <Download className="h-3 w-3" />
                                    <span>PDF</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setFormData({
                                        consultation:
                                          prescription.consultation._id,
                                        careToBeTaken:
                                          prescription.careToBeTaken,
                                        medicines: prescription.medicines,
                                      });
                                    }}
                                    className="flex items-center space-x-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-2 py-1 rounded text-xs transition-all duration-200 border border-blue-500/30"
                                  >
                                    <Edit className="h-3 w-3" />
                                    <span>Edit</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
