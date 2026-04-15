import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Activity, AlertTriangle, TrendingDown, Zap, 
  DollarSign, Calendar, CheckCircle2 
} from 'lucide-react';

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
        const [statsRes, anomRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/stats`),
          fetch(`${API_BASE_URL}/fault-detection/anomalies?threshold=2`)
        ]);

        const stats = await statsRes.json();
        const anomalies = await anomRes.json();

        setData({
          summary: stats.status === 'success' ? stats : null,
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

  if (data.loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <Zap className="absolute text-blue-600 w-6 h-6 animate-pulse" />
      </div>
      <p className="mt-4 text-slate-500 font-semibold tracking-wide uppercase text-xs">Initializing Intelligence...</p>
    </div>
  );

  const { summary, anomalies } = data;
  const todayCost = summary?.today?.cost || 0;
  const weekCost = summary?.last_7_days?.cost || 0;
  const monthCost = summary?.current_month?.cost || 0;
  const optimizedBill = monthCost * 0.85;

  return (
    <div className="relative min-h-screen p-4 md:p-8 bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      
      {/* ADVANCED BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* The Technical Grid */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23475569' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>
        
        {/* Animated Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-gradient-to-br from-blue-400/20 to-transparent blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-tr from-indigo-400/10 to-transparent blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-800">
              Energy<span className="text-blue-600">Sync</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              Real-time SARIMAX Backend Active
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-bold text-slate-700">Database Synchronized</span>
          </div>
        </header>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Daily Consumption" value={todayCost} sub="Live Load" icon={<Zap />} color="amber" />
          <StatCard title="7-Day Rolling" value={weekCost} sub="Weekly Avg" icon={<Calendar />} color="blue" />
          <StatCard title="Projected Month" value={monthCost} sub="Est. Statement" icon={<DollarSign />} color="indigo" />

          {/* AI SAVINGS HERO CARD */}
          <div className="bg-slate-900 rounded-[2rem] p-7 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <TrendingDown className="text-emerald-400 w-6 h-6" />
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-bold uppercase">AI Prediction</span>
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Efficiency Goal</p>
                <p className="text-3xl font-bold mt-1">PKR {Math.round(optimizedBill).toLocaleString()}</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase">
                  <span className="text-emerald-400">Target: -15%</span>
                  <span className="text-slate-500">Optimizing...</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 w-[85%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                </div>
              </div>
            </div>
            <Activity className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-700" size={160} />
          </div>
        </div>

        {/* MAIN VISUALIZATION AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CHART CARD */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Cost Distribution</h3>
                <p className="text-xs text-slate-400 font-medium">Comparison across active billing cycles</p>
              </div>
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button className="px-3 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-slate-700">Cost</button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Usage</button>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Latest 24h', total: todayCost },
                  { name: 'Last 7 Days', total: weekCost },
                  { name: 'Current Month', total: monthCost },
                ]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }} 
                  />
                  <Bar dataKey="total" radius={[10, 10, 10, 10]} barSize={50}>
                    <Cell fill="#FCD34D" /> {/* Today */}
                    <Cell fill="#3B82F6" /> {/* Week */}
                    <Cell fill="#6366F1" /> {/* Month */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ANOMALY FEED CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col">
            <div className="p-7 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Fault Detection</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Z-Score Analysis</p>
              </div>
              <div className="bg-red-50 text-red-500 p-2 rounded-xl">
                <AlertTriangle size={20} />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[400px] p-6 space-y-4">
              {anomalies.length > 0 ? anomalies.map((item, idx) => (
                <div key={idx} className="group p-5 rounded-2xl border border-slate-100 bg-white/50 hover:border-red-100 hover:bg-red-50/50 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.Date}</span>
                    <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-bold italic">
                      Critical Error
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-lg font-bold text-slate-800">{item.Total_Consumption.toFixed(1)} <span className="text-xs font-medium text-slate-400 uppercase">kWh</span></p>
                      <p className="text-[11px] text-red-500 font-bold">Waste: PKR {item.Extra_Cost.toFixed(0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-700">+{item.zscore.toFixed(1)}σ</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Deviation</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800">All Systems Clear</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[180px]">No power leaks or anomalies detected today.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, color }) => {
  const themes = {
    amber: "bg-amber-100 text-amber-600 shadow-amber-100/50",
    blue: "bg-blue-100 text-blue-600 shadow-blue-100/50",
    indigo: "bg-indigo-100 text-indigo-600 shadow-indigo-100/50"
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-7 border border-white shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${themes[color]}`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-slate-400">PKR</span>
        <span className="text-3xl font-black text-slate-800 tabular-nums">
          {Math.round(value).toLocaleString()}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 py-1 px-3 bg-slate-50 rounded-full w-fit border border-slate-100">
        <Activity size={12} className="text-slate-400" />
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{sub}</span>
      </div>
    </div>
  );
};

export default DashboardOverview;