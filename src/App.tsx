import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import AddClient from "./components/AddClient";
import ChatBot from "./components/Chatbot";

const API_BASE_URL = process.env.WEB_BASE || "http://localhost:9000/api";

export {API_BASE_URL};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <nav className="w-full bg-blue-500 text-white py-4">
          <div className="max-w-4xl mx-auto flex justify-center space-x-6">
            <NavLink
              to="/"
              className={({isActive}) =>
                `text-lg font-semibold ${isActive ? "underline" : ""}`
              }
            >
              ChatBot
            </NavLink>
            <NavLink
              to="/add-client"
              className={({isActive}) =>
                `text-lg font-semibold ${isActive ? "underline" : ""}`
              }
            >
              Add Client
            </NavLink>
          </div>
        </nav>

        <div className="max-w-4xl w-full p-6">
          <Routes>
            <Route path="/" element={<ChatBot />} />
            <Route path="/add-client" element={<AddClient />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
