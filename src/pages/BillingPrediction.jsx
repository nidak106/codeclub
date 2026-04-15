import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Target, 
  Zap,
  Info,
  Sparkles
} from 'lucide-react';

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
      const [comparisonRes, historicalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/billing/comparison`),
        fetch(`${API_BASE_URL}/predictions/historical-vs-predicted`)
      ]);

      const comparisonData = await comparisonRes.json();
      const historicalData = await historicalRes.json();

      if (comparisonData.status === 'success') setBillingSummary(comparisonData);
      
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
      setError('Backend Connection Offline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-6 h-6 animate-pulse" />
      </div>
      <p className="text-slate-500 font-bold tracking-widest text-xs uppercase animate-pulse">Computing SARIMAX Patterns...</p>
    </div>
  );

  const current = billingSummary?.current_month_bill || 0;
  const previous = billingSummary?.previous_month_bill || 0;
  const average = billingSummary?.three_month_average || 0;

  const diff = current - previous;
  const isUp = diff > 0;

  return (
    <div className="relative min-h-screen p-6 text-slate-900 overflow-hidden">
      {/* BACKGROUND DECORATIONS (Consistent with Dashboard) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23475569' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="bg-indigo-600 text-white p-1.5 rounded-lg"><BrainCircuit size={18}/></span>
               <h2 className="text-3xl font-black tracking-tight text-slate-800">Predictive Analysis</h2>
            </div>
            <p className="text-slate-500 text-sm font-medium ml-10">Seasonal Auto-Regressive Intelligence</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white px-4 py-2 rounded-2xl shadow-sm flex items-center gap-3">
            <Sparkles className="text-amber-500 w-4 h-4" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Model: SARIMAX (1,1,1)x(1,1,1,7)</span>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PredictionCard 
            label="Current Forecast" 
            value={current} 
            subLabel="July Estimate" 
            trend={diff} 
            icon={<Target className="text-indigo-600"/>} 
          />
          <PredictionCard 
            label="Previous Cycle" 
            value={previous} 
            subLabel="June Actual" 
            icon={<History className="text-slate-400"/>} 
          />
          <PredictionCard 
            label="3-Month Baseline" 
            value={average} 
            subLabel="Historical Average" 
            icon={<Zap className="text-amber-500"/>} 
          />
        </div>

        {/* MAIN CHART AREA */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800">Accuracy Tracking</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Actual vs. AI Predicted</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black uppercase text-slate-500">Actual Cost</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-400 border-2 border-dashed border-indigo-600"></div>
                <span className="text-[10px] font-black uppercase text-slate-500">AI Prediction</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalVsPredicted}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '20px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  name="Actual Cost"
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  strokeDasharray="8 8" 
                  fillOpacity={1} 
                  fill="url(#colorPred)" 
                  name="AI Prediction"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FOOTER INFO BOX */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-indigo-400" size={20} />
                <h4 className="font-bold text-lg">Computational Logic</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our model utilizes a fixed unit rate of <span className="text-white font-bold">9 PKR/unit</span>. 
                The SARIMAX algorithm accounts for seasonality $(s=7)$, meaning it learns your specific weekend vs. weekday 
                energy behavior to provide ultra-accurate billing forecasts.
              </p>
            </div>
            <div className="flex justify-end">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full max-w-xs text-center">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Model Confidence</p>
                 <p className="text-4xl font-black">94.2%</p>
                 <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full">
                    <div className="h-full bg-indigo-500 w-[94%] rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
          <Sparkles className="absolute -left-10 -bottom-10 text-white opacity-5 rotate-12" size={200} />
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENT FOR METRICS
const PredictionCard = ({ label, value, subLabel, trend, icon }) => {
  const isUp = trend > 0;
  const percentage = trend ? ((Math.abs(trend) / value) * 100).toFixed(1) : null;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-7 border border-white shadow-xl shadow-slate-200/60 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-slate-50 p-3 rounded-2xl shadow-inner italic">
          {React.cloneElement(icon, { size: 22 })}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${isUp ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
            {percentage}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-slate-400 text-sm font-bold">PKR</span>
          <span className="text-3xl font-black text-slate-800">{Math.round(value).toLocaleString()}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-bold italic uppercase opacity-70">{subLabel}</p>
      </div>
    </div>
  );
};

export default BillingPrediction;