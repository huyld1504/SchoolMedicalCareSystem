import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MedicationInventory() {
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add", "edit", "restock"
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Form state for medication
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    category: "",
    dose: "",
    form: "",
    quantity: 0,
    minQuantity: 0,
    expiryDate: "",
    location: "",
    notes: "",
    restockQuantity: 0, // For restock form
  });

  // Sample medication data
  const sampleMedications = [
    {
      id: 1,
      name: "Ibuprofen",
      genericName: "Ibuprofen",
      category: "Pain Relief",
      dose: "200mg",
      form: "Tablet",
      quantity: 120,
      minQuantity: 30,
      expiryDate: "2024-05-30",
      location: "Main Cabinet",
      notes: "For mild to moderate pain and fever",
      lastRestocked: "2023-04-15",
      usageRate: "Medium",
    },
    {
      id: 2,
      name: "Acetaminophen Children's",
      genericName: "Acetaminophen",
      category: "Pain Relief",
      dose: "160mg/5ml",
      form: "Liquid",
      quantity: 8,
      minQuantity: 5,
      expiryDate: "2024-03-20",
      location: "Refrigerator",
      notes: "For children's pain and fever",
      lastRestocked: "2023-04-10",
      usageRate: "High",
    },
    {
      id: 3,
      name: "Diphenhydramine",
      genericName: "Benadryl",
      category: "Allergy",
      dose: "25mg",
      form: "Tablet",
      quantity: 45,
      minQuantity: 20,
      expiryDate: "2023-12-15",
      location: "Main Cabinet",
      notes: "For allergic reactions",
      lastRestocked: "2023-05-01",
      usageRate: "Low",
    },
    {
      id: 4,
      name: "Albuterol Inhaler",
      genericName: "Albuterol",
      category: "Respiratory",
      dose: "90mcg/actuation",
      form: "Inhaler",
      quantity: 5,
      minQuantity: 3,
      expiryDate: "2024-08-10",
      location: "Emergency Cabinet",
      notes: "For asthma attacks",
      lastRestocked: "2023-05-15",
      usageRate: "Medium",
    },
    {
      id: 5,
      name: "Epinephrine Auto-Injector",
      genericName: "Epinephrine",
      category: "Emergency",
      dose: "0.3mg",
      form: "Auto-Injector",
      quantity: 2,
      minQuantity: 2,
      expiryDate: "2023-11-30",
      location: "Emergency Cabinet",
      notes: "For severe allergic reactions",
      lastRestocked: "2023-03-20",
      usageRate: "Low",
    },
    {
      id: 6,
      name: "Hydrocortisone Cream",
      genericName: "Hydrocortisone",
      category: "Topical",
      dose: "1%",
      form: "Cream",
      quantity: 4,
      minQuantity: 2,
      expiryDate: "2023-09-15",
      location: "First Aid Cabinet",
      notes: "For skin irritation and rashes",
      lastRestocked: "2023-02-10",
      usageRate: "Medium",
    },
    {
      id: 7,
      name: "Amoxicillin",
      genericName: "Amoxicillin",
      category: "Antibiotic",
      dose: "500mg",
      form: "Capsule",
      quantity: 0,
      minQuantity: 10,
      expiryDate: "2023-10-20",
      location: "Medication Cabinet",
      notes: "Need prescription for use",
      lastRestocked: "2023-01-15",
      usageRate: "Low",
    },
  ];

  // Load medication data
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        setMedications(sampleMedications);
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortBy === field) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return null;
  };

  // Filter and sort medications
  const filteredMedications = medications
    .filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(search.toLowerCase()) ||
        med.genericName.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || med.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "low" && med.quantity <= med.minQuantity) ||
        (statusFilter === "out" && med.quantity === 0) ||
        (statusFilter === "expiring" &&
          new Date(med.expiryDate) <=
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "quantity") {
        comparison = a.quantity - b.quantity;
      } else if (sortBy === "expiry") {
        comparison = new Date(a.expiryDate) - new Date(b.expiryDate);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Get unique categories for filter
  const categories = [...new Set(medications.map((med) => med.category))];

  // Handle adding a new medication
  const handleAddMedication = () => {
    setModalType("add");
    setSelectedMedication(null);
    setFormData({
      name: "",
      genericName: "",
      category: "",
      dose: "",
      form: "",
      quantity: 0,
      minQuantity: 0,
      expiryDate: "",
      location: "",
      notes: "",
      restockQuantity: 0,
    });
    setShowModal(true);
  };

  // Handle editing a medication
  const handleEditMedication = (medication) => {
    setModalType("edit");
    setSelectedMedication(medication);
    setFormData({
      name: medication.name,
      genericName: medication.genericName,
      category: medication.category,
      dose: medication.dose,
      form: medication.form,
      quantity: medication.quantity,
      minQuantity: medication.minQuantity,
      expiryDate: medication.expiryDate,
      location: medication.location,
      notes: medication.notes,
      restockQuantity: 0,
    });
    setShowModal(true);
  };

  // Handle restocking a medication
  const handleRestockMedication = (medication) => {
    setModalType("restock");
    setSelectedMedication(medication);
    setFormData({
      ...formData,
      name: medication.name,
      restockQuantity: 0,
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value, 10) : value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalType === "add") {
      // Add new medication
      const newMedication = {
        id: Date.now(),
        ...formData,
        lastRestocked: new Date().toISOString().split("T")[0],
        usageRate: "Low",
      };
      setMedications([...medications, newMedication]);
    } else if (modalType === "edit") {
      // Update existing medication
      const updatedMedications = medications.map((med) =>
        med.id === selectedMedication.id ? { ...med, ...formData } : med
      );
      setMedications(updatedMedications);
    } else if (modalType === "restock") {
      // Restock medication
      const updatedMedications = medications.map((med) =>
        med.id === selectedMedication.id
          ? {
            ...med,
            quantity: med.quantity + formData.restockQuantity,
            lastRestocked: new Date().toISOString().split("T")[0],
          }
          : med
      );
      setMedications(updatedMedications);
    }

    setShowModal(false);
    setSelectedMedication(null);
  };

  // Get status badge color
  const getStatusColor = (medication) => {
    if (medication.quantity === 0) {
      return "bg-red-100 text-red-800";
    } else if (medication.quantity <= medication.minQuantity) {
      return "bg-yellow-100 text-yellow-800";
    } else if (
      new Date(medication.expiryDate) <=
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    ) {
      return "bg-orange-100 text-orange-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  // Get status text
  const getStatusText = (medication) => {
    if (medication.quantity === 0) {
      return "Out of Stock";
    } else if (medication.quantity <= medication.minQuantity) {
      return "Low Stock";
    } else if (
      new Date(medication.expiryDate) <=
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    ) {
      return "Expiring Soon";
    } else {
      return "In Stock";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Medication Inventory</h1>
          <p className="text-gray-600">Manage and track medication stock levels</p>
        </div>

        <div className="flex gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-150"
            onClick={handleAddMedication}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add Medication
          </button>

          <Link
            to="/nurse/medications/reports"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-150"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Generate Report
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Medications
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or generic name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="categoryFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Medications</h2>
          <div className="text-sm text-gray-500">
            {filteredMedications.length} items found
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMedications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No medications found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Medication {getSortIndicator("name")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity {getSortIndicator("quantity")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("expiry")}
                  >
                    Expiry Date {getSortIndicator("expiry")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {medication.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medication.genericName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>Category: {medication.category}</div>
                        <div>Dose: {medication.dose}</div>
                        <div>Form: {medication.form}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {medication.quantity} units
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {medication.minQuantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        Location: {medication.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          medication
                        )}`}
                      >
                        {getStatusText(medication)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(medication.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-green-600 hover:text-green-900 mr-4"
                        onClick={() => handleRestockMedication(medication)}
                      >
                        Restock
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEditMedication(medication)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit/Restock Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">
                {modalType === "add"
                  ? "Add New Medication"
                  : modalType === "edit"
                    ? "Edit Medication"
                    : "Restock Medication"}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {/* Show different forms based on modalType */}
                {modalType === "restock" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication
                      </label>
                      <div className="text-gray-900 font-medium">
                        {selectedMedication?.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Quantity
                      </label>
                      <div className="text-gray-900">
                        {selectedMedication?.quantity} units
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="restockQuantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity to Add<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="restockQuantity"
                        name="restockQuantity"
                        min="1"
                        value={formData.restockQuantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Expiry Date
                      </label>
                      <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Leave blank to keep current expiry date
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Medication Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="genericName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Generic Name
                      </label>
                      <input
                        type="text"
                        id="genericName"
                        name="genericName"
                        value={formData.genericName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Category<span className="text-red-500">*</span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Pain Relief">Pain Relief</option>
                          <option value="Allergy">Allergy</option>
                          <option value="Respiratory">Respiratory</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Topical">Topical</option>
                          <option value="Antibiotic">Antibiotic</option>
                          <option value="Gastrointestinal">Gastrointestinal</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="form"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Form<span className="text-red-500">*</span>
                        </label>
                        <select
                          id="form"
                          name="form"
                          value={formData.form}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Form</option>
                          <option value="Tablet">Tablet</option>
                          <option value="Capsule">Capsule</option>
                          <option value="Liquid">Liquid</option>
                          <option value="Inhaler">Inhaler</option>
                          <option value="Cream">Cream</option>
                          <option value="Ointment">Ointment</option>
                          <option value="Auto-Injector">Auto-Injector</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="dose"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Dose
                      </label>
                      <input
                        type="text"
                        id="dose"
                        name="dose"
                        value={formData.dose}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Quantity<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          min="0"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="minQuantity"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Minimum Stock Level<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="minQuantity"
                          name="minQuantity"
                          min="0"
                          value={formData.minQuantity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Expiry Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Storage Location<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows="2"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMedication(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {modalType === "add"
                    ? "Add Medication"
                    : modalType === "edit"
                      ? "Update Medication"
                      : "Confirm Restock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {medications.filter(
        (med) => med.quantity === 0 || med.quantity <= med.minQuantity
      ).length > 0 && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>The following medications require attention:</p>
                  <ul className="list-disc list-inside mt-1">
                    {medications
                      .filter(
                        (med) => med.quantity === 0 || med.quantity <= med.minQuantity
                      )
                      .slice(0, 5)
                      .map((med) => (
                        <li key={med.id}>
                          {med.name} (
                          {med.quantity === 0
                            ? "Out of stock"
                            : `Low stock: ${med.quantity} units`}
                          )
                        </li>
                      ))}
                    {medications.filter(
                      (med) => med.quantity === 0 || med.quantity <= med.minQuantity
                    ).length > 5 && (
                        <li>
                          And{" "}
                          {
                            medications.filter(
                              (med) => med.quantity === 0 || med.quantity <= med.minQuantity
                            ).length - 5
                          }{" "}
                          more...
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Expiring Medications Alert */}
      {medications.filter(
        (med) =>
          new Date(med.expiryDate) <=
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) &&
          new Date(med.expiryDate) > new Date()
      ).length > 0 && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Expiring Soon
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>The following medications are expiring within 90 days:</p>
                  <ul className="list-disc list-inside mt-1">
                    {medications
                      .filter(
                        (med) =>
                          new Date(med.expiryDate) <=
                          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) &&
                          new Date(med.expiryDate) > new Date()
                      )
                      .slice(0, 5)
                      .map((med) => (
                        <li key={med.id}>
                          {med.name} (Expires: {formatDate(med.expiryDate)})
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default MedicationInventory;
