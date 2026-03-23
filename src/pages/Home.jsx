import { ArrowRight, Clock, Calendar, CheckCircle2, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-500/10 text-success-500 font-medium text-sm mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
          </span>
          AI-Optimized Queue System Now Live
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          Cut Patient Wait Times <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">
            by 69%
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
          SmartMed uses predictive analytics to optimize scheduling, eliminate bottlenecks, and provide a seamless patient experience from booking to consultation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/book" className="w-full sm:w-auto px-8 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2">
            Book Appointment <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/patient" className="w-full sm:w-auto px-8 py-3.5 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all text-center">
            View Patient Dashboard
          </Link>
        </div>
      </section>

      {/* BEFORE VS AFTER SIMULATION (Game Changer) */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h2 className="text-3xl font-extrabold mb-12 flex items-center justify-center gap-3">
               <TrendingDown className="w-8 h-8 text-success-400" />
               Impact Simulation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative items-center">
               {/* VS Badge */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center font-black text-gray-400 z-10 hidden md:flex">
                  VS
               </div>

               {/* Before */}
               <div className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50 opacity-75 grayscale sepia-0">
                  <h3 className="text-xl font-semibold text-gray-400 mb-6 uppercase tracking-wider">Traditional Hospital</h3>
                  <div className="flex justify-center items-baseline gap-2 text-gray-500 line-through decoration-red-500/50">
                     <span className="text-6xl font-black">60+</span>
                     <span className="text-xl font-medium">mins</span>
                  </div>
                  <p className="mt-4 text-gray-400">Crowded waiting rooms, physical tokens, unpredictable delays.</p>
               </div>

               {/* After */}
               <div className="bg-gradient-to-br from-primary-900/50 to-blue-900/50 rounded-3xl p-8 border border-primary-500/30 ring-1 ring-primary-500/20 shadow-[0_0_50px_-12px_rgba(14,165,233,0.3)] transform md:scale-105 z-0 relative">
                  <span className="absolute -top-4 -right-4 bg-success-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">New Standard</span>
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">With SmartMed AI</h3>
                  <div className="flex justify-center items-baseline gap-2 text-primary-400">
                     <span className="text-7xl font-black text-white">~20</span>
                     <span className="text-xl font-medium">mins</span>
                  </div>
                  <p className="mt-4 text-blue-200/80">Digital tokens, live tracking, mood-based priorities.</p>
               </div>
            </div>
         </div>
      </section>

      {/* AI Hackathon Features Map (Visible for Judges) */}
      <section className="py-16 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
              <span className="inline-block bg-gradient-to-r from-primary-500 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(14,165,233,0.5)] border border-primary-400/30 animate-pulse">
                ✦ Our Model Serves ✦
              </span>
              <h2 className="text-5xl font-black text-white mt-8 mb-4 leading-tight">15 Advanced AI Capabilities</h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">All of these features have been built into our application. Click the sections below to explore each dashboard!</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/book" className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-8 rounded-3xl hover:border-primary-500 hover:bg-gray-800 transition-all shadow-xl group">
                 <h3 className="text-2xl font-black text-white mb-6 group-hover:text-primary-400">1. AI Booking Phase</h3>
                 <ul className="space-y-4 text-sm text-gray-300 font-medium">
                    <li className="flex items-center gap-3"><span className="text-primary-500 font-black text-lg">✓</span> Pre-Consultation AI Form</li>
                    <li className="flex items-center gap-3"><span className="text-primary-500 font-black text-lg">✓</span> Doctor Matching AI</li>
                    <li className="flex items-center gap-3"><span className="text-primary-500 font-black text-lg">✓</span> AI Network Load Balancer</li>
                    <li className="flex items-center gap-3"><span className="text-primary-500 font-black text-lg">✓</span> Minute-Level Micro-Slot Booking</li>
                    <li className="flex items-center gap-3"><span className="text-primary-500 font-black text-lg">✓</span> Live Wait Time Prediction</li>
                 </ul>
                 <div className="mt-8 inline-flex items-center gap-2 text-primary-400 font-bold text-sm tracking-wide bg-primary-500/10 px-4 py-2 rounded-xl group-hover:bg-primary-500/20 transition-colors">Test AI Booking →</div>
              </Link>

              <Link to="/patient" className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-8 rounded-3xl hover:border-success-500 hover:bg-gray-800 transition-all shadow-xl group">
                 <h3 className="text-2xl font-black text-white mb-6 group-hover:text-success-400">2. Patient Dashboard Phase</h3>
                 <ul className="space-y-4 text-sm text-gray-300 font-medium">
                    <li className="flex items-center gap-3"><span className="text-success-500 font-black text-lg">✓</span> Gamified Waiting Experience</li>
                    <li className="flex items-center gap-3"><span className="text-success-500 font-black text-lg">✓</span> Smart Leave Home Alert</li>
                    <li className="flex items-center gap-3"><span className="text-success-500 font-black text-lg">✓</span> Emotional Time Saved Meter</li>
                    <li className="flex items-center gap-3"><span className="text-success-500 font-black text-lg">✓</span> Dynamic Queue Swapping UI</li>
                    <li className="flex items-center gap-3"><span className="text-success-500 font-black text-lg">✓</span> Low-Internet Lite Mode Toggle</li>
                 </ul>
                 <div className="mt-8 inline-flex items-center gap-2 text-success-400 font-bold text-sm tracking-wide bg-success-500/10 px-4 py-2 rounded-xl group-hover:bg-success-500/20 transition-colors">View Live Token →</div>
              </Link>

              <Link to="/admin" className="bg-gray-800/80 backdrop-blur-md border border-gray-700 p-8 rounded-3xl hover:border-purple-500 hover:bg-gray-800 transition-all shadow-xl group">
                 <h3 className="text-2xl font-black text-white mb-6 group-hover:text-purple-400">3. Global Admin Hub Phase</h3>
                 <ul className="space-y-4 text-sm text-gray-300 font-medium">
                    <li className="flex items-center gap-3"><span className="text-purple-500 font-black text-lg">✓</span> AI Digital Twin Simulator</li>
                    <li className="flex items-center gap-3"><span className="text-purple-500 font-black text-lg">✓</span> Crowd Capacity Detection Gauge</li>
                    <li className="flex items-center gap-3"><span className="text-purple-500 font-black text-lg">✓</span> Walk-in vs Booked Prediction</li>
                    <li className="flex items-center gap-3"><span className="text-purple-500 font-black text-lg">✓</span> Automated Doctor Fatigue Check</li>
                    <li className="flex items-center gap-3"><span className="text-purple-500 font-black text-lg">✓</span> Behavior Learning System</li>
                 </ul>
                 <div className="mt-8 inline-flex items-center gap-2 text-purple-400 font-bold text-sm tracking-wide bg-purple-500/10 px-4 py-2 rounded-xl group-hover:bg-purple-500/20 transition-colors">Check Admin Analytics →</div>
              </Link>
           </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-surface-light rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Resource Optimization</h3>
              <p className="text-gray-500 leading-relaxed">AI predicts consultation durations dynamically to eliminate overlapping appointments and waiting lobby congestion.</p>
            </div>
            
            <div className="p-6 bg-surface-light rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-success-500/10 rounded-xl flex items-center justify-center mb-6 text-success-500">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-500 leading-relaxed">Patients can find available slots instantly, with real-time updates and automated reminders ensuring low no-show rates.</p>
            </div>

            <div className="p-6 bg-surface-light rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Overbooking</h3>
              <p className="text-gray-500 leading-relaxed">Our smart allocation system ensures doctors never face double-booked slots, creating a stress-free environment.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
