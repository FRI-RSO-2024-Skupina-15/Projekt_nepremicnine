import React from 'react';
import PropertyForm from './components/PropertyForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Property Management System</h1>
      <div className="max-w-7xl mx-auto">
        <PropertyForm />
      </div>
    </div>
  );
}

export default App;