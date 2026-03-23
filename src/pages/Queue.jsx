import { useQueue } from '../context/QueueContext';
import { Activity } from 'lucide-react';

export default function Queue() {
  const { doctors } = useQueue();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary-500/20 rounded-full mb-6">
            <Activity className="w-12 h-12 text-primary-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-widest uppercase">Live Queue</h1>
          <p className="mt-4 text-xl text-gray-400 font-medium">Please check your position on the board</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className={`p-6 border-b border-gray-700 flex justify-between items-center ${
                doctor.status === 'Available' ? 'bg-success-500/10' :
                doctor.status === 'Busy' ? 'bg-orange-500/10' :
                'bg-gray-700/50'
              }`}>
                <h2 className="text-2xl font-bold">{doctor.name}</h2>
                <div className={`w-4 h-4 rounded-full ${
                  doctor.status === 'Available' ? 'bg-success-500 shadow-[0_0_10px_#10b981] animate-pulse' :
                  doctor.status === 'Busy' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`}></div>
              </div>
              
              <div className="p-8 text-center text-gray-300 flex border-b border-gray-700 items-baseline justify-center gap-2">
                 <span className="text-6xl font-black text-white">{doctor.patientsQueue}</span>
                 <span className="text-lg font-medium text-gray-400 uppercase tracking-widest">Waiting</span>
              </div>
              
              <div className="p-4 bg-gray-900 text-center">
                 <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Est. Wait: <span className="text-white text-lg font-bold">{doctor.avgWaitTime}m</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
