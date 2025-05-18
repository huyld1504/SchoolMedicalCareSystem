import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMedicationById,
  recordAdministration,
  recordSkippedMedication,
} from "../../services/medicationAdministrationService";

function MedicationAdministrationRecord() {
  const { medicationId } = useParams();
  const navigate = useNavigate();
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // State for form values
  const [formData, setFormData] = useState({
    administeredBy: "Nurse Sarah", // In a real app, this would come from auth context
    dosage: "",
    actualDosage: "",
    administrationTime: currentTime,
    notes: "",
    witnessed: false,
    witnessName: "",
    studentReaction: "None",
    followupRequired: false,
    followupNotes: "",
    medicationLot: "",
    medicationExpiry: "",
    vitals: {
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      painLevel: "",
    },
    remainingDoses: null,
  });

  // Medication data fetched from service
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch medication data
  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const medicationData = await getMedicationById(medicationId);
        setMedication(medicationData);
        setFormData((prev) => ({
          ...prev,
          dosage: medicationData.dosage,
          actualDosage: medicationData.dosage,
          remainingDoses: medicationData.remainingDoses,
        }));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch medication:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMedication();
  }, [medicationId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name.startsWith("vitals.")) {
      const vitalName = name.split(".")[1];
      setFormData({
        ...formData,
        vitals: {
          ...formData.vitals,
          [vitalName]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Record administration using our service
      const administrationData = {
        date: currentDate,
        ...formData,
      };

      // Call the service to record the administration
      const updatedMedication = await recordAdministration(
        medicationId,
        administrationData
      );

      // Update local state for immediate UI feedback
      setMedication(updatedMedication);

      // Show success message (in a real app this would be a toast notification)
      alert("Medication administered successfully!");

      // Redirect to dashboard
      navigate("/nurse/medications/dashboard");
    } catch (err) {
      console.error("Failed to record administration:", err);
      setError("Failed to record administration: " + err.message);
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Record medication as skipped
    const skipReason = prompt("Enter reason for skipping medication:");
    if (!skipReason) return; // Cancel if no reason provided

    try {
      setLoading(true);

      const skipData = {
        date: currentDate,
        time: currentTime,
        reason: skipReason,
        administeredBy: formData.administeredBy,
      };

      // Call the service to record the skipped medication
      const updatedMedication = await recordSkippedMedication(
        medicationId,
        skipData
      );

      // Update local state for immediate UI feedback
      setMedication(updatedMedication);

      // Show success message
      alert("Medication skipped successfully!");

      // Redirect to dashboard
      navigate("/nurse/medications/dashboard");
    } catch (err) {
      console.error("Failed to record skipped medication:", err);
      setError("Failed to record skipped medication: " + err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!medication && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Medication not found. Please check the ID and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Record Medication Administration
        </h1>
        <p className="text-gray-600">
          Complete the form to document medication administration
        </p>
      </div>

      {/* Student and Medication Info */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{medication.studentName}</h2>
              <p className="text-gray-500">
                ID: {medication.studentId} | {medication.grade}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {medication.status}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Medication Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Medication</p>
                <p className="font-medium">{medication.medication}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Prescribed Dosage
                </p>
                <p className="font-medium">{medication.dosage}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Scheduled Time
                </p>
                <p className="font-medium">{medication.time}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Instructions
                </p>
                <p className="font-medium">{medication.instructions}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Remaining Doses
                </p>
                <p
                  className={`font-medium ${
                    medication.remainingDoses <= 3 ? "text-red-600" : ""
                  }`}
                >
                  {medication.remainingDoses}{" "}
                  {medication.remainingDoses === 1 ? "dose" : "doses"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Prescriber Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Prescribed By
                </p>
                <p className="font-medium">{medication.prescribedBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Info
                </p>
                <p className="font-medium">{medication.contactInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Administration Details</h2>
          <p className="text-gray-500">
            Record details of the medication administration
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Administration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="administeredBy"
              >
                Administered By
              </label>
              <input
                type="text"
                id="administeredBy"
                name="administeredBy"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.administeredBy}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="administrationTime"
              >
                Time of Administration
              </label>
              <input
                type="time"
                id="administrationTime"
                name="administrationTime"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.administrationTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="actualDosage"
              >
                Actual Dosage Administered
              </label>
              <input
                type="text"
                id="actualDosage"
                name="actualDosage"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.actualDosage}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="medicationLot"
              >
                Medication Lot Number (Optional)
              </label>
              <input
                type="text"
                id="medicationLot"
                name="medicationLot"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.medicationLot}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="medicationExpiry"
              >
                Medication Expiry Date (Optional)
              </label>
              <input
                type="date"
                id="medicationExpiry"
                name="medicationExpiry"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.medicationExpiry}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Witness Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="witnessed"
                name="witnessed"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.witnessed}
                onChange={handleChange}
              />
              <label
                htmlFor="witnessed"
                className="ml-2 block text-sm text-gray-900"
              >
                Witnessed by another staff member
              </label>
            </div>

            {formData.witnessed && (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="witnessName"
                >
                  Witness Name
                </label>
                <input
                  type="text"
                  id="witnessName"
                  name="witnessName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.witnessName}
                  onChange={handleChange}
                  required={formData.witnessed}
                />
              </div>
            )}
          </div>

          {/* Student Reaction and Follow-up */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="studentReaction"
            >
              Student's Reaction
            </label>
            <select
              id="studentReaction"
              name="studentReaction"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.studentReaction}
              onChange={handleChange}
            >
              <option value="None">None - No reaction</option>
              <option value="Mild">Mild - Minor discomfort</option>
              <option value="Moderate">Moderate - Noticeable reaction</option>
              <option value="Severe">
                Severe - Requires immediate attention
              </option>
            </select>
          </div>

          {formData.studentReaction !== "None" && (
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="followupRequired"
                  name="followupRequired"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.followupRequired}
                  onChange={handleChange}
                />
                <label
                  htmlFor="followupRequired"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Follow-up required
                </label>
              </div>

              {formData.followupRequired && (
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="followupNotes"
                  >
                    Follow-up Notes
                  </label>
                  <textarea
                    id="followupNotes"
                    name="followupNotes"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.followupNotes}
                    onChange={handleChange}
                    required={formData.followupRequired}
                  ></textarea>
                </div>
              )}
            </div>
          )}

          {/* Vitals (expandable section) */}
          <div className="border rounded-md overflow-hidden">
            <details>
              <summary className="bg-gray-50 px-4 py-3 cursor-pointer font-medium">
                Record Vitals (optional)
              </summary>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="vitals.temperature"
                  >
                    Temperature (°F)
                  </label>
                  <input
                    type="text"
                    id="vitals.temperature"
                    name="vitals.temperature"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.vitals.temperature}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="vitals.bloodPressure"
                  >
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    id="vitals.bloodPressure"
                    name="vitals.bloodPressure"
                    placeholder="e.g., 120/80"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.vitals.bloodPressure}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="vitals.heartRate"
                  >
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="text"
                    id="vitals.heartRate"
                    name="vitals.heartRate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.vitals.heartRate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="vitals.respiratoryRate"
                  >
                    Respiratory Rate (breaths/min)
                  </label>
                  <input
                    type="text"
                    id="vitals.respiratoryRate"
                    name="vitals.respiratoryRate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.vitals.respiratoryRate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="vitals.oxygenSaturation"
                  >
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="text"
                    id="vitals.oxygenSaturation"
                    name="vitals.oxygenSaturation"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.vitals.oxygenSaturation}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="vitals.painLevel"
                  >
                    Pain Level (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    id="vitals.painLevel"
                    name="vitals.painLevel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.vitals.painLevel}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Notes */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="notes"
            >
              Administration Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter any notes about this administration"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-yellow-300 shadow-sm text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
            onClick={handleSkip}
          >
            Skip Administration
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Record Administration
          </button>
        </div>
      </form>

      {/* Previous Administration History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Administration History</h2>
        </div>
        <div className="overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medication.history.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.administered
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.administered ? "Administered" : "Skipped"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MedicationAdministrationRecord;
