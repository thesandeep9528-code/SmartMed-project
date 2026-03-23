import { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Clock, Navigation2, RefreshCw, Trophy, Bell, AlertTriangle, CheckCircle, Smartphone, Zap, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Patient() {
  const { patientStatus, simulateTurnAlert } = useQueue();
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [swapRequested, setSwapRequested] = useState(false);
  const [liteMode, setLiteMode] = useState(false);

  // Real-time overrides for position + wait (swap interaction)
  const [livePosition, setLivePosition] = useState(null);
  const [liveWaitTime, setLiveWaitTime] = useState(null);
  const [swapPopup, setSwapPopup] = useState(false);
  const [noSwapPopup, setNoSwapPopup] = useState(false);
  const [swapDeniedPopup, setSwapDeniedPopup] = useState(false);
  // Simulates an emergency/critical patient being ahead in queue
  const [emergencyAhead, setEmergencyAhead] = useState(false);

  const healthTips = [
    "Drinking water before your checkup helps get accurate blood pressure readings.",
    "Breathe deeply. Your heart rate slows down, improving your vitals.",
    "Did you know? Laughing boosts your immune system!"
  ];
  const [currentTip] = useState(healthTips[Math.floor(Math.random() * healthTips.length)]);

  const handleVoiceCheck = () => {
    if (!('speechSynthesis' in window) || !patientStatus) return;
    setIsSpeaking(true);
    const pos = livePosition ?? patientStatus.position;
    const wait = liveWaitTime ?? patientStatus.estimatedWaitTime;
    const msg = new SpeechSynthesisUtterance(
      `Your digital token is ${patientStatus.tokenNumber}. You are number ${pos} in the queue for ${patientStatus.assignedDoctor}. Wait time is ${wait} minutes.`
    );
    msg.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  // REAL-TIME SWAP HANDLER
  const handleSwapRequest = () => {
    if (swapRequested) return;
    const currentPos = livePosition ?? patientStatus.position;
    const currentWait = liveWaitTime ?? patientStatus.estimatedWaitTime;

    // BLOCK: No one at front to swap with
    if (currentPos <= 1) {
      setNoSwapPopup(true);
      return;
    }

    // BLOCK: Emergency / Critical patient is ahead — swap denied
    if (emergencyAhead) {
      setSwapDeniedPopup(true);
      return;
    }

    const newPos = Math.max(1, currentPos - 1);
    const newWait = Math.max(0, currentWait - 10);
    setLivePosition(newPos);
    setLiveWaitTime(newWait);
    setSwapRequested(true);
    setSwapPopup(true);

    // Reset button after 4 seconds so it can be clicked again
    setTimeout(() => setSwapRequested(false), 4000);
  };

  if (!patientStatus) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 font-medium">Loading...</p></div>;
  }

  const displayPosition = livePosition ?? patientStatus.position;
  const displayWaitTime = liveWaitTime ?? patientStatus.estimatedWaitTime;
  const travelTime = 12; // fixed travel time in minutes
  const leaveInMins = Math.max(0, displayWaitTime - travelTime);

  if (!patientStatus.active) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">No Active Tokens</h2>
          <Link to="/book" className="px-6 py-3 mt-4 inline-block bg-primary-600 text-white rounded-xl font-bold">Book AI Slot</Link>
        </div>
      </div>
    );
  }

  if (liteMode) {
    return (
      <div className="min-h-screen bg-white p-4 font-mono text-gray-900">
        <button onClick={() => setLiteMode(false)} className="text-xs mb-8 border border-gray-900 px-3 py-1 bg-gray-100">{'< Back to Rich App'}</button>
        <h1 className="text-xl font-bold uppercase border-b-2 border-gray-900 pb-2">SmartMed SMS Alert</h1>
        <p className="mt-4">Token: {patientStatus.tokenNumber}</p>
        <p>Doc: {patientStatus.assignedDoctor}</p>
        <p>Queue Pos: #{displayPosition}</p>
        <p>Wait: {displayWaitTime}m</p>
        <p className="mt-8 text-xs border-t border-gray-400 pt-2">Powered by SmartMed Lite</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

      {/* SWAP ACCEPTED POPUP */}
      {swapPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center relative animate-fade-in">
            <button onClick={() => setSwapPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Swap Accepted! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Patient #{displayPosition + 1} agreed to swap. Your queue has been updated in real-time.</p>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6">
              <p className="text-xs text-purple-500 font-bold uppercase tracking-widest mb-1">Your New Queue Position</p>
              <p className="text-6xl font-black text-purple-700 font-mono">#{displayPosition}</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase">New Wait Time</p>
                <p className="text-xl font-black text-gray-900 mt-1">{displayWaitTime} mins</p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 border border-green-100">
                <p className="text-xs text-green-500 font-bold uppercase">Time Saved</p>
                <p className="text-xl font-black text-green-700 mt-1">10 mins</p>
              </div>
            </div>

            <button onClick={() => setSwapPopup(false)} className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* SWAP DENIED — EMERGENCY PATIENT POPUP */}
      {swapDeniedPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center relative animate-fade-in">
            <button onClick={() => setSwapDeniedPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
            <span className="bg-red-100 text-red-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Emergency Override Active</span>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Swap Request Denied</h2>
            <p className="text-gray-500 text-sm mb-6">
              A <b className="text-red-600">Critical Priority</b> patient is ahead of you in the queue. The AI Emergency Protocol has blocked this swap to ensure immediate care for the critical patient.
            </p>
            <button onClick={() => setSwapDeniedPopup(false)} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
              Understood
            </button>
          </div>
        </div>
      )}

      {/* NO SWAP AVAILABLE POPUP */}
      {noSwapPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center relative animate-fade-in">
            <button onClick={() => setNoSwapPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Swap Not Accepted</h2>
            <p className="text-gray-500 text-sm mb-6">
              No patients are currently available to swap with you. Please try again after some time or wait for your turn.
            </p>
            <button onClick={() => setNoSwapPopup(false)} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all">
              OK, I'll Wait
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl space-y-8">

        {/* Header & Dev controls */}
        <div className="flex justify-between items-end pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Patient Hub <span className="text-primary-500 font-black">•</span></h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">Next-generation live tracking.</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <button onClick={() => setLiteMode(true)} className="text-xs bg-gray-800 text-white font-bold px-3 py-1.5 rounded-lg">Toggle SMS/Lite Mode</button>
            <button onClick={simulateTurnAlert} className="text-xs bg-gray-200 text-gray-700 font-bold px-3 py-1 rounded-md">Dev: Alert Trigger</button>
            <button
              onClick={() => setEmergencyAhead(prev => !prev)}
              className={`text-xs font-bold px-3 py-1 rounded-md transition-all ${
                emergencyAhead ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-700'
              }`}
            >
              {emergencyAhead ? '🚨 Emergency Ahead: ON' : 'Demo: Toggle Emergency'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-1 space-y-6">
            {/* DIGITAL TOKEN */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6 w-full text-left">Digital Token</p>
              <div className="bg-white p-4 rounded-2xl w-full mb-6 relative z-10 shadow-inner">
                <p className="text-5xl font-black text-gray-900 font-mono tracking-tighter">
                  {patientStatus.tokenNumber?.split('-')[1]}
                </p>
              </div>
              <div className="w-full relative z-10 mb-6 flex justify-between items-end border-t border-gray-700 pt-4">
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase font-bold">Priority Status</p>
                  <p className={`text-xl font-bold mt-1 ${
                    patientStatus.priority === 'Critical' ? 'text-red-400 animate-pulse' :
                    patientStatus.priority === 'Urgent' ? 'text-orange-400' : 'text-success-400'
                  }`}>
                    {patientStatus.priority}
                  </p>
                </div>
                <Smartphone className="text-gray-600 w-8 h-8" />
              </div>

              <div className="w-full relative z-10 mb-6 bg-gray-800 rounded-lg p-3 text-left">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">AI Behavior Learning Profile</p>
                <p className="text-sm font-medium text-gray-200 mt-1">{patientStatus.behaviorStat}</p>
              </div>

              {/* Voice Button */}
              <button onClick={handleVoiceCheck} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg">
                <Zap className="w-5 h-5" /> <span>Voice Tracker</span>
              </button>
            </div>

            {/* Time Saved Meter */}
            <div className="bg-white rounded-2xl p-5 border border-primary-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500/10 rounded-full -mr-8 -mt-8"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Impact Metric</p>
              <h3 className="text-lg font-black text-gray-900 mt-2 leading-tight">By using SmartMed, you saved:</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-xl">{patientStatus.savedTimeReal}</span>
                <span className="text-gray-500 font-bold">minutes today! 🎉</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                <div className="bg-gradient-to-r from-success-400 to-primary-500 h-1.5 rounded-full w-[85%]"></div>
              </div>
            </div>

            {/* Gamified Waiting */}
            <div className="bg-[#FFF8E7] rounded-2xl p-5 border border-[#FDE6A4]">
              <div className="flex gap-3 items-center mb-3">
                <Trophy className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-gray-900 uppercase">Wait & Win (+50 XP)</h3>
              </div>
              <p className="text-sm text-gray-700 font-medium italic">"{currentTip}"</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">

            {/* Live System Grid — REAL-TIME updates */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`bg-white rounded-2xl p-6 border shadow-sm transition-all ${swapRequested ? 'border-purple-300 bg-purple-50' : 'border-gray-100'}`}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Queue Position</p>
                <p className={`text-6xl font-black transition-all ${swapRequested ? 'text-purple-600' : 'text-gray-900'}`}>
                  #{displayPosition}
                  {swapRequested && <span className="text-sm font-bold text-purple-500 ml-2 animate-pulse">Updated!</span>}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm bg-primary-50/20">
                <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Live AI Wait Time</p>
                <p className="text-6xl font-black text-primary-600">{displayWaitTime}<span className="text-2xl ml-1 text-primary-400">m</span></p>
              </div>
            </div>

            {/* Smart Sync Navigator — REAL-TIME DYNAMIC */}
            {displayWaitTime > 5 && (
              <div className={`text-white rounded-2xl p-6 border flex flex-col md:flex-row gap-6 items-center transition-all ${
                leaveInMins <= 0
                  ? 'bg-red-900 border-red-700'
                  : leaveInMins <= 5
                  ? 'bg-orange-900 border-orange-700'
                  : 'bg-gray-900 border-gray-800'
              }`}>
                <div className={`p-4 rounded-xl shrink-0 ${leaveInMins <= 0 ? 'bg-red-800' : leaveInMins <= 5 ? 'bg-orange-800' : 'bg-gray-800'}`}>
                  <Navigation2 className={`w-8 h-8 ${leaveInMins <= 0 ? 'text-red-400 animate-pulse' : leaveInMins <= 5 ? 'text-orange-400' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${leaveInMins <= 0 ? 'text-red-400' : leaveInMins <= 5 ? 'text-orange-400' : 'text-blue-400'}`}>
                    Smart Sync Navigator
                  </h3>
                  {leaveInMins <= 0 ? (
                    <p className="text-lg font-bold leading-tight text-red-200 animate-pulse">
                      🚨 Leave <b>RIGHT NOW!</b> Your slot is in {displayWaitTime} mins and hospital is 12 mins away!
                    </p>
                  ) : leaveInMins <= 5 ? (
                    <p className="text-lg font-medium leading-tight">
                      ⚡ Leave home in <b className="text-orange-300 text-2xl">{leaveInMins} min{leaveInMins !== 1 ? 's' : ''}</b> — your appointment is very soon!
                    </p>
                  ) : (
                    <p className="text-lg font-medium leading-tight">
                      Your hospital is 12 mins away. <b className="text-white">Leave home in {leaveInMins} mins</b> for perfect timing and zero waiting room time.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Queue Swapping UI — always visible */}
            <div className={`bg-white rounded-2xl p-5 border transition-all ${swapRequested ? 'border-purple-300' : 'border-dashed border-gray-300'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 text-purple-500 transition-all`} /> Dynamic Queue Swap
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {swapRequested
                      ? `✅ Swap confirmed! You moved to position #${displayPosition}.`
                      : displayPosition <= 1
                      ? 'You are already at the front of the queue!'
                      : `Patient #${displayPosition - 1} is willing to swap slots.`}
                  </p>
                </div>
                <button
                  disabled={swapRequested}
                  onClick={handleSwapRequest}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    swapRequested
                      ? 'bg-green-100 text-green-600 cursor-default'
                      : displayPosition <= 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95'
                  }`}
                >
                  {swapRequested ? 'Swap Done ✓' : 'Request Swap'}
                </button>
              </div>
            </div>

            {/* SMART ALERTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Live Hub Notifications</h3>
              <div className="space-y-3">
                {patientStatus.notifications.map((note) => (
                  <div key={note.id} className={`p-4 rounded-xl flex gap-4 ${
                    note.type === 'error' ? 'bg-red-50 text-red-800' :
                    note.type === 'warning' ? 'bg-orange-50 text-orange-800' :
                    'bg-success-50 text-success-800'
                  }`}>
                    <div className="mt-0.5">
                      {note.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                       note.type === 'warning' ? <Bell className="w-5 h-5 text-orange-500" /> :
                       <CheckCircle className="w-5 h-5 text-success-500" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-wide">{note.message}</p>
                      <p className="text-xs opacity-70 mt-1 font-medium">{note.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
