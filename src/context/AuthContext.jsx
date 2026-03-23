import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(!isSupabaseConfigured);

  useEffect(() => {
    // Hackathon Mock Fallback Initialization
    if (isMockMode) {
      const mockUser = localStorage.getItem('smartmed_mock_user');
      if (mockUser) {
        setUser(JSON.parse(mockUser));
      }
      setLoading(false);
      return;
    }

    // Real Supabase Auth Initialization
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, [isMockMode]);

  const signIn = async (email, password) => {
    if (isMockMode) {
      // Mock Login
      const mockUser = { id: 'mock-123', email, role: 'patient', created_at: new Date().toISOString() };
      localStorage.setItem('smartmed_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
    } else {
      // Real Supabase Login
      return await supabase.auth.signInWithPassword({ email, password });
    }
  };

  const signUp = async (email, password) => {
    if (isMockMode) {
      // Mock Sign Up
      const mockUser = { id: 'mock-123', email, role: 'patient', created_at: new Date().toISOString() };
      localStorage.setItem('smartmed_mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { data: { user: mockUser }, error: null };
    } else {
      // Real Supabase Sign Up
      return await supabase.auth.signUp({ email, password });
    }
  };

  const signOut = async () => {
    if (isMockMode) {
      // Mock Sign Out
      localStorage.removeItem('smartmed_mock_user');
      setUser(null);
      return { error: null };
    } else {
      // Real Supabase Sign Out
      return await supabase.auth.signOut();
    }
  };

  const loginAsGuest = () => {
    // Quick one-click entry for judges
    const guestUser = { id: 'guest-999', email: 'judge@hackathon.ai', role: 'guest', created_at: new Date().toISOString() };
    localStorage.setItem('smartmed_mock_user', JSON.stringify(guestUser));
    setIsMockMode(true);
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, loginAsGuest, isMockMode }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
