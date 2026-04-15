import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { netMeteringSummary } from '../data/dummyData';

const NetMeteringSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetMeteringSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/net-metering/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        if (result.status === 'success') {
          setData(result);
        } else {
          throw new Error(result.message || 'API returned error');
        }
      } catch (err) {
        setError(err.message);
        // Fallback to dummy data
        setData(netMeteringSummary);
      } finally {
        setLoading(false);
      }
    };

    fetchNetMeteringSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  const { unitsImported, unitsExported, netUnits, importCost, exportCredit, finalBill, monthlyBreakdown } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Net Metering Summary</h2>
        <p className="text-gray-600">
          Track your energy exchange with the grid and calculate bill adjustments based on solar export.
        </p>
      </div>

      {/* What is Net Metering */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">What is Net Metering?</h3>
        <p className="text-gray-700 leading-relaxed">
          Net metering is a billing mechanism that credits solar energy system owners for the electricity they add
          to the grid. When your solar panels produce more electricity than you consume, the excess is exported to
          the grid. You receive credits for this exported energy, which offset the cost of electricity you import
          from the grid when your panels aren't producing enough power (e.g., at night).
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Units Imported</p>
            <span className="text-2xl">⬇️</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{unitsImported}</p>
          <p className="text-sm text-gray-500 mt-1">kWh from grid</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">Cost</p>
            <p className="text-xl font-bold text-gray-900">{importCost.toLocaleString()} PKR</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Units Exported</p>
            <span className="text-2xl">⬆️</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{unitsExported}</p>
          <p className="text-sm text-gray-500 mt-1">kWh to grid</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">Credit</p>
            <p className="text-xl font-bold text-green-600">-{exportCredit.toLocaleString()} PKR</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-green-500 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Net Units</p>
            <span className="text-2xl">🔄</span>
          </div>
          <p className="text-3xl font-bold">{netUnits}</p>
          <p className="text-sm opacity-90 mt-1">kWh (Import - Export)</p>
          <div className="mt-3 pt-3 border-t border-white border-opacity-30">
            <p className="text-sm opacity-90">Final Bill</p>
            <p className="text-xl font-bold">{finalBill.toLocaleString()} PKR</p>
          </div>
        </div>
      </div>

      {/* Bill Calculation Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Calculation Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Energy Imported from Grid</p>
              <p className="text-lg font-semibold text-gray-900">{unitsImported} kWh</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cost</p>
              <p className="text-xl font-bold text-red-600">+{importCost.toLocaleString()} PKR</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Energy Exported to Grid</p>
              <p className="text-lg font-semibold text-gray-900">{unitsExported} kWh</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Credit</p>
              <p className="text-xl font-bold text-green-600">-{exportCredit.toLocaleString()} PKR</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg border-2 border-blue-300">
            <div>
              <p className="text-sm text-gray-600 font-medium">Net Amount Due</p>
              <p className="text-lg font-semibold text-gray-900">{netUnits} kWh</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">Final Bill</p>
              <p className="text-2xl font-bold text-blue-700">{finalBill.toLocaleString()} PKR</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Savings:</span> You saved{' '}
            <span className="font-bold">{exportCredit.toLocaleString()} PKR</span> this month by exporting solar
            energy to the grid. Without net metering, your bill would have been{' '}
            <span className="font-bold">{importCost.toLocaleString()} PKR</span>.
          </p>
        </div>
      </div>

      {/* Monthly Breakdown Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Import/Export Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="imported" fill="#ef4444" name="Imported (kWh)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="exported" fill="#10b981" name="Exported (kWh)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="net" fill="#3b82f6" name="Net (kWh)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Monthly Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imported (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exported (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyBreakdown.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{month.month}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600 font-medium">{month.imported} kWh</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-medium">{month.exported} kWh</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600 font-bold">{month.net} kWh</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        month.net < 150 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {month.net < 150 ? 'Excellent' : 'Good'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits of Net Metering</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Cost Savings</p>
              <p className="text-sm text-gray-600">
                Reduce electricity bills by offsetting grid consumption with solar exports
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <span className="text-2xl">🌍</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Environmental Impact</p>
              <p className="text-sm text-gray-600">
                Reduce carbon footprint by generating clean, renewable energy
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Energy Independence</p>
              <p className="text-sm text-gray-600">
                Reduce reliance on grid electricity and protect against price increases
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Grid Support</p>
              <p className="text-sm text-gray-600">
                Support the grid during peak hours by contributing excess solar energy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetMeteringSummary;
