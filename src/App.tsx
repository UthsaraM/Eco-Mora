/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Analytics } from '@vercel/analytics/react';

// Lazy loaded pages
import React, { Suspense, lazy } from 'react';
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EcoTracker = lazy(() => import('./pages/EcoTracker'));
const CarbonCalculator = lazy(() => import('./pages/CarbonCalculator'));
const Challenges = lazy(() => import('./pages/Challenges'));
const AiCoach = lazy(() => import('./pages/AiCoach'));
const Community = lazy(() => import('./pages/Community'));
const Campaigns = lazy(() => import('./pages/Campaigns'));

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#020617]"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617]"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tracker" element={<EcoTracker />} />
                <Route path="/calculator" element={<CarbonCalculator />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/coach" element={<AiCoach />} />
                <Route path="/community" element={<Community />} />
                <Route path="/videos" element={<Campaigns />} />
                {/* Fallbacks for unbuilt routes */}
                <Route path="*" element={<div className="p-8 text-center text-slate-500">Under Construction</div>} />
              </Route>
            </Routes>
          </Suspense>
          <Analytics />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
