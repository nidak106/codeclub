import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { applianceDetails } from '../data/dummyData';

const ApplianceInsights = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appliance Insights</h2>
        <p className="text-gray-600">
          Detailed analysis of individual appliance consumption patterns with AI-generated recommendations.
        </p>
      </div>

      {/* ML Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <span className="font-semibold">AI-Powered Analysis:</span> Suggestions are generated using machine learning
          models trained in Kaggle to detect abnormal patterns and provide energy-saving recommendations.
        </p>
      </div>

      {/* Appliance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {applianceDetails.map((appliance) => (
          <div
            key={appliance.id}
            className={`bg-white rounded-xl shadow-md border-2 p-6 ${
              appliance.status === 'Abnormal'
                ? 'border-red-300'
                : appliance.status === 'High Consumption'
                ? 'border-orange-300'
                : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{appliance.name}</h3>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  appliance.status === 'Normal'
                    ? 'bg-green-100 text-green-800'
                    : appliance.status === 'Abnormal'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {appliance.status}
              </span>
            </div>

            {/* Current Usage */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Daily Usage</p>
              <p className="text-3xl font-bold text-gray-900">{appliance.currentUsage} kWh</p>
            </div>

            {/* Weekly Trend Chart */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">7-Day Usage Trend</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={appliance.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke={
                      appliance.status === 'Normal'
                        ? '#10b981'
                        : appliance.status === 'Abnormal'
                        ? '#ef4444'
                        : '#f59e0b'
                    }
                    strokeWidth={2}
                    dot={{ fill: appliance.status === 'Normal' ? '#10b981' : appliance.status === 'Abnormal' ? '#ef4444' : '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Suggestion */}
            <div
              className={`p-4 rounded-lg ${
                appliance.status === 'Abnormal'
                  ? 'bg-red-50 border border-red-200'
                  : appliance.status === 'High Consumption'
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-xl mt-0.5">💡</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">AI Recommendation</p>
                  <p className="text-sm text-gray-700">{appliance.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Data Collection</p>
              <p className="text-sm text-gray-600">
                Real-time monitoring of individual appliance consumption using smart meters.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">ML Analysis</p>
              <p className="text-sm text-gray-600">
                Machine learning models detect anomalies and predict optimal usage patterns.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-medium text-gray-900 mb-1">Cost Savings</p>
              <p className="text-sm text-gray-600">
                Actionable insights help reduce energy waste and lower monthly bills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplianceInsights;
