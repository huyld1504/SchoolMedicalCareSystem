<<<<<<< Updated upstream
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaEllipsisV, FaUserPlus, FaFileExport } from 'react-icons/fa';

function UsersList() {
    // Sample data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'Student',
            grade: '10th Grade',
            school: 'Lincoln High School',
            status: 'Active',
            lastActive: '2 hours ago'
        },
        {
            id: 2,
            name: 'Maria Thompson',
            email: 'maria.t@example.com',
            role: 'Parent',
            grade: null,
            school: 'Multiple',
            status: 'Active',
            lastActive: '5 minutes ago'
        },
        {
            id: 3,
            name: 'Dr. Robert Johnson',
            email: 'robert.j@healthcenter.org',
            role: 'Nurse',
            grade: null,
            school: 'Washington Middle School',
            status: 'Active',
            lastActive: '1 day ago'
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@district.edu',
            role: 'Manager',
            grade: null,
            school: 'District Office',
            status: 'Active',
            lastActive: '3 hours ago'
        },
        {
            id: 5,
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            role: 'Student',
            grade: '8th Grade',
            school: 'Washington Middle School',
            status: 'Inactive',
            lastActive: '2 weeks ago'
        },
        {
            id: 6,
            name: 'Sarah Wilson',
            email: 'sarah.w@example.com',
            role: 'Parent',
            grade: null,
            school: 'Multiple',
            status: 'Active',
            lastActive: '1 day ago'
        },
        {
            id: 7,
            name: 'Daniel Lee',
            email: 'daniel.lee@healthcenter.org',
            role: 'Admin',
            grade: null,
            school: 'System',
            status: 'Active',
            lastActive: '1 hour ago'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter users based on search term and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchTerm === '' ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === '' || user.role === roleFilter;
        const matchesStatus = statusFilter === '' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-wrap justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>

                <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <FaUserPlus className="mr-2" />
                        Add User
                    </button>

                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                        <FaFileExport className="mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Search and filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Search bar */}
                    <div className="flex-1 min-w-[200px] relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Role filter */}
                    <div className="min-w-[150px]">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Parent">Parent</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Status filter */}
                    <div className="min-w-[150px]">
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>

                    {/* Advanced filters button */}
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                        <FaFilter className="mr-2 text-gray-600" />
                        <span>More Filters</span>
                    </button>
                </div>
            </div>

            {/* Users table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                School
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Active
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="font-medium text-gray-700">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.role}</div>
                                    {user.grade && <div className="text-sm text-gray-500">{user.grade}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.school}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            user.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.lastActive}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="relative inline-block text-left group">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <FaEllipsisV />
                                        </button>
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 hidden group-hover:block z-10">
                                            <div className="py-1">
                                                <Link to={`/admin/users/${user.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    View Profile
                                                </Link>
                                                <Link to={`/admin/users/${user.id}/edit`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Edit User
                                                </Link>
                                            </div>
                                            <div className="py-1">
                                                <button className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                                                    Deactivate User
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of{' '}
                            <span className="font-medium">7</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                1
                            </button>
                            <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
=======
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // Sample user data for demonstration
    const dummyUsers = [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@example.com",
            role: "admin",
            status: "active",
            lastLogin: "2023-06-02 10:15 AM",
            createdAt: "2022-01-15"
        },
        {
            id: 2,
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "nurse",
            status: "active",
            lastLogin: "2023-06-01 08:30 AM",
            createdAt: "2022-03-10"
        },
        {
            id: 3,
            name: "Michael Chen",
            email: "michael.chen@example.com",
            role: "nurse",
            status: "active",
            lastLogin: "2023-06-02 09:45 AM",
            createdAt: "2022-02-05"
        },
        {
            id: 4,
            name: "Emily Wilson",
            email: "emily.wilson@example.com",
            role: "manager",
            status: "active",
            lastLogin: "2023-06-02 11:20 AM",
            createdAt: "2022-05-20"
        },
        {
            id: 5,
            name: "David Brown",
            email: "david.brown@example.com",
            role: "parent",
            status: "inactive",
            lastLogin: "2023-05-15 03:10 PM",
            createdAt: "2022-04-12"
        },
        {
            id: 6,
            name: "Jessica Taylor",
            email: "jessica.taylor@example.com",
            role: "parent",
            status: "active",
            lastLogin: "2023-06-01 01:45 PM",
            createdAt: "2022-09-08"
        },
        {
            id: 7,
            name: "Robert Lee",
            email: "robert.lee@example.com",
            role: "student",
            status: "active",
            lastLogin: "2023-05-30 10:30 AM",
            createdAt: "2022-08-15"
        },
        {
            id: 8,
            name: "Amanda Martinez",
            email: "amanda.martinez@example.com",
            role: "student",
            status: "pending",
            lastLogin: "Never",
            createdAt: "2023-05-28"
        },
        {
            id: 9,
            name: "Thomas Wilson",
            email: "thomas.wilson@example.com",
            role: "parent",
            status: "active",
            lastLogin: "2023-06-02 09:15 AM",
            createdAt: "2022-07-20"
        },
        {
            id: 10,
            name: "Lisa Johnson",
            email: "lisa.johnson@example.com",
            role: "nurse",
            status: "inactive",
            lastLogin: "2023-04-15 11:30 AM",
            createdAt: "2022-06-10"
        }
    ];

    // Load user data
    useEffect(() => {
        // In a real app, this would be an API call
        const loadUsers = async () => {
            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 800));
                setUsers(dummyUsers);
            } catch (error) {
                console.error("Error loading users:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Get sort indicator
    const getSortIndicator = (field) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    // Handle bulk selection
    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user) => user.id));
        }
    };

    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    // Handle bulk actions
    const handleBulkAction = (action) => {
        if (selectedUsers.length === 0) return;

        // In a real app, this would make API calls to update user status
        if (action === "activate") {
            setUsers(
                users.map((user) =>
                    selectedUsers.includes(user.id) ? { ...user, status: "active" } : user
                )
            );
            setSelectedUsers([]);
        } else if (action === "deactivate") {
            setUsers(
                users.map((user) =>
                    selectedUsers.includes(user.id) ? { ...user, status: "inactive" } : user
                )
            );
            setSelectedUsers([]);
        } else if (action === "delete") {
            setIsConfirmModalOpen(true);
        }
    };

    const confirmDelete = () => {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        setIsConfirmModalOpen(false);
    };

    // Apply filters and sorting
    const filteredUsers = users
        .filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                filter === "all" ||
                (filter === "active" && user.status === "active") ||
                (filter === "inactive" && user.status === "inactive") ||
                (filter === "pending" && user.status === "pending") ||
                filter === user.role;

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (a[sortField] < b[sortField]) {
                comparison = -1;
            } else if (a[sortField] > b[sortField]) {
                comparison = 1;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">User Management</h1>
                    <p className="text-gray-600">Manage system users across all roles</p>
                </div>

                <Link
                    to="/admin/users/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center transition duration-150"
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
                            d="M12 4v16m8-8H4"
                        ></path>
                    </svg>
                    Add New User
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div>
                            <select
                                className="w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Users</option>
                                <option value="active">Active Users</option>
                                <option value="inactive">Inactive Users</option>
                                <option value="pending">Pending Users</option>
                                <option value="admin">Admins</option>
                                <option value="manager">Managers</option>
                                <option value="nurse">Nurses</option>
                                <option value="parent">Parents</option>
                                <option value="student">Students</option>
                            </select>
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="flex gap-2 ml-auto">
                                <button
                                    type="button"
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm"
                                    onClick={() => handleBulkAction("activate")}
                                >
                                    Activate
                                </button>
                                <button
                                    type="button"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
                                    onClick={() => handleBulkAction("deactivate")}
                                >
                                    Deactivate
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm"
                                    onClick={() => handleBulkAction("delete")}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
                        <p className="mt-2 text-gray-500">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No users found matching your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                checked={
                                                    filteredUsers.length > 0 &&
                                                    selectedUsers.length === filteredUsers.length
                                                }
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("name")}
                                    >
                                        <div className="flex items-center">
                                            <span>Name</span>
                                            <span className="ml-1">{getSortIndicator("name")}</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("email")}
                                    >
                                        <div className="flex items-center">
                                            <span>Email</span>
                                            <span className="ml-1">{getSortIndicator("email")}</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("role")}
                                    >
                                        <div className="flex items-center">
                                            <span>Role</span>
                                            <span className="ml-1">{getSortIndicator("role")}</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("status")}
                                    >
                                        <div className="flex items-center">
                                            <span>Status</span>
                                            <span className="ml-1">{getSortIndicator("status")}</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("lastLogin")}
                                    >
                                        <div className="flex items-center">
                                            <span>Last Login</span>
                                            <span className="ml-1">{getSortIndicator("lastLogin")}</span>
                                        </div>
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
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-600 font-semibold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Created: {user.createdAt}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "admin"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : user.role === "manager"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : user.role === "nurse"
                                                                ? "bg-green-100 text-green-800"
                                                                : user.role === "parent"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : user.status === "inactive"
                                                            ? "bg-gray-100 text-gray-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.lastLogin}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/admin/users/${user.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => {
                                                    setSelectedUsers([user.id]);
                                                    setIsConfirmModalOpen(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination - simplified for this example */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">1</span> to{" "}
                            <span className="font-medium">{filteredUsers.length}</span> of{" "}
                            <span className="font-medium">{filteredUsers.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span className="sr-only">Previous</span>
                                <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                1
                            </button>
                            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span className="sr-only">Next</span>
                                <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
>>>>>>> Stashed changes
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

<<<<<<< Updated upstream
            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select a role</option>
                                    <option value="Student">Student</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">School</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select a school</option>
                                    <option>Lincoln High School</option>
                                    <option>Washington Middle School</option>
                                    <option>Jefferson Elementary School</option>
                                    <option>District Office</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
=======
            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Delete{" "}
                                            {selectedUsers.length > 1 ? "Users" : "User"}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete{" "}
                                                {selectedUsers.length > 1
                                                    ? `these ${selectedUsers.length} users`
                                                    : "this user"}
                                                ? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
>>>>>>> Stashed changes
                    </div>
                </div>
            )}
        </div>
    );
}

<<<<<<< Updated upstream
export default UsersList;
=======
export default UsersList;
>>>>>>> Stashed changes
