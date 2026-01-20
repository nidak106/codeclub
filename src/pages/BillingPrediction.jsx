import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { billingPrediction } from '../data/dummyData';

const BillingPrediction = () => {
  const { daily, monthly } = billingPrediction;

  const calculateChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const changeVsPrevious = calculateChange(monthly.currentMonth, monthly.previousMonth);
  const changeVsAverage = calculateChange(monthly.currentMonth, monthly.averageLast3Months);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Prediction</h2>
        <p className="text-gray-600">
          AI-powered predictions based on historical consumption patterns and solar generation data.
        </p>
      </div>

      {/* ML Model Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">ML Model:</span> Predictions generated using time-series forecasting models
          trained in Kaggle. Models consider seasonality, appliance usage patterns, and solar generation trends.
        </p>
      </div>

      {/* Monthly Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Current Month Bill</p>
          <p className="text-3xl font-bold text-gray-900">
            {monthly.currentMonth.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">PKR</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Predicted Next Month</p>
          <p className="text-3xl font-bold text-blue-600">
            {monthly.predictedNextMonth.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">PKR</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Previous Month</p>
          <p className="text-3xl font-bold text-gray-900">
            {monthly.previousMonth.toLocaleString()}
          </p>
          <p className={`text-sm mt-1 font-medium ${changeVsPrevious < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {changeVsPrevious > 0 ? '+' : ''}{changeVsPrevious}% vs last month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">3-Month Average</p>
          <p className="text-3xl font-bold text-gray-900">
            {monthly.averageLast3Months.toLocaleString()}
          </p>
          <p className={`text-sm mt-1 font-medium ${changeVsAverage < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {changeVsAverage > 0 ? '+' : ''}{changeVsAverage}% vs average
          </p>
        </div>
      </div>

      {/* Daily Prediction Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Bill Prediction</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'PKR', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Predicted (PKR)"
              dot={{ fill: '#3b82f6', r: 5 }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={2}
              name="Actual (PKR)"
              dot={{ fill: '#10b981', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4">
          Dashed line represents predicted values. Solid line shows actual recorded values.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Month-over-Month Comparison</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Previous Month</span>
              <span className="font-bold text-gray-900">{monthly.previousMonth.toLocaleString()} PKR</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-700 font-medium">Current Month</span>
              <span className="font-bold text-blue-700">{monthly.currentMonth.toLocaleString()} PKR</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-green-700">Difference</span>
              <span className={`font-bold ${changeVsPrevious < 0 ? 'text-green-700' : 'text-red-700'}`}>
                {changeVsPrevious > 0 ? '+' : ''}{changeVsPrevious}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-xl">📈</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">Trend Analysis</p>
                <p className="text-sm text-gray-600">
                  Your bill is {changeVsPrevious < 0 ? 'decreasing' : 'increasing'} compared to last month due to{' '}
                  {changeVsPrevious < 0 ? 'increased solar generation' : 'seasonal consumption changes'}.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">Optimization Tip</p>
                <p className="text-sm text-gray-600">
                  Shift high-power appliance usage to daytime hours (10 AM - 4 PM) when solar generation peaks
                  to maximize savings.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🎯</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">Forecast Accuracy</p>
                <p className="text-sm text-gray-600">
                  ML model maintains 94% prediction accuracy based on last 6 months of data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Prediction Model</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Model Type</p>
            <p className="text-sm text-gray-600">
              Time-series forecasting with LSTM neural network
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Training Data</p>
            <p className="text-sm text-gray-600">
              Historical consumption data, solar generation, weather patterns
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Update Frequency</p>
            <p className="text-sm text-gray-600">
              Model retrains daily with new data for improved accuracy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPrediction;
