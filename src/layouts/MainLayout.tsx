import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home, 
  Leaf, 
  Calculator, 
  MessageSquare, 
  Trophy, 
  Users, 
  BookOpen, 
  Video, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/tracker', label: 'Eco Tracker', icon: Leaf },
  { path: '/calculator', label: 'Carbon Calculator', icon: Calculator },
  { path: '/challenges', label: 'Challenges', icon: Trophy },
  { path: '/coach', label: 'AI Eco Coach', icon: MessageSquare },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/learning', label: 'Learning Centre', icon: BookOpen },
  { path: '/videos', label: 'Campaigns', icon: Video },
];

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans relative">
      {/* Background Atmospheric Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white/5 border-r border-white/10 backdrop-blur-md shadow-sm z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf size={24} className="text-white" />
          </div>
          <h1 className="font-space font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
            EcoImpact<br/><span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-semibold">UoM</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20" 
                    : "text-slate-400 hover:bg-white/10 hover:text-white font-medium"
                )}
              >
                <Icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive ? "text-slate-950" : "text-slate-500 group-hover:text-emerald-400")} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-xl mb-2">
            <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=eco'} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-800 border border-emerald-500/30 p-0.5" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.displayName || 'Student'}</p>
              <p className="text-[10px] text-emerald-400 font-mono truncate">ECO BEGINNER</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-md border-b border-white/10 z-30 flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <h1 className="font-space font-bold text-lg tracking-tight text-white">EcoImpact</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white bg-white/10 rounded-lg">
          {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-[#020617] shadow-xl z-20 border-b border-white/10 p-4 rounded-b-2xl"
        >
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    isActive 
                      ? "bg-emerald-500 text-slate-950 font-bold" 
                      : "text-slate-400 hover:bg-white/10 font-medium"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </motion.div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden pt-16 md:pt-0 z-10">
        <div className="relative h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
