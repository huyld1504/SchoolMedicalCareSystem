import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function UserProfile() {
    const { currentUser } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Define profile state with structure for all possible user types
    const [profileData, setProfileData] = useState({
        // Common fields
        id: "",
        name: "",
        email: "",
        role: "",
        avatar: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        status: "active",

        // Role specific fields
        // For student and parent
        emergencyContact: {
            name: "",
            relationship: "",
            phone: "",
        },

        // For student
        grade: "",
        class: "",
        studentId: "",
        allergies: "",
        medicalConditions: "",

        // For nurse and manager
        specialization: "",
        department: "",
        qualification: "",
        employmentDate: "",

        // Security
        passwordChange: {
            current: "",
            new: "",
            confirm: "",
        },
        twoFactorEnabled: false,

        // Preferences
        notificationPreferences: {
            email: true,
            sms: false,
            app: true,
        },
    });

    // Define sample user data based on role
    const getSampleUserData = (userId) => {
        // This simulates an API call to get user data
        // In a real application, this would come from an actual API

        // Admin sample data
        if (currentUser?.role === "admin" || userId === "1") {
            return {
                id: "1",
                name: "John Smith",
                email: "admin@schoolmedical.com",
                role: "admin",
                avatar: "https://randomuser.me/api/portraits/men/41.jpg",
                phone: "(555) 123-4567",
                address: "123 Admin St, City, State 12345",
                dateOfBirth: "1985-03-15",
                gender: "Male",
                status: "active",
                department: "Administration",
                qualification: "MSc Healthcare Administration",
                employmentDate: "2020-01-10",
                twoFactorEnabled: true,
                notificationPreferences: {
                    email: true,
                    sms: true,
                    app: true,
                },
            };
        }

        // Nurse sample data
        if (currentUser?.role === "nurse" || userId === "2") {
            return {
                id: "2",
                name: "Sarah Johnson",
                email: "nurse@schoolmedical.com",
                role: "nurse",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                phone: "(555) 234-5678",
                address: "456 Nurse Ave, City, State 12345",
                dateOfBirth: "1990-07-22",
                gender: "Female",
                status: "active",
                specialization: "Pediatric Care",
                department: "School Health Services",
                qualification: "RN, BSN",
                employmentDate: "2021-08-15",
                twoFactorEnabled: false,
                notificationPreferences: {
                    email: true,
                    sms: true,
                    app: false,
                },
            };
        }

        // Parent sample data
        if (currentUser?.role === "parent" || userId === "3") {
            return {
                id: "3",
                name: "Michael Chen",
                email: "parent@example.com",
                role: "parent",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                phone: "(555) 345-6789",
                address: "789 Family Ln, City, State 12345",
                dateOfBirth: "1982-11-08",
                gender: "Male",
                status: "active",
                emergencyContact: {
                    name: "Jennifer Chen",
                    relationship: "Spouse",
                    phone: "(555) 345-6788",
                },
                twoFactorEnabled: false,
                notificationPreferences: {
                    email: true,
                    sms: false,
                    app: true,
                },
            };
        }

        // Student sample data
        if (currentUser?.role === "student" || userId === "4") {
            return {
                id: "4",
                name: "Emma Wilson",
                email: "student@schoolmedical.com",
                role: "student",
                avatar: "https://randomuser.me/api/portraits/women/90.jpg",
                phone: "(555) 456-7890",
                address: "101 Student Dorm, Campus, State 12345",
                dateOfBirth: "2005-05-12",
                gender: "Female",
                status: "active",
                grade: "10th Grade",
                class: "10-A",
                studentId: "S2023045",
                allergies: "Peanuts, Penicillin",
                medicalConditions: "Asthma (mild)",
                emergencyContact: {
                    name: "Robert Wilson",
                    relationship: "Father",
                    phone: "(555) 456-7899",
                },
                twoFactorEnabled: false,
                notificationPreferences: {
                    email: true,
                    sms: false,
                    app: true,
                },
            };
        }

        // Default data if no match
        return {
            id: userId || "0",
            name: "User",
            email: "user@example.com",
            role: "user",
            avatar: "",
            status: "active",
        };
    };

    // Load user data
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                // In a real app, this would be an API call
                // For demonstration, we'll use the sample data
                setLoading(true);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Get the user data based on role or provided ID
                const userData = getSampleUserData(id);

                // Update the state with loaded data
                setProfileData(prevData => ({
                    ...prevData,
                    ...userData,
                }));

                setError(null);
            } catch (err) {
                console.error("Error loading profile:", err);
                setError("Failed to load user profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [id, currentUser]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested properties
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfileData(prevData => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setProfileData(prevData => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage(null);
            setError(null);

            // Validate form
            if (!profileData.name.trim() || !profileData.email.trim()) {
                throw new Error("Name and email are required fields");
            }

            // Password change validation
            if (
                profileData.passwordChange.new &&
                profileData.passwordChange.new !== profileData.passwordChange.confirm
            ) {
                throw new Error("New passwords do not match");
            }

            // In a real app, this would be an API call to update the profile
            await new Promise(resolve => setTimeout(resolve, 1200));

            setMessage("Profile updated successfully");

            // Reset password fields
            setProfileData(prevData => ({
                ...prevData,
                passwordChange: {
                    current: "",
                    new: "",
                    confirm: "",
                }
            }));

        } catch (err) {
            console.error("Error saving profile:", err);
            setError(err.message || "Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // Handle avatar upload
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // In a real app, this would upload to a server
        // For this demo, we'll use a local URL
        const reader = new FileReader();
        reader.onload = (event) => {
            setProfileData(prevData => ({
                ...prevData,
                avatar: event.target.result
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">User Profile</h1>
                <p className="text-gray-600">
                    {id ? `Viewing profile for ${profileData.name}` : "Manage your account and preferences"}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Profile Header */}
                    <div className="p-6 bg-blue-50 border-b">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                                        {profileData.avatar ? (
                                            <img
                                                src={profileData.avatar}
                                                alt={profileData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                                                <span className="text-2xl font-bold">
                                                    {profileData.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                                <p className="text-gray-600">{profileData.email}</p>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profileData.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            profileData.role === 'nurse' ? 'bg-green-100 text-green-800' :
                                                profileData.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                    profileData.role === 'parent' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }`}>
                                        {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                                    </span>
                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profileData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alert Messages */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>

                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            rows="2"
                                            value={profileData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={profileData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={profileData.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                                <option value="Prefer not to say">Prefer not to say</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {/* Role-specific fields */}
                                    {(profileData.role === 'student' || profileData.role === 'parent') && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>

                                            <div className="mb-4">
                                                <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                                <input
                                                    type="text"
                                                    id="emergencyContact.name"
                                                    name="emergencyContact.name"
                                                    value={profileData.emergencyContact?.name || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                                <input
                                                    type="text"
                                                    id="emergencyContact.relationship"
                                                    name="emergencyContact.relationship"
                                                    value={profileData.emergencyContact?.relationship || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    id="emergencyContact.phone"
                                                    name="emergencyContact.phone"
                                                    value={profileData.emergencyContact?.phone || ""}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {profileData.role === 'student' && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="mb-4">
                                                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                                                    <input
                                                        type="text"
                                                        id="grade"
                                                        name="grade"
                                                        value={profileData.grade}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                                    <input
                                                        type="text"
                                                        id="class"
                                                        name="class"
                                                        value={profileData.class}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                                <input
                                                    type="text"
                                                    id="studentId"
                                                    name="studentId"
                                                    value={profileData.studentId}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                                <textarea
                                                    id="allergies"
                                                    name="allergies"
                                                    rows="2"
                                                    value={profileData.allergies}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="List any allergies or write 'None'"
                                                ></textarea>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                                                <textarea
                                                    id="medicalConditions"
                                                    name="medicalConditions"
                                                    rows="2"
                                                    value={profileData.medicalConditions}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="List any medical conditions or write 'None'"
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {(profileData.role === 'nurse' || profileData.role === 'manager' || profileData.role === 'admin') && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>

                                            {(profileData.role === 'nurse') && (
                                                <div className="mb-4">
                                                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                                    <input
                                                        type="text"
                                                        id="specialization"
                                                        name="specialization"
                                                        value={profileData.specialization}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                                <input
                                                    type="text"
                                                    id="department"
                                                    name="department"
                                                    value={profileData.department}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                                                <input
                                                    type="text"
                                                    id="qualification"
                                                    name="qualification"
                                                    value={profileData.qualification}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="employmentDate" className="block text-sm font-medium text-gray-700 mb-1">Employment Date</label>
                                                <input
                                                    type="date"
                                                    id="employmentDate"
                                                    name="employmentDate"
                                                    value={profileData.employmentDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Security Section - visible to all */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>

                                        <div className="mb-4">
                                            <label htmlFor="passwordChange.current" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                id="passwordChange.current"
                                                name="passwordChange.current"
                                                value={profileData.passwordChange.current}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="passwordChange.new" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                id="passwordChange.new"
                                                name="passwordChange.new"
                                                value={profileData.passwordChange.new}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="passwordChange.confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                id="passwordChange.confirm"
                                                name="passwordChange.confirm"
                                                value={profileData.passwordChange.confirm}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <input
                                                type="checkbox"
                                                id="twoFactorEnabled"
                                                name="twoFactorEnabled"
                                                checked={profileData.twoFactorEnabled}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-700">
                                                Enable Two-Factor Authentication
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Preferences */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="notificationPreferences.email"
                                            name="notificationPreferences.email"
                                            checked={profileData.notificationPreferences.email}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="notificationPreferences.email" className="ml-2 block text-sm text-gray-700">
                                            Email Notifications
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="notificationPreferences.sms"
                                            name="notificationPreferences.sms"
                                            checked={profileData.notificationPreferences.sms}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="notificationPreferences.sms" className="ml-2 block text-sm text-gray-700">
                                            SMS Notifications
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="notificationPreferences.app"
                                            name="notificationPreferences.app"
                                            checked={profileData.notificationPreferences.app}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="notificationPreferences.app" className="ml-2 block text-sm text-gray-700">
                                            In-App Notifications
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="px-6 py-4 bg-gray-50 text-right">
                            <button
                                type="button"
                                className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
