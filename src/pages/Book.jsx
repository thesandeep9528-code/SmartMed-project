import { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Search, MapPin, AlertTriangle, Info, Clock, ExternalLink, ActivitySquare, CheckCircle2, Locate, Navigation, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Book() {
  const { doctors, hospitals, addPatient, getWaitPrediction, getSmartHospitalSuggestion, getRightTimeToVisit, matchDoctorBySymptom, generateMicroSlot } = useQueue();
  const navigate = useNavigate();
  
  const [symptoms, setSymptoms] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [calculatedWait, setCalculatedWait] = useState(0);
  const [smartSuggestion, setSmartSuggestion] = useState(null);
  const [timePrediction, setTimePrediction] = useState('');
  const [microSlot, setMicroSlot] = useState(null);

  // Nearest Hospital Finder state
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (symptoms.length > 5 && !selectedDoctor) {
      const bestDoc = matchDoctorBySymptom(symptoms);
      if (bestDoc) setSelectedDoctor(bestDoc.id);
    }
  }, [symptoms]);

  useEffect(() => {
    if (selectedDoctor) {
      const wait = getWaitPrediction(selectedDoctor, priority);
      setCalculatedWait(wait);
      setSmartSuggestion(getSmartHospitalSuggestion(selectedDoctor));
      setTimePrediction(getRightTimeToVisit(selectedDoctor));
      setMicroSlot(generateMicroSlot(wait));
    }
  }, [selectedDoctor, priority]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    addPatient({ doctorId: selectedDoctor, priority, exactSlotDisabled: false });
    navigate('/patient');
  };

  // Fetch real hospitals from OpenStreetMap Overpass API
  const fetchNearbyHospitals = async (lat, lon) => {
    setLocationLoading(true);
    setLocationError('');
    setNearbyHospitals([]);
    try {
      const query = `
        [out:json][timeout:20];
        (
          node["amenity"="hospital"](around:8000,${lat},${lon});
          way["amenity"="hospital"](around:8000,${lat},${lon});
        );
        out body center 10;
      `;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();

      const results = data.elements
        .filter(el => el.tags && el.tags.name)
        .map(el => {
          const elLat = el.lat ?? el.center?.lat;
          const elLon = el.lon ?? el.center?.lon;
          const dist = elLat && elLon ? getDistanceKm(lat, lon, elLat, elLon) : null;
          return {
            id: el.id,
            name: el.tags.name,
            phone: el.tags.phone || el.tags['contact:phone'] || null,
            emergency: el.tags.emergency === 'yes' || el.tags['emergency'] !== undefined,
            website: el.tags.website || el.tags['contact:website'] || null,
            lat: elLat,
            lon: elLon,
            dist: dist ? dist.toFixed(1) : null,
            mapsUrl: elLat && elLon ? `https://www.google.com/maps/search/?api=1&query=${elLat},${elLon}` : null,
          };
        })
        .filter(h => h.dist !== null)
        .sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist))
        .slice(0, 8);

      if (results.length === 0) {
        setLocationError('No hospitals found within 8 km. Try searching a city name.');
      }
      setNearbyHospitals(results);
    } catch (err) {
      setLocationError('Could not fetch hospital data. Please check your internet connection.');
    } finally {
      setLocationLoading(false);
    }
  };

  // Haversine formula for distance in km
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Use browser live location
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        fetchNearbyHospitals(latitude, longitude);
      },
      () => {
        setLocationLoading(false);
        setLocationError('Location access denied. Please search by city/area name instead.');
      }
    );
  };

  // Geocode a text query then fetch hospitals
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setLocationError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (!data.length) {
        setLocationError('Place not found. Try a more specific name like "Mumbai" or "Connaught Place, Delhi".');
        setSearchLoading(false);
        return;
      }
      const { lat, lon } = data[0];
      setUserCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
      setSearchLoading(false);
      fetchNearbyHospitals(parseFloat(lat), parseFloat(lon));
    } catch {
      setLocationError('Search failed. Please try again.');
      setSearchLoading(false);
    }
  };

  const handleHospitalClick = (hospital) => {
    const url = hospital.website || hospital.mapsUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* AI Booking Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-400 to-blue-600"></div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">AI Smart Booking & Triage</h2>
            <p className="mt-2 text-sm text-gray-500">Enter your symptoms to let our AI Load Balancer automatically route you to the fastest available specialist.</p>
          </div>

          <form className="space-y-6" onSubmit={handleBooking}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ActivitySquare className="w-4 h-4 text-primary-500" /> Patient Symptoms (AI Analyzed)
              </label>
              <textarea
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                placeholder="E.g., I have been experiencing severe chest pain and dizziness since morning..."
              />
              {symptoms.length > 5 && (
                <p className="text-xs text-success-600 mt-2 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> AI Engine successfully matched specialty.
                </p>
              )}
            </div>

            <div className="bg-surface-light p-4 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                Patient Condition <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-200">Mood-Based Priority</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Normal', 'Urgent', 'Critical'].map(level => (
                  <div
                    key={level}
                    onClick={() => setPriority(level)}
                    className={`cursor-pointer rounded-lg p-3 text-center transition-all ${
                      priority === level
                        ? level === 'Critical' ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-200 ring-offset-2'
                          : level === 'Urgent' ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-200 ring-offset-2'
                          : 'bg-primary-500 text-white shadow-lg ring-2 ring-primary-200 ring-offset-2'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm font-bold">{level}</span>
                  </div>
                ))}
              </div>
              {priority === 'Critical' && (
                <p className="mt-3 text-xs text-red-600 font-medium flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" /> Emergency priority network active. Queue bypassed.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Matched Doctor / Hospital</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  required
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white cursor-pointer"
                >
                  <option value="" disabled>Search specialists...</option>
                  {doctors.map(doc => {
                    const hosp = hospitals.find(h => h.id === doc.hospitalId);
                    return (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialty} | {hosp?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {selectedDoctor && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex bg-blue-50 border border-blue-200 rounded-xl p-4 gap-4 items-center">
                  <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-sm font-bold text-blue-900">AI Micro-Slot Assigned</p>
                    <div className="flex items-baseline justify-between mt-1">
                      <p className="text-3xl font-black text-blue-700 font-mono tracking-tight">{microSlot}</p>
                      <p className="text-sm font-medium text-blue-500 uppercase">{calculatedWait} mins wait</p>
                    </div>
                  </div>
                </div>

                <div className="bg-success-500/5 rounded-xl p-4 border border-success-500/20 text-success-700 flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-success-600" />
                  <p className="text-sm font-medium leading-relaxed">{timePrediction}</p>
                </div>

                {smartSuggestion && (
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start gap-3 text-orange-800">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">Smart AI Network Route Available</p>
                        <p className="text-sm mt-1 mb-3 bg-white/50 p-2 rounded-lg border border-orange-100">
                          <b>{smartSuggestion.hospital}</b> is only {smartSuggestion.distance} away and has a <b className="text-orange-600">{smartSuggestion.savedTime}m shorter wait</b> right now!
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedDoctor(smartSuggestion.doctorId)}
                          className="inline-flex items-center w-full justify-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                        >
                          Auto-Switch & Save {smartSuggestion.savedTime} mins <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/30 transition-all mt-8"
            >
              Confirm Priority AI Booking
            </button>
          </form>
        </div>

        {/* ── NEAREST EMERGENCY HOSPITAL FINDER ── */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-50 p-2.5 rounded-xl">
              <MapPin className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Nearest Emergency Hospitals</h3>
              <p className="text-xs text-gray-500 mt-0.5">Real-time data from OpenStreetMap · Click any hospital to open its page</p>
            </div>
          </div>

          {/* Location Controls */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleLiveLocation}
              disabled={locationLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-md shadow-red-500/20 disabled:opacity-60"
            >
              {locationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Locate className="w-5 h-5" />}
              {locationLoading ? 'Detecting Location...' : 'Use My Live Location'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or search a place</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                  placeholder="Search area, city (e.g. Delhi, Mumbai)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-primary-500 bg-gray-50"
                />
              </div>
              <button
                onClick={handleSearchLocation}
                disabled={searchLoading || !searchQuery.trim()}
                className="px-4 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                {searchLoading ? '...' : 'Find'}
              </button>
            </div>
          </div>

          {/* Error */}
          {locationError && (
            <div className="mb-4 bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              {locationError}
            </div>
          )}

          {/* Results */}
          {nearbyHospitals.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{nearbyHospitals.length} hospitals found nearby</p>
              {nearbyHospitals.map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => handleHospitalClick(h)}
                  className="w-full text-left bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl p-4 transition-all group flex items-center gap-4"
                >
                  <div className="bg-white border border-gray-200 group-hover:border-red-300 rounded-lg w-10 h-10 flex items-center justify-center shrink-0 font-black text-gray-400 text-sm shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-sm leading-tight truncate">{h.name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {h.dist && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {h.dist} km away
                        </span>
                      )}
                      {h.phone && (
                        <span className="text-xs text-gray-500">📞 {h.phone}</span>
                      )}
                      {h.emergency && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Emergency</span>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-red-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Placeholder state */}
          {!locationLoading && nearbyHospitals.length === 0 && !locationError && (
            <div className="text-center py-10 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Share your location or search an area<br />to see real nearby hospitals instantly.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
