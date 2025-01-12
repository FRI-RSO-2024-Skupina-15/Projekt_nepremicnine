import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PropertyForm from './components/PropertyForm';
import PropertyListing from './components/PropertyListing';

const Navigation = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="text-xl font-bold">Property Manager</div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Properties</Link>
        <Link to="/add" className="hover:text-gray-300">Add Property</Link>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<PropertyListing />} />
          <Route path="/add" element={<PropertyForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;