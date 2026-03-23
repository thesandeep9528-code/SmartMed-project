import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Patient from './pages/Patient';
import Doctor from './pages/Doctor';
import Admin from './pages/Admin';
import Book from './pages/Book';
import Queue from './pages/Queue';
import { QueueProvider } from './context/QueueContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <Router>
          <div className="min-h-screen bg-background text-gray-900 font-sans">
            <Navbar />
            <main>
              <Routes>
                {/* All routes are accessible — Login enhances the experience but is not a blocker */}
                <Route path="/" element={<Home />} />
                <Route path="/book" element={<Book />} />
                <Route path="/patient" element={<Patient />} />
                <Route path="/doctor" element={<Doctor />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/queue" element={<Queue />} />
              </Routes>
            </main>
          </div>
        </Router>
      </QueueProvider>
    </AuthProvider>
  );
}

export default App;
