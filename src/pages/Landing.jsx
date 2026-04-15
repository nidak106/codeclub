import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  BarChart, 
  MoveRight 
} from 'lucide-react';
import heroImage from '../assets/image.png'; 
import bgImage from "../assets/bg.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* --- BACKGROUND ORBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-teal-500/10 blur-[100px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.05] bg-repeat pointer-events-none" 
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: '100px' }}
        />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-teal-400 to-blue-600 p-2 rounded-xl">
            <Zap size={20} fill="white" />
          </div>
          <span className="text-xl font-black tracking-tighter italic">EnergySync</span>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest"
        >
          Dashboard
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* LEFT CONTENT: Massive Typography */}
          <div className="lg:w-3/5 space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full text-teal-400">
               <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Generation Energy AI</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-400 to-indigo-500">
                Grid Intelligence.
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              A comprehensive system for smart net metering, solar optimization, 
              and AI-driven appliance monitoring. Transform raw data into cost savings.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/dashboard')}
                className="group relative bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-3">
                  Get Started <MoveRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
              
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    User
                  </div>
                ))}
                <div className="pl-6 text-sm font-bold text-slate-400">+2.4k users optimized</div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: The Floating Visual */}
          <div className="lg:w-2/5 relative">
            <div className="relative z-10 animate-float">
              {/* Main Image */}
              <img 
                src={heroImage} 
                alt="Smart Energy Hero" 
                className="w-full max-w-md mx-auto drop-shadow-[0_35px_35px_rgba(20,184,166,0.3)]"
              />
              
              {/* Floating Status Card */}
              <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-500 rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.5)]">
                    <BarChart size={24} color="white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Live Savings</p>
                    <p className="text-2xl font-black tabular-nums">PKR 12,400</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backdrop Blur Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/20 blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </main>

      {/* --- FEATURE SECTION (Minimalist Cards) --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <MinimalCard 
            icon={<Layers className="text-teal-400" />}
            title="Net Metering"
            desc="Seamless bi-directional tracking of grid export and solar import."
          />

          <MinimalCard 
            icon={<Zap className="text-blue-400" />}
            title="Optimization"
            desc="AI-powered billing logic that learns from your daily habits."
          />

          <MinimalCard 
            icon={<ShieldCheck className="text-indigo-400" />}
            title="Monitoring"
            desc="Instant fault detection and real-time appliance health checks."
          />

        </div>
      </section>

      {/* Custom Floating Animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

const MinimalCard = ({ icon, title, desc }) => (
  <div className="group bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/[0.08] transition-all duration-500">
    <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;