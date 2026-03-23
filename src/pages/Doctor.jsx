import { useQueue } from '../context/QueueContext';
import { Users, Timer, CheckCircle, TrendingUp } from 'lucide-react';

export default function Doctor() {
  const { doctors } = useQueue();
  const currentDoctor = doctors[0]; // Mocking login as Dr. Smith

  const mockPatients = [
    { id: 101, name: 'Alice Walker', status: 'In Session', time: '10:00 AM' },
    { id: 102, name: 'Bob Singer', status: 'Waiting', time: '10:30 AM' },
    { id: 103, name: 'Charlie Davis', status: 'Waiting', time: '11:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentDoctor.name}</h1>
            <p className="mt-2 text-gray-500">Here is your schedule and queue overview for today.</p>
          </div>
          <div className="flex items-center gap-2 bg-success-500/10 text-success-500 px-4 py-2 rounded-full font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
            </span>
            Status: {currentDoctor.status}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-primary-100 p-4 rounded-xl text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Patients Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-100 p-4 rounded-xl text-orange-600">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Consult Time</p>
              <p className="text-2xl font-bold text-gray-900">15m</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-success-500/10 p-4 rounded-xl text-success-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-xl text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </div>

        {/* Queue Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Queue</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {mockPatients.map((patient) => (
                  <li key={patient.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">Scheduled: {patient.time}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {patient.status === 'In Session' ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> In Session
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium flex items-center gap-2">
                          <Timer className="w-4 h-4" /> Waiting
                        </span>
                      )}
                      <button className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Manage
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <button className="w-full px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Call Next Patient
              </button>
              <button className="w-full px-4 py-3 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Take a Break
              </button>
              <button className="w-full px-4 py-3 border border-gray-200 text-sm font-medium rounded-xl text-red-600 bg-white hover:bg-red-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Emergency Hold
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
