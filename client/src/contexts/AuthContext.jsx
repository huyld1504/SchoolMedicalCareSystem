import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demonstration purposes, we'll use localStorage
  // In a real application, you would validate tokens with your backend
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Sample user login function
  const login = async (email, password) => {
    // In a real app, this would be an API call to your authentication endpoint
    // For demonstration, we're using mock data

    // Mock users for different roles
    const mockUsers = [
      {
        id: 1,
        email: "admin@school.edu",
        password: "admin123",
        name: "Admin User",
        role: "admin",
      },
      {
        id: 2,
        email: "manager@school.edu",
        password: "manager123",
        name: "Manager User",
        role: "manager",
      },
      {
        id: 3,
        email: "nurse@school.edu",
        password: "nurse123",
        name: "School Nurse",
        role: "nurse",
      },
      {
        id: 4,
        email: "parent@example.com",
        password: "parent123",
        name: "Parent User",
        role: "parent",
      },
      {
        id: 5,
        email: "student@school.edu",
        password: "student123",
        name: "Student User",
        role: "student",
      },
    ];

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Remove password before storing user data
      const { password, ...userWithoutPassword } = user;

      // Store user in state and localStorage
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const register = async (userDetails) => {
    // In a real app, this would be an API call to your registration endpoint
    // For demonstration, we're just returning a success message
    return { success: true, message: "Registration successful" };
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
