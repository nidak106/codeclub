import React, { useState, useEffect } from 'react';
// We'll keep the imports you had, but we are ready for charts!
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ApplianceInsights = () => {
  // --- STATE SECTION ---
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NEW: This state tracks which appliance button is clicked
  const [selectedAppliance, setSelectedAppliance] = useState('Fridge');

  // List of appliances from your CSV/Dash logic
  const applianceList = [
    { id: 'Fridge', label: '❄️ Fridge' },
    { id: 'AC', label: '💨 AC' },
    { id: 'Washing Machine', label: '🧺 Washing Machine' },
    { id: 'Kitchen Appliances', label: '🍳 Kitchen' },
    { id: 'Other Appliances', label: '🔌 Others' }
  ];

  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      try {
        // TEACHER TIP: We pass the selectedAppliance to the API as a "query parameter"
        const response = await fetch(`http://localhost:5000/api/fault-detection/anomalies?appliance=${selectedAppliance}&threshold=2`);
        const data = await response.json();

        if (data.status === 'success') {
          setAnomalies(data.anomalies);
        } else {
          setError(data.message || "Failed to load data");
        }
      } catch (err) {
        setError("Make sure the Flask server is running on localhost:5000");
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, [selectedAppliance]); // This means: "Whenever selectedAppliance changes, run this function again!"

  if (loading) return <div className="p-10 text-center animate-pulse">Analyzing {selectedAppliance} Data...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Device-Specific Fault Detection</h2>
        <p className="text-gray-600">
          Switch between appliances to see specific fluctuations and energy leaks.
        </p>
      </div>

      {/* 2. THE TOGGLE BUTTONS (The "Dash Dropdown" equivalent) */}
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-xl">
        {applianceList.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedAppliance(app.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedAppliance === app.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            {app.label}
          </button>
        ))}
      </div>

      {/* 3. Live Status Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Showing anomalies for:</span> {selectedAppliance}
        </p>
        <span className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-900 font-mono">
          Algorithm: Z-Score (Moving Window)
        </span>
      </div>

      {/* 4. Anomaly Cards (The results) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {anomalies.length === 0 ? (
          <div className="col-span-2 bg-gray-50 p-10 rounded-xl text-center border border-dashed border-gray-300">
            <p className="text-gray-500">No abnormal spikes detected for the {selectedAppliance}. Everything looks healthy!</p>
          </div>
        ) : (
          anomalies.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md border-l-8 p-6 border-red-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{item.Date}</h3>
                <span className="text-red-600 font-bold">⚠️ High Usage</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Consumption</p>
                  <p className="text-xl font-bold">{item.Total_Consumption.toFixed(2)} kWh</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Extra Cost</p>
                  <p className="text-xl font-bold text-red-600">PKR {item.Extra_Cost.toFixed(2)}</p>
                </div>
              </div>

              <div className="text-sm bg-gray-50 p-3 rounded border border-gray-100 italic text-gray-600">
                "The {selectedAppliance} deviated by {item.zscore.toFixed(1)} units from its typical 7-day average."
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplianceInsights;