import React, { useState } from "react";

function MedicationInventory() {
  // Demo data for medication inventory
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Ibuprofen 200mg",
      type: "Tablet",
      category: "Pain Reliever",
      quantity: 45,
      threshold: 20,
      expiryDate: "2024-06-15",
      storage: "Medicine Cabinet",
      lastRestocked: "2023-04-10",
    },
    {
      id: 2,
      name: "Albuterol Inhaler 90mcg",
      type: "Inhaler",
      category: "Bronchodilator",
      quantity: 8,
      threshold: 5,
      expiryDate: "2024-10-23",
      storage: "Refrigerator",
      lastRestocked: "2023-02-15",
    },
    {
      id: 3,
      name: "Cetirizine 5mg",
      type: "Tablet",
      category: "Antihistamine",
      quantity: 12,
      threshold: 15,
      expiryDate: "2023-12-30",
      storage: "Medicine Cabinet",
      lastRestocked: "2023-03-22",
    },
    {
      id: 4,
      name: "Methylphenidate 10mg",
      type: "Tablet",
      category: "Stimulant",
      quantity: 36,
      threshold: 20,
      expiryDate: "2024-02-18",
      storage: "Locked Cabinet",
      lastRestocked: "2023-04-30",
    },
    {
      id: 5,
      name: "First Aid Antiseptic Spray",
      type: "Solution",
      category: "First Aid",
      quantity: 3,
      threshold: 4,
      expiryDate: "2024-08-05",
      storage: "First Aid Kit",
      lastRestocked: "2023-01-10",
    },
    {
      id: 6,
      name: "Hydrocortisone 1% Cream",
      type: "Cream",
      category: "Topical Steroid",
      quantity: 2,
      threshold: 3,
      expiryDate: "2023-09-15",
      storage: "Medicine Cabinet",
      lastRestocked: "2023-02-22",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showRestock, setShowRestock] = useState(false);
  const [showExpiring, setShowExpiring] = useState(false);

  // New medication form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    type: "Tablet",
    category: "Pain Reliever",
    quantity: 0,
    threshold: 10,
    expiryDate: "",
    storage: "Medicine Cabinet",
  });

  // Edit medication state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Get all unique categories
  const categories = [
    "all",
    ...new Set(medications.map((med) => med.category)),
  ];

  // Filter medications based on search term and category
  let filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || med.category === filterCategory;

    const matchesRestock = !showRestock || med.quantity <= med.threshold;

    const matchesExpiring =
      !showExpiring ||
      (new Date(med.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24) <=
        90;

    return (
      matchesSearch && matchesCategory && matchesRestock && matchesExpiring
    );
  });

  // Sort medications
  filteredMedications.sort((a, b) => {
    let comparison = 0;

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === "quantity") {
      comparison = a.quantity - b.quantity;
    } else if (sortField === "expiryDate") {
      comparison = new Date(a.expiryDate) - new Date(b.expiryDate);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, set the new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddMedication = (e) => {
    e.preventDefault();

    // Add new medication with generated ID
    const newId = Math.max(...medications.map((med) => med.id)) + 1;
    const today = new Date().toISOString().split("T")[0];

    setMedications([
      ...medications,
      {
        ...newMedication,
        id: newId,
        lastRestocked: today,
      },
    ]);

    // Reset form
    setNewMedication({
      name: "",
      type: "Tablet",
      category: "Pain Reliever",
      quantity: 0,
      threshold: 10,
      expiryDate: "",
      storage: "Medicine Cabinet",
    });
    setShowAddForm(false);
  };

  const handleUpdateStock = (id, newQuantity) => {
    const today = new Date().toISOString().split("T")[0];

    setMedications(
      medications.map((med) => {
        if (med.id === id) {
          return {
            ...med,
            quantity: newQuantity,
            lastRestocked: today,
          };
        }
        return med;
      })
    );
  };

  const handleEditClick = (medication) => {
    setEditingId(medication.id);
    setEditForm({ ...medication });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = () => {
    setMedications(
      medications.map((med) => (med.id === editingId ? { ...editForm } : med))
    );
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]:
        name === "quantity" || name === "threshold" ? parseInt(value) : value,
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getExpiryStatus = (expiryDate) => {
    const daysUntilExpiry =
      (new Date(expiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysUntilExpiry <= 0) {
      return { color: "bg-red-100 text-red-800", text: "Expired" };
    } else if (daysUntilExpiry <= 30) {
      return { color: "bg-red-100 text-red-800", text: "Expiring Soon" };
    } else if (daysUntilExpiry <= 90) {
      return {
        color: "bg-yellow-100 text-yellow-800",
        text: "Expires in 3 Months",
      };
    } else {
      return { color: "bg-green-100 text-green-800", text: "Good" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Medication Inventory</h1>
          <p className="text-gray-600">
            Track and manage the school's medication supply
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          onClick={() => setShowAddForm(true)}
        >
          Add New Medication
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search medications"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="sr-only">
                Filter by Category
              </label>
              <select
                id="category"
                name="category"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="showRestock"
                name="showRestock"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={showRestock}
                onChange={(e) => setShowRestock(e.target.checked)}
              />
              <label
                htmlFor="showRestock"
                className="ml-2 block text-sm text-gray-900"
              >
                Needs Restock
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="showExpiring"
                name="showExpiring"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={showExpiring}
                onChange={(e) => setShowExpiring(e.target.checked)}
              />
              <label
                htmlFor="showExpiring"
                className="ml-2 block text-sm text-gray-900"
              >
                Expiring Soon
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Medication
                    {sortField === "name" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↓" : "↑"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortField === "quantity" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↓" : "↑"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("expiryDate")}
                >
                  <div className="flex items-center">
                    Expiry Date
                    {sortField === "expiryDate" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↓" : "↑"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Restocked
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
                <tr
                  key={medication.id}
                  className={
                    medication.quantity <= medication.threshold
                      ? "bg-red-50"
                      : ""
                  }
                >
                  {editingId === medication.id ? (
                    // Edit mode
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="name"
                          className="w-full border rounded px-2 py-1"
                          value={editForm.name}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          name="type"
                          className="w-full border rounded px-2 py-1"
                          value={editForm.type}
                          onChange={handleEditChange}
                        >
                          <option value="Tablet">Tablet</option>
                          <option value="Liquid">Liquid</option>
                          <option value="Inhaler">Inhaler</option>
                          <option value="Cream">Cream</option>
                          <option value="Solution">Solution</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="category"
                          className="w-full border rounded px-2 py-1"
                          value={editForm.category}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          name="quantity"
                          min="0"
                          className="w-20 border rounded px-2 py-1"
                          value={editForm.quantity}
                          onChange={handleEditChange}
                        />
                        <span className="mx-1">/</span>
                        <input
                          type="number"
                          name="threshold"
                          min="0"
                          className="w-20 border rounded px-2 py-1"
                          value={editForm.threshold}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          name="expiryDate"
                          className="border rounded px-2 py-1"
                          value={editForm.expiryDate}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="storage"
                          className="w-full border rounded px-2 py-1"
                          value={editForm.storage}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(medication.lastRestocked)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-green-600 hover:text-green-900 mr-3"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {medication.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {medication.type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {medication.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm ${
                            medication.quantity <= medication.threshold
                              ? "font-bold text-red-700"
                              : "text-gray-900"
                          }`}
                        >
                          {medication.quantity} / {medication.threshold}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(medication.expiryDate)}
                        </div>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getExpiryStatus(medication.expiryDate).color
                          }`}
                        >
                          {getExpiryStatus(medication.expiryDate).text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {medication.storage}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(medication.lastRestocked)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => {
                            const newQuantity = parseInt(
                              prompt(
                                `Current ${medication.name} stock: ${medication.quantity}\n\nEnter new quantity:`,
                                medication.quantity
                              )
                            );
                            if (!isNaN(newQuantity) && newQuantity >= 0) {
                              handleUpdateStock(medication.id, newQuantity);
                            }
                          }}
                        >
                          Update Stock
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleEditClick(medication)}
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMedications.length === 0 && (
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No medications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              filterCategory !== "all" ||
              showRestock ||
              showExpiring
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding medications to the inventory."}
            </p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Total Inventory
              </h3>
              <p className="text-3xl font-bold text-gray-700">
                {medications.length} items
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-3">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Needs Restock
              </h3>
              <p className="text-3xl font-bold text-red-700">
                {
                  medications.filter((med) => med.quantity <= med.threshold)
                    .length
                }{" "}
                items
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <svg
                className="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Expiring Soon
              </h3>
              <p className="text-3xl font-bold text-yellow-700">
                {
                  medications.filter(
                    (med) =>
                      (new Date(med.expiryDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24) <=
                      90
                  ).length
                }{" "}
                items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Medication Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Medication</h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowAddForm(false)}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddMedication}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Medication Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  required
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="type"
                  >
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    value={newMedication.type}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Liquid">Liquid</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Cream">Cream</option>
                    <option value="Solution">Solution</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="category"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    required
                    value={newMedication.category}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        category: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="quantity"
                  >
                    Initial Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    min="0"
                    required
                    value={newMedication.quantity}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="threshold"
                  >
                    Restock Threshold <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="threshold"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    min="0"
                    required
                    value={newMedication.threshold}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        threshold: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="expiryDate"
                  >
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="expiryDate"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="date"
                    required
                    value={newMedication.expiryDate}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="storage"
                  >
                    Storage Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="storage"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    value={newMedication.storage}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        storage: e.target.value,
                      })
                    }
                  >
                    <option value="Medicine Cabinet">Medicine Cabinet</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="Locked Cabinet">Locked Cabinet</option>
                    <option value="First Aid Kit">First Aid Kit</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end mt-6">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded mr-2"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationInventory;
