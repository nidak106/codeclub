import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  summaryData,
  dailyEnergyData,
  monthlyBillComparison,
  netEnergyFlow,
  applianceConsumption,
  applianceAbnormalities
} from '../data/dummyData';

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Sample Data Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Note:</span> This dashboard displays sample data for demonstration purposes.
          Connect to actual API endpoints to display real-time energy data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Consumed</p>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{summaryData.totalConsumed}</p>
          <p className="text-sm text-gray-500 mt-1">kWh</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Solar Generated</p>
            <span className="text-2xl">☀️</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{summaryData.solarGenerated}</p>
          <p className="text-sm text-gray-500 mt-1">kWh</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Net Energy</p>
            <span className="text-2xl">🔄</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{Math.abs(summaryData.netEnergy)}</p>
          <p className="text-sm text-gray-500 mt-1">
            kWh {summaryData.netEnergy < 0 ? 'Exported' : 'Imported'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Estimated Bill</p>
            <span className="text-2xl">💵</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {summaryData.estimatedBill.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">PKR</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Optimized Bill</p>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-3xl font-bold">
            {summaryData.optimizedBill.toLocaleString()}
          </p>
          <p className="text-sm opacity-90 mt-1">
            PKR (Save {summaryData.estimatedBill - summaryData.optimizedBill} PKR)
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Energy Consumption vs Solar Generation */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Energy: Consumption vs Solar Generation
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyEnergyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#ef4444"
                strokeWidth={2}
                name="Consumption (kWh)"
                dot={{ fill: '#ef4444' }}
              />
              <Line
                type="monotone"
                dataKey="solar"
                stroke="#10b981"
                strokeWidth={2}
                name="Solar (kWh)"
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bill Comparison */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Bill: Before vs After Optimization
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBillComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="beforeOptimization"
                fill="#ef4444"
                name="Before (PKR)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="afterOptimization"
                fill="#10b981"
                name="After (PKR)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Net Energy Flow */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Net Energy Flow: Import vs Export
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={netEnergyFlow}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="import"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Import (kWh)"
              />
              <Area
                type="monotone"
                dataKey="export"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Export (kWh)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Appliance-wise Consumption */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appliance-wise Energy Consumption
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={applianceConsumption}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {applianceConsumption.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Abnormality Detection Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Appliance Abnormality Detection
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered detection of unusual consumption patterns
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Normal Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applianceAbnormalities.map((appliance) => (
                <tr key={appliance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appliance.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appliance.normalUsage} kWh</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appliance.currentUsage} kWh</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appliance.status === 'Normal'
                          ? 'bg-green-100 text-green-800'
                          : appliance.status === 'Abnormal'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {appliance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md" title={appliance.reason}>
                      {appliance.reason}
                    </div>
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
