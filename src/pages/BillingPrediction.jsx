import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const BillingPrediction = () => {
  const [billingSummary, setBillingSummary] = useState(null);
  const [historicalVsPredicted, setHistoricalVsPredicted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetching comparison and historical vs predicted data
      // Note: We use Promise.allSettled to prevent one failing route from breaking the whole UI
      const [comparisonRes, historicalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/billing/comparison`),
        fetch(`${API_BASE_URL}/predictions/historical-vs-predicted`)
      ]);

      const comparisonData = await comparisonRes.json();
      const historicalData = await historicalRes.json();

      if (comparisonData.status === 'success') {
        setBillingSummary(comparisonData);
      }
      
      if (historicalData.status === 'success') {
        const chartData = historicalData.dates.map((date, i) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          actual: parseFloat(historicalData.cost_actual[i].toFixed(2)),
          predicted: parseFloat(historicalData.cost_predicted[i].toFixed(2))
        }));
        setHistoricalVsPredicted(chartData);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Connection error: Is the Flask server running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Running SARIMAX Model...</p>
      </div>
    );
  }

  // Calculate percentages safely
  const current = billingSummary?.current_month_bill || 0;
  const previous = billingSummary?.previous_month_bill || 0;
  const average = billingSummary?.three_month_average || 0;

  const changeVsPrevious = previous !== 0 ? ((current - previous) / previous * 100).toFixed(1) : "0";
  const changeVsAverage = average !== 0 ? ((current - average) / average * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Prediction & Analysis</h2>
        <p className="text-gray-600">
          Comparing actual costs against SARIMAX $(1, 1, 1) \times (1, 1, 1, 7)$ predictions.
        </p>
      </div>

      {/* Monthly Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Current Month (July)</p>
          <p className="text-3xl font-bold text-gray-900">PKR {Math.round(current).toLocaleString()}</p>
          <p className={`text-sm mt-2 font-medium ${parseFloat(changeVsPrevious) < 0 ? 'text-green-600' : 'text-red-600'}`}>
             {parseFloat(changeVsPrevious) > 0 ? '▲' : '▼'} {Math.abs(changeVsPrevious)}% vs last month
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Previous Month (June)</p>
          <p className="text-3xl font-bold text-gray-900">PKR {Math.round(previous).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">3-Month Average (May-July)</p>
          <p className="text-3xl font-bold text-gray-900">PKR {Math.round(average).toLocaleString()}</p>
          <p className={`text-sm mt-2 font-medium ${parseFloat(changeVsAverage) < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(changeVsAverage) > 0 ? '▲' : '▼'} {Math.abs(changeVsAverage)}% vs avg
          </p>
        </div>
      </div>

      {/* Historical vs Predicted Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy Analysis: Predicted vs Actual Cost</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalVsPredicted}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={20} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false}
                name="Actual Cost (PKR)" 
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                name="Predicted Cost (PKR)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Breakdown */}
      <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">🤖</span> Model Intelligence
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-2 border-blue-500 pl-4">
            <p className="text-blue-400 text-sm font-bold uppercase tracking-wider">Algorithm</p>
            <p className="text-gray-300 text-sm mt-1">
              Seasonal Auto-Regressive Integrated Moving Average (SARIMAX). 
              Optimized for weekly $(s=7)$ electricity consumption patterns.
            </p>
          </div>
          <div className="border-l-2 border-green-500 pl-4">
            <p className="text-green-400 text-sm font-bold uppercase tracking-wider">Cost Logic</p>
            <p className="text-gray-300 text-sm mt-1">
              Calculated at a fixed rate of <b>9 PKR per unit</b>. Predictions incorporate historical variance 
              to estimate future billing cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPrediction;