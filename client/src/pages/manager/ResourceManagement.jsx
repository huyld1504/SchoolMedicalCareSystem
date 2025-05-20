import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ResourceManagement() {
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [recentRequests, setRecentRequests] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockItems: 0,
        pendingRequests: 0,
        totalValue: 0
    });
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Sample resource data
    const sampleResourceData = [
        {
            id: 1,
            name: "First Aid Kits",
            category: "Medical Supplies",
            quantity: 25,
            minQuantity: 10,
            unit: "kits",
            location: "Main Storage",
            lastRestocked: "2023-05-15",
            price: 45.99,
            image: "https://placehold.co/100x100?text=First+Aid"
        },
        {
            id: 2,
            name: "Disposable Gloves",
            category: "Protective Equipment",
            quantity: 500,
            minQuantity: 200,
            unit: "pairs",
            location: "Main Storage",
            lastRestocked: "2023-05-20",
            price: 0.25,
            image: "https://placehold.co/100x100?text=Gloves"
        },
        {
            id: 3,
            name: "Digital Thermometers",
            category: "Medical Devices",
            quantity: 12,
            minQuantity: 15,
            unit: "pieces",
            location: "Medical Office",
            lastRestocked: "2023-04-10",
            price: 29.99,
            image: "https://placehold.co/100x100?text=Thermometer"
        },
        {
            id: 4,
            name: "Blood Pressure Monitors",
            category: "Medical Devices",
            quantity: 8,
            minQuantity: 5,
            unit: "devices",
            location: "Medical Office",
            lastRestocked: "2023-03-25",
            price: 89.99,
            image: "https://placehold.co/100x100?text=BP+Monitor"
        },
        {
            id: 5,
            name: "Adhesive Bandages",
            category: "Medical Supplies",
            quantity: 1200,
            minQuantity: 500,
            unit: "pieces",
            location: "Main Storage",
            lastRestocked: "2023-06-01",
            price: 0.10,
            image: "https://placehold.co/100x100?text=Bandages"
        },
        {
            id: 6,
            name: "Antiseptic Solution",
            category: "Medications",
            quantity: 20,
            minQuantity: 25,
            unit: "bottles",
            location: "Medical Cabinet",
            lastRestocked: "2023-05-05",
            price: 12.50,
            image: "https://placehold.co/100x100?text=Antiseptic"
        },
        {
            id: 7,
            name: "Face Masks",
            category: "Protective Equipment",
            quantity: 300,
            minQuantity: 200,
            unit: "pieces",
            location: "Main Storage",
            lastRestocked: "2023-05-28",
            price: 0.50,
            image: "https://placehold.co/100x100?text=Masks"
        },
        {
            id: 8,
            name: "Examination Beds",
            category: "Furniture",
            quantity: 4,
            minQuantity: 3,
            unit: "pieces",
            location: "Medical Office",
            lastRestocked: "2022-08-15",
            price: 899.99,
            image: "https://placehold.co/100x100?text=Exam+Bed"
        }
    ];

    // Sample resource requests
    const sampleRequests = [
        {
            id: 1,
            requester: "Sarah Johnson",
            role: "School Nurse",
            items: [
                { name: "Disposable Gloves", quantity: 100, unit: "pairs" },
                { name: "Face Masks", quantity: 50, unit: "pieces" }
            ],
            status: "pending",
            priority: "medium",
            requestedDate: "2023-06-05",
            neededBy: "2023-06-15"
        },
        {
            id: 2,
            requester: "Michael Chen",
            role: "School Nurse",
            items: [
                { name: "Digital Thermometers", quantity: 5, unit: "pieces" },
                { name: "Antiseptic Solution", quantity: 10, unit: "bottles" }
            ],
            status: "approved",
            priority: "high",
            requestedDate: "2023-06-02",
            neededBy: "2023-06-10"
        },
        {
            id: 3,
            requester: "Emily Wilson",
            role: "Vaccination Coordinator",
            items: [
                { name: "Disposable Syringes", quantity: 200, unit: "pieces" },
                { name: "Alcohol Swabs", quantity: 300, unit: "boxes" }
            ],
            status: "pending",
            priority: "high",
            requestedDate: "2023-06-04",
            neededBy: "2023-06-12"
        }
    ];

    // Load resource data
    useEffect(() => {
        const fetchResourceData = async () => {
            try {
                setLoading(true);
                // In a real app, this would be an API call
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Set resources data
                setResources(sampleResourceData);
                setRecentRequests(sampleRequests);

                // Calculate low stock items
                const lowStock = sampleResourceData.filter(item => item.quantity <= item.minQuantity);
                setLowStockItems(lowStock);

                // Calculate statistics
                const totalItems = sampleResourceData.reduce((acc, item) => acc + item.quantity, 0);
                const pendingRequests = sampleRequests.filter(req => req.status === 'pending').length;
                const totalValue = sampleResourceData.reduce((acc, item) => acc + (item.quantity * item.price), 0);

                setStats({
                    totalItems,
                    lowStockItems: lowStock.length,
                    pendingRequests,
                    totalValue: totalValue.toFixed(2)
                });

            } catch (error) {
                console.error('Error fetching resource data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResourceData();
    }, []);

    // Filter resources based on search and category
    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(search.toLowerCase()) ||
            resource.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter dropdown
    const categories = [...new Set(resources.map(resource => resource.category))];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Resource Management</h1>
                    <p className="text-gray-600">Manage medical supplies, equipment, and inventory</p>
                </div>

                <div className="flex gap-2">
                    <Link
                        to="/manager/resources/inventory"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-150"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        View Full Inventory
                    </Link>

                    <Link
                        to="/manager/resources/requests"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-150"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Manage Requests
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Inventory Items</p>
                            <p className="text-2xl font-bold">{stats.totalItems}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Low Stock Items</p>
                            <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Pending Requests</p>
                            <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Inventory Value</p>
                            <p className="text-2xl font-bold">${stats.totalValue}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Inventory Overview */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-xl font-semibold">Inventory Overview</h2>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>

                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : filteredResources.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No resources found matching your search criteria.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredResources.map((resource) => (
                                            <tr key={resource.id} className={resource.quantity <= resource.minQuantity ? 'bg-red-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full object-cover" src={resource.image} alt={resource.name} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                                                            <div className="text-sm text-gray-500">Last restocked: {resource.lastRestocked}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{resource.category}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{resource.quantity} {resource.unit}</div>
                                                    <div className="text-xs text-gray-500">Min: {resource.minQuantity}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${resource.quantity <= resource.minQuantity
                                                            ? 'bg-red-100 text-red-800'
                                                            : resource.quantity <= resource.minQuantity * 1.5
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {resource.quantity <= resource.minQuantity
                                                            ? 'Low Stock'
                                                            : resource.quantity <= resource.minQuantity * 1.5
                                                                ? 'Warning'
                                                                : 'In Stock'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {resource.location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                        onClick={() => alert(`View details for ${resource.name}`)}
                                                    >
                                                        Details
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-900"
                                                        onClick={() => alert(`Restock ${resource.name}`)}
                                                    >
                                                        Restock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link to="/manager/resources/inventory" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                                View full inventory
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Recent Requests</h2>
                    </div>

                    <div className="p-6">
                        {recentRequests.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No recent requests found.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {recentRequests.map((request) => (
                                    <div key={request.id} className="border rounded-lg overflow-hidden">
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">{request.requester}</h3>
                                                    <p className="text-sm text-gray-500">{request.role}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${request.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : request.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="mt-3">
                                                <h4 className="text-sm font-medium text-gray-700">Requested Items:</h4>
                                                <ul className="mt-1 text-sm text-gray-600">
                                                    {request.items.map((item, index) => (
                                                        <li key={index} className="flex justify-between">
                                                            <span>{item.name}</span>
                                                            <span>{item.quantity} {item.unit}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 px-4 py-3 flex flex-wrap gap-2 text-xs border-t">
                                            <span className="text-gray-500">Requested: {request.requestedDate}</span>
                                            <span className="text-gray-500">Needed by: {request.neededBy}</span>
                                            <span className={`ml-auto ${request.priority === 'high'
                                                    ? 'text-red-600'
                                                    : request.priority === 'medium'
                                                        ? 'text-yellow-600'
                                                        : 'text-blue-600'
                                                }`}>
                                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <Link to="/manager/resources/requests" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                                        Review all requests
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded-lg mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>The following items are below minimum stock levels:</p>
                                <ul className="list-disc list-inside mt-1">
                                    {lowStockItems.map((item) => (
                                        <li key={item.id}>{item.name} ({item.quantity}/{item.minQuantity} {item.unit})</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-4">
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-outline-red focus:border-red-700 active:bg-red-700 transition ease-in-out duration-150"
                                    onClick={() => alert("This would open a restock order form")}
                                >
                                    Place Restock Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                        className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-150 flex flex-col items-center text-center"
                        onClick={() => alert("This would open a new order form")}
                    >
                        <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        <span className="font-medium">Place New Order</span>
                    </button>

                    <button
                        className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition duration-150 flex flex-col items-center text-center"
                        onClick={() => alert("This would open the inventory update form")}
                    >
                        <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        <span className="font-medium">Update Inventory</span>
                    </button>

                    <button
                        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-150 flex flex-col items-center text-center"
                        onClick={() => alert("This would generate inventory reports")}
                    >
                        <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="font-medium">Generate Reports</span>
                    </button>

                    <button
                        className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition duration-150 flex flex-col items-center text-center"
                        onClick={() => alert("This would open the supplier management page")}
                    >
                        <svg className="w-8 h-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="font-medium">Manage Suppliers</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResourceManagement;
