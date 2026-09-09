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

  const {
    unitsImported,
    unitsExported,
    netUnits,
    billedUnits,
    creditedUnits,
    energyCost,
    fixedCharge,
    gst,
    exportCredit,
    finalBill,
    creditBalance,
    billWithoutSolar,
    savings,
    monthlyBreakdown,
  } = data;

  const fmt = (n) => (n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const savingsPercent = billWithoutSolar > 0 ? Math.round((savings / billWithoutSolar) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Net Metering Summary</h2>
        <p className="text-gray-600">
          Track your energy exchange with the grid and see how solar is actually reducing your bill.
        </p>
      </div>

      {/* What is Net Metering */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">How your bill is worked out</h3>
        <p className="text-gray-700 leading-relaxed">
          Your solar panels feed power to the grid when they produce more than you're using, and you pull power
          from the grid when they produce less. Each month, WAPDA nets these two flows against each other first —
          <span className="font-medium"> imported units minus exported units</span> — and only charges you the
          tariff-slab rate on whatever's left over. If you exported more than you imported that month, the extra
          is paid back as a credit, at a lower buy-back rate than the tariff you'd normally pay for imports.
          That's why the numbers below aren't a simple "import cost minus export credit" — the netting happens
          <span className="font-medium"> before</span> the tariff slab is applied, not after.
        </p>
      </div>

      {/* With vs Without Solar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Bill without solar</p>
          <p className="text-3xl font-bold text-gray-500 line-through decoration-2">{fmt(billWithoutSolar)} PKR</p>
          <p className="text-sm text-gray-500 mt-1">What you'd owe on your full usage with no panels at all</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-green-500 rounded-xl shadow-md p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Your actual bill with net metering</p>
          <p className="text-3xl font-bold">{fmt(finalBill)} PKR</p>
          <p className="text-sm opacity-90 mt-1">
            You saved {fmt(savings)} PKR ({savingsPercent}% lower) over this period
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Imported from grid</p>
            <span className="text-2xl">⬇️</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{fmt(unitsImported)}</p>
          <p className="text-sm text-gray-500 mt-1">kWh drawn from the grid</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Exported to grid</p>
            <span className="text-2xl">⬆️</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{fmt(unitsExported)}</p>
          <p className="text-sm text-gray-500 mt-1">kWh sent back from solar</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Net units</p>
            <span className="text-2xl">🔄</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{fmt(netUnits)}</p>
          <p className="text-sm text-gray-500 mt-1">imported − exported, netted first</p>
        </div>
      </div>

      {/* Bill Calculation Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Calculation Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Billed units (net import, after netting)</p>
              <p className="text-lg font-semibold text-gray-900">{fmt(billedUnits)} kWh</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Energy cost</p>
              <p className="text-xl font-bold text-gray-900">{fmt(energyCost)} PKR</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Fixed charges + GST (18%)</p>
              <p className="text-lg font-semibold text-gray-900">Added on top of energy cost</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">+{fmt(fixedCharge + gst)} PKR</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Credited units (months you exported more than you used)</p>
              <p className="text-lg font-semibold text-gray-900">{fmt(creditedUnits)} kWh</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Credit</p>
              <p className="text-xl font-bold text-green-600">-{fmt(exportCredit)} PKR</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg border-2 border-blue-300">
            <div>
              <p className="text-sm text-gray-600 font-medium">Final Bill</p>
              {creditBalance > 0 && (
                <p className="text-xs text-green-700 mt-0.5">
                  plus {fmt(creditBalance)} PKR in unused credit carried forward
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-700">{fmt(finalBill)} PKR</p>
            </div>
          </div>
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
            <Bar dataKey="billedUnits" fill="#3b82f6" name="Billed net (kWh)" radius={[8, 8, 0, 0]} />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billed net</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Without solar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saved</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyBreakdown.map((month, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{fmt(month.imported)} kWh</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{fmt(month.exported)} kWh</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">
                    {month.billedUnits > 0 ? `${fmt(month.billedUnits)} kWh` : `${fmt(month.creditedUnits)} kWh credited`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{fmt(month.finalBill)} PKR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fmt(month.billWithoutSolar)} PKR</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {fmt(month.savings)} PKR
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
                Every unit you export offsets a unit you'd otherwise buy at the full tariff rate
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