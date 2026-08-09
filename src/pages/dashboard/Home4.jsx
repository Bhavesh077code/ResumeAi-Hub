import React from 'react';
import Navbar1 from '../../components/navbar/Navbar1';

function Home4() {
  return (
    <div className="min-h-screen bg-[#F8F7FF] font-['Inter'] overflow-x-hidden relative">
      {/* Background blobs - improved with better positioning and colors */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-3xl opacity-50 -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-gradient-to-tr from-indigo-100 to-fuchsia-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px] h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <Navbar1 />

      {/* Hero Section - Improved spacing and typography */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-20 pb-8 sm:pb-12 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Left Content - Enhanced hierarchy */}
        <div className="order-1 lg:order-none">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/90 border border-violet-200 shadow-sm text-xs sm:text-sm font-medium text-gray-700 backdrop-blur-sm hover:shadow-md transition">
            <span className="text-violet-600 text-base sm:text-lg">✨</span> 
            <span className="hidden xs:inline">AI-Powered • Trusted by 10,000+ Users</span>
            <span className="xs:hidden">AI-Powered</span>
          </div>

          <h1 className="mt-5 sm:mt-7 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] font-extrabold tracking-tight text-gray-900">
            Build a <br />
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">stunning resume</span> <br />
            in minutes
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg xl:text-xl leading-7 sm:leading-8 text-gray-500 max-w-lg">
            Create ATS-friendly resumes tailored to your role with AI. Save hours, stand out to recruiters, and land interviews faster.
          </p>

          <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold text-sm sm:text-base md:text-lg flex items-center gap-2 sm:gap-3 shadow-xl shadow-violet-200/60 hover:scale-[1.02] hover:shadow-violet-300/80 transition-all duration-300">
              <span className="text-base sm:text-xl">✨</span> 
              <span className="hidden xs:inline">Create Resume Free</span>
              <span className="xs:hidden">Get Started</span>
              <span className="text-xs sm:text-sm font-normal opacity-80">→</span>
            </button>
            <button className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200 font-semibold text-gray-700 text-sm sm:text-base md:text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
              View Templates
            </button>
          </div>

          <div className="mt-6 sm:mt-10 flex items-center gap-4 sm:gap-5">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=32" alt="user" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white ring-2 ring-violet-100 hover:ring-violet-300 transition" />
              <img src="https://i.pravatar.cc/100?img=15" alt="user" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white ring-2 ring-violet-100 hover:ring-violet-300 transition" />
              <img src="https://i.pravatar.cc/100?img=23" alt="user" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white ring-2 ring-violet-100 hover:ring-violet-300 transition" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-200 to-indigo-200 border-2 border-white flex items-center justify-center text-[10px] sm:text-xs font-bold text-violet-700">+1k</div>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="font-bold text-base sm:text-lg">4.9/5</span>
                <div className="flex text-amber-400 text-[10px] sm:text-sm">★★★★★</div>
              </div>
              <div className="text-[10px] sm:text-sm text-gray-500">from 2,000+ reviews</div>
            </div>
          </div>
        </div>

        {/* Right - Mockup with improved animations and design */}
        <div className="relative lg:h-[500px] xl:h-[600px] flex items-center order-2 lg:order-none mt-8 lg:mt-0">
          {/* Browser Window - Enhanced with better styling */}
          <div className="relative bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] border border-gray-100/80 p-1.5 sm:p-2 w-full max-w-sm sm:max-w-md md:max-w-xl mx-auto animate-[float_6s_ease-in-out_infinite] hover:shadow-[0_40px_100px_rgba(0,0,0,0.18)] transition-shadow duration-500">
            <div className="bg-[#F8F7FB] rounded-xl overflow-hidden">
              <div className="h-10 sm:h-12 bg-white/90 border-b flex items-center px-3 sm:px-5 justify-between backdrop-blur-sm">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 hover:bg-red-500 transition cursor-pointer"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition cursor-pointer"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 hover:bg-green-500 transition cursor-pointer"></div>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-600 bg-gray-100 px-3 sm:px-4 py-1 rounded-full">Resume Templates</span>
                <div className="w-10 sm:w-14"></div>
              </div>
              <div className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 bg-white rounded-xl p-3 sm:p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="font-bold text-sm sm:text-base">Alex Morgan</div>
                  <div className="text-xs sm:text-sm text-indigo-600 font-medium">Product Manager</div>
                  <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</div>
                  <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-start gap-1.5 sm:gap-2"><span className="text-indigo-400">•</span> <span>Led product strategy at Neso</span></div>
                    <div className="flex items-start gap-1.5 sm:gap-2"><span className="text-indigo-400">•</span> <span>Managed cross-functional teams</span></div>
                    <div className="flex items-start gap-1.5 sm:gap-2"><span className="text-indigo-400">•</span> <span>Drove 40% revenue growth</span></div>
                    <div className="flex items-start gap-1.5 sm:gap-2"><span className="text-indigo-400">•</span> <span>Launched 3 major features</span></div>
                  </div>
                </div>
                <div className="w-full sm:w-28 md:w-32 bg-indigo-50 rounded-xl p-3 sm:p-4 shadow-sm border border-indigo-100 flex flex-col justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-indigo-700">Alex Morgan</div>
                    <div className="text-[8px] sm:text-[10px] text-gray-500">ATS Ready</div>
                  </div>
                  <div className="mt-3 sm:mt-4 space-y-1.5 text-[8px] sm:text-[10px] text-gray-500">
                    <div className="flex items-center gap-1 sm:gap-1.5"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400"></span> 98/100 Score</div>
                    <div className="flex items-center gap-1 sm:gap-1.5"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400"></span> Skills Match</div>
                    <div className="flex items-center gap-1 sm:gap-1.5"><span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400"></span> Formatting</div>
                  </div>
                  <div className="mt-2 sm:mt-3 text-[6px] sm:text-[8px] text-indigo-500 font-semibold uppercase tracking-wider">✨ AI Optimized</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards - Improved positioning and animations */}
          <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-violet-100 p-3 sm:p-4 lg:p-5 flex gap-3 sm:gap-4 w-40 sm:w-48 lg:w-52 animate-[float_5s_ease-in-out_infinite] hover:scale-105 transition-transform duration-300 hidden xs:flex">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-base sm:text-xl shadow-lg">🛡️</div>
            <div>
              <div className="font-bold text-xs sm:text-sm">ATS Score: 98/100</div>
              <div className="text-[10px] sm:text-xs text-gray-600 leading-tight">Excellent — Applicant Tracking Ready</div>
            </div>
          </div>

          <div className="absolute bottom-12 sm:bottom-16 -left-4 lg:left-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-fuchsia-100 p-3 sm:p-4 lg:p-5 flex gap-3 sm:gap-4 w-48 sm:w-52 lg:w-56 animate-[float_5s_ease-in-out_infinite_1s] hover:scale-105 transition-transform duration-300 hidden sm:flex">
            <div className="text-fuchsia-500 text-xl sm:text-2xl">🪄</div>
            <div>
              <div className="font-bold text-xs sm:text-sm leading-tight">AI improved<br />12 bullet points</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">+35% stronger phrasing</div>
            </div>
          </div>

          <div className="absolute top-1/2 -left-6 lg:-left-10 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100 p-3 sm:p-4 flex gap-2 sm:gap-3 w-36 sm:w-44 animate-[float_6s_ease-in-out_infinite_2s] hover:scale-105 transition-transform duration-300 hidden md:flex">
            <div className="text-blue-500 text-base sm:text-xl">📈</div>
            <div>
              <div className="font-bold text-sm sm:text-base">2.4x</div>
              <div className="text-[10px] sm:text-xs text-gray-500">More interview calls</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Enhanced with better cards and animations */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[
          { icon: '✨', title: 'AI Suggestions', desc: 'Get personalized rewrite suggestions for each bullet point to highlight impact and results.', grad: 'from-fuchsia-400 to-indigo-400' },
          { icon: '🛡️', title: 'ATS Friendly', desc: 'Optimized formatting passes ATS scans. Clean, scannable layouts recruiters and software love.', grad: 'from-blue-400 to-indigo-500' },
          { icon: '📄', title: 'PDF Export', desc: 'Export high-quality PDF instantly. Print-ready and shareable with one click.', grad: 'from-fuchsia-400 to-blue-400' },
        ].map((card) => (
          <div
            key={card.title}
            className="group bg-white/80 backdrop-blur rounded-2xl border border-gray-100 p-5 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center hover:border-violet-200"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-2xl bg-gradient-to-br ${card.grad} flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h3 className="mt-4 sm:mt-5 lg:mt-6 font-bold text-base sm:text-lg lg:text-xl text-gray-800 group-hover:text-indigo-700 transition-colors">{card.title}</h3>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-6 sm:leading-7 text-gray-500 group-hover:text-gray-600 transition-colors">{card.desc}</p>
            <div className="mt-4 sm:mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-indigo-500 text-xs sm:text-sm font-semibold">Learn more →</span>
            </div>
          </div>
        ))}
      </section>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite;
        }
        /* Mobile responsive adjustments */
        @media (max-width: 640px) {
          .animate-\\[float_6s_ease-in-out_infinite\\] {
            animation: float 4s ease-in-out infinite;
          }
          .animate-\\[float_5s_ease-in-out_infinite\\] {
            animation: float 3.5s ease-in-out infinite;
          }
          .animate-\\[float_5s_ease-in-out_infinite_1s\\] {
            animation: float 3.5s ease-in-out infinite 0.5s;
          }
          .animate-\\[float_6s_ease-in-out_infinite_2s\\] {
            animation: float 4s ease-in-out infinite 1s;
          }
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:flex {
            display: flex;
          }
        }
        @media (min-width: 641px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:flex {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Home4;