import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/image.png'; 
import bgImage from "../assets/bg.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <div
        className="min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20">
          {/* LEFT: Text */}
          <div className="md:w-1/2 text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Smart Net Metering &<br />Energy Optimization System
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              A comprehensive Final Year Project demonstrating intelligent energy management
              through net metering, solar optimization, and AI-powered appliance monitoring.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-teal-100 text-gray-700 px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Go to Dashboard
            </button>
          </div>

          {/* RIGHT: Hero Image with gradient border */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <div className="p-1 bg-gradient-to-br from-blue-500 via-teal-400 to-green-500 rounded-3xl">
              <img 
                src={heroImage} 
                alt="Smart Energy Hero" 
                className="w-full max-w-lg object-contain rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>

     {/* Feature Cards */}
<div className="grid md:grid-cols-3 gap-6 mb-12 mt-10 text-left">
  
  {/* 1️⃣ Net Metering
  <div className="p-1 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 bg-[length:200%_200%] animate-gradient-x rounded-2xl">
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Net Metering</h3>
      <p className="text-gray-600 text-sm">
        Track energy import/export with the grid. Monitor solar generation
        and calculate bill adjustments based on net energy flow.
      </p>
    </div>
  </div> */}

  {/* 2️⃣ Energy Optimization */}
  <div className="p-1 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 bg-[length:200%_200%] animate-gradient-x
 rounded-2xl">
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Energy Optimization</h3>
      <p className="text-gray-600 text-sm">
        AI-powered billing optimization leveraging solar energy data and
        consumption patterns to minimize monthly electricity costs.
      </p>
    </div>
  </div>

  {/* 3️⃣ Abnormality Detection */}
  <div className="p-1 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 bg-[length:200%_200%] animate-gradient-x
 rounded-2xl">
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Abnormality Detection</h3>
      <p className="text-gray-600 text-sm">
        Machine learning models identify unusual appliance consumption patterns,
        detect faults, and provide actionable energy-saving recommendations.
      </p>
    </div>
  </div>

</div>

    </div>
  );
};

export default Landing;
