import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./layouts/layout.css";
import routes from "./routes.jsx";

// Authentication context
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (<AuthProvider>
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;
