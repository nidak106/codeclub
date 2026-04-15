import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  LayoutGrid, 
  Flame, 
  Droplets, 
  Snowflake, 
  Wind, 
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ApplianceInsights = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppliance, setSelectedAppliance] = useState('Fridge');

  const applianceList = [
    { id: 'Fridge', label: 'Fridge', icon: <Snowflake size={14}/> },
    { id: 'AC', label: 'AC', icon: <Wind size={14}/> },
    { id: 'Washing Machine', label: 'Laundry', icon: <Droplets size={14}/> },
    { id: 'Kitchen Appliances', label: 'Kitchen', icon: <Flame size={14}/> },
    { id: 'Other Appliances', label: 'Others', icon: <PlusCircle size={14}/> }
  ];

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/appliance-faults?appliance=${selectedAppliance}&threshold=2`);
        const data = await response.json();
        if (data.status === 'success') {
          setAnomalies(data.anomalies);
        } else {
          setError(data.message || "Failed to load data");
        }
      } catch (err) {
        setError("Backend Connection Offline");
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, [selectedAppliance]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 animate-pulse" />
      </div>
      <p className="mt-4 text-slate-500 font-black tracking-[0.2em] text-[10px] uppercase">Scanning {selectedAppliance} Logic...</p>
    </div>
  );

  return (
    <div className="relative min-h-screen p-4 md:p-8 bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      
      {/* PERSISTENT BACKGROUND THEME */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23475569' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg shadow-slate-200">
                <LayoutGrid size={24}/>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-800 italic">Device<span className="text-blue-600 font-black">Audit</span></h1>
            </div>
            <p className="text-slate-500 text-sm font-semibold ml-14">Granular Fault Diagnostics</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Monitoring</span>
          </div>
        </header>

        {/* APPLIANCE SELECTOR (Segmented UI) */}
        <nav className="bg-white/60 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 flex flex-wrap gap-2">
          {applianceList.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedAppliance(app.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                selectedAppliance === app.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-300 scale-105'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/80'
              }`}
            >
              {app.icon}
              {app.label}
            </button>
          ))}
        </nav>

        {/* SUMMARY STATUS */}
        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
             <h2 className="text-2xl font-black italic">Diagnostics: {selectedAppliance}</h2>
             <p className="text-blue-100 text-xs font-medium max-w-md opacity-80">
               Using a 7-day Moving Window Z-Score to isolate abnormal spikes in {selectedAppliance} behavior.
             </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Anomalies Found</span>
             <span className="text-3xl font-black">{anomalies.length} Events</span>
          </div>
          <Activity className="absolute -right-10 -bottom-10 opacity-10 rotate-12" size={240} />
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {anomalies.length === 0 ? (
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Operational Integrity Verified</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                No abnormal spikes detected for the {selectedAppliance} within current threshold parameters.
              </p>
            </div>
          ) : (
            anomalies.map((item, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 shadow-xl shadow-slate-200/50 group hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-3 rounded-2xl text-red-500 group-hover:animate-bounce">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Log</p>
                        <h3 className="text-lg font-black text-slate-800">{item.Date}</h3>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-red-600">+{item.zscore.toFixed(1)}σ</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Deviation</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peak Load</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-800">{item.Total_Consumption.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-slate-400">kWh</span>
                    </div>
                  </div>
                  <div className="border-l border-slate-200 pl-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leakage Cost</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-red-400">PKR</span>
                      <span className="text-xl font-black text-red-600">{item.Extra_Cost.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white border border-slate-100 p-4 rounded-2xl">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ShieldAlert size={16} className="text-blue-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                    Detected an abnormal fluctuation exceeding <span className="text-blue-600 font-bold">2.0 standard deviations</span> from baseline consumption.
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplianceInsights;