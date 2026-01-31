import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const DashboardOverview = () => {
  const [data, setData] = useState({
    summary: null,
    anomalies: [],
    loading: true,
    error: null
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [compRes, anomRes] = await Promise.all([
          fetch(`${API_BASE_URL}/billing/comparison`),
          fetch(`${API_BASE_URL}/fault-detection/anomalies?threshold=2`)
        ]);

        const summary = await compRes.json();
        const anomalies = await anomRes.json();

        setData({
          summary: summary.status === 'success' ? summary : null,
          anomalies: anomalies.status === 'success' ? anomalies.anomalies : [],
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: "Failed to connect to Flask API" }));
      }
    };

    fetchDashboardData();
  }, []);

  if (data.loading) return <div className="p-10 text-center animate-pulse">Syncing with Energy Database...</div>;

  const { summary, anomalies } = data;

  // Mocked optimization logic (assuming 15% savings via AI scheduling)
  const estimatedBill = summary?.current_month_bill || 0;
  const optimizedBill = estimatedBill * 0.85;

  return (
    <div className="space-y-6">
      {/* API Status Notice */}
      <div className={`border rounded-lg p-4 ${data.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
        <p className={`text-sm ${data.error ? 'text-red-800' : 'text-green-800'}`}>
          <span className="font-semibold">System Status:</span> {data.error ? data.error : 'Live data connection established via Flask SARIMAX backend.'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Current Month Bill</p>
          <p className="text-3xl font-bold text-gray-900">PKR {Math.round(estimatedBill).toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Based on July 2021 Data</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600">3-Month Avg</p>
          <p className="text-3xl font-bold text-blue-600">PKR {Math.round(summary?.three_month_average || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Rolling average</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600">Recent Anomalies</p>
          <p className="text-3xl font-bold text-red-600">{anomalies.length}</p>
          <p className="text-sm text-gray-500 mt-1">Z-Score {'>'} 2.0</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90">AI-Optimized Goal</p>
          <p className="text-3xl font-bold">PKR {Math.round(optimizedBill).toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-1">Target 15% Reduction</p>
        </div>
      </div>

      {/* Main Comparison Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Billing Trend (2021)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'May', total: summary?.three_month_average * 0.9 }, // Derived for viz
              { name: 'June', total: summary?.previous_month_bill },
              { name: 'July', total: summary?.current_month_bill },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Monthly Total (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Abnormality Detection Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">AI Fault Detection Log</h3>
          <p className="text-sm text-gray-600">Automated Z-Score analysis identifying high-consumption events</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Detection Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Consumption</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Severity (Z-Score)</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Est. Waste Cost</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {anomalies.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.Date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.Total_Consumption.toFixed(2)} kWh</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.zscore.toFixed(2)}σ</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-semibold">PKR {item.Extra_Cost.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 uppercase">
                      Action Required
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;