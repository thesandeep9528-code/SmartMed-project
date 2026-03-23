import { useQueue } from '../context/QueueContext';
import { Activity, ShieldAlert, BarChart3, Radio, DatabaseZap, Users, Brain, HeartPulse } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Admin() {
  const { doctors, hospitals } = useQueue();

  // GROUP 3: AI Digital Twin Hospital Simulator (Future Crowd)
  const digitalTwinData = [
      { time: '14:00 (Now)', crowd: 140 },
      { time: '15:00', crowd: 180 },
      { time: '16:00', crowd: 220 }, // Surge predicted
      { time: '17:00', crowd: 150 },
      { time: '18:00', crowd: 90 },
  ];

  // GROUP 3: Walk-in vs Booked Prediction Data
  const walkinData = [
      { name: 'Dr. Smith', walkin: 4, booked: 8 },
      { name: 'Dr. Johnson', walkin: 2, booked: 13 },
      { name: 'Dr. Williams', walkin: 8, booked: 4 },
      { name: 'Dr. Brown', walkin: 1, booked: 9 },
  ];

  // GROUP 3: Crowd Density Calculation
  const totalCapacity = hospitals.reduce((acc, h) => acc + h.capacity, 0);
  const currentLoad = hospitals.reduce((acc, h) => acc + h.currentLoad, 0);
  const capPercent = Math.round((currentLoad / totalCapacity) * 100);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <DatabaseZap className="w-8 h-8 text-blue-500" /> Global Admin Hub
            </h1>
            <p className="mt-2 text-gray-400 font-medium">Network load balancing and Digital Twin simulation active.</p>
          </div>
          <div className="flex gap-4">
            {/* GROUP 3: Crowd Density Detection Badge */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Density</p>
                   <p className={`text-lg font-black ${capPercent > 80 ? 'text-red-500' : capPercent > 60 ? 'text-orange-500' : 'text-success-500'}`}>
                      {capPercent}% Capacity
                   </p>
                </div>
            </div>
            
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
               <Radio className="w-4 h-4 animate-pulse" /> AI Sync Offline-Ready
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* GROUP 3: AI Digital Twin Hospital Simulator */}
           <div className="bg-gray-800 border-gray-700 p-6 rounded-2xl shadow-2xl relative overflow-hidden group border hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                       <Brain className="w-4 h-4 text-purple-400" /> Digital Twin Simulator
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Predicting 4-hour forward crowd dynamics.</p>
                 </div>
                 {capPercent > 60 && (
                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                       SURGE AT 16:00
                    </span>
                 )}
              </div>
              
              <div className="h-64 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={digitalTwinData}>
                        <defs>
                            <linearGradient id="twinColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', color: '#fff' }} />
                        <Area type="monotone" dataKey="crowd" name="Simulated Patients" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#twinColor)" />
                     </AreaChart>
                  </ResponsiveContainer>
              </div>
           </div>

           {/* GROUP 3: Walk-in vs Booked Prediction */}
           <div className="bg-gray-800 border-gray-700 p-6 rounded-2xl shadow-2xl relative overflow-hidden border">
              
              <div className="mb-6">
                 <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" /> Walk-In Prediction Engine
                 </h3>
                 <p className="text-xs text-gray-500 mt-1">AI-adjusted queue mapping.</p>
              </div>

              <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={walkinData} margin={{ top: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} />
                        <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', color: '#fff' }} cursor={{fill: '#1f2937'}} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#9ca3af' }} />
                        <Bar dataKey="booked" name="AI Booked" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="walkin" name="Predicted Walk-ins" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
              </div>
           </div>

        </div>

        {/* Global Active Fleet (with Group 3 Fatigue Detection) */}
        <div className="pt-8">
          <h2 className="text-xl font-bold text-white mb-6 items-center flex justify-between">
             <span className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-gray-500" /> Live Fleet Hub</span>
             <span className="text-sm text-gray-500 font-medium">{doctors.length} Doctors Active</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => {
              const hosp = hospitals.find(h => h.id === doctor.hospitalId);
              // GROUP 3: Fatigue Detection Logic (e.g. >10 patients seen without a break)
              const isFatigued = doctor.patientsSeenToday > 10;

              return (
              <div key={doctor.id} className={`bg-gray-800 rounded-2xl shadow-xl transition-all relative overflow-hidden group border ${isFatigued ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'border-gray-700 hover:border-gray-600'}`}>
                
                {/* Doctor Fatigue Warning Banner */}
                {isFatigued && (
                   <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-black uppercase tracking-wider text-center py-1 absolute top-0 inset-x-0 w-full animate-pulse flex justify-center items-center gap-1 shadow-md z-20">
                      <HeartPulse className="w-3 h-3" /> System Warning: High Fatigue Level Detected
                   </div>
                )}

                <div className={`p-6 ${isFatigued ? 'pt-8' : ''}`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{doctor.name}</h3>
                       <p className="text-xs text-blue-400 font-bold bg-blue-500/10 inline-block px-2 py-0.5 rounded-md mt-1 mb-2 border border-blue-500/20">{hosp?.name}</p>
                       <p className="text-sm text-gray-400 font-medium line-clamp-1">{doctor.specialty}</p>
                     </div>
                     <span className={`px-2 py-1 flex items-center gap-1.5 rounded-md text-xs font-bold uppercase tracking-wide ${
                       doctor.status === 'Available' ? 'bg-success-500/10 text-success-400 border border-success-500/20' :
                       doctor.status === 'Busy' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                       'bg-gray-700 text-gray-400'
                     }`}>
                       {doctor.status === 'Available' && <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>}
                       {doctor.status}
                     </span>
                   </div>
                   
                   <div className="pt-4 mt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Live Load</p>
                       <p className={`mt-1 text-2xl font-black ${doctor.patientsQueue > 5 ? 'text-orange-400' : 'text-gray-100'}`}>{doctor.patientsQueue}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">AI Target Wait</p>
                       <p className="mt-1 text-2xl font-black text-blue-500">{Math.floor(doctor.avgWaitTime)}<span className="text-sm text-blue-500/50">m</span></p>
                     </div>
                   </div>
                </div>
              </div>
            )})}
          </div>
        </div>

      </div>
    </div>
  );
}
