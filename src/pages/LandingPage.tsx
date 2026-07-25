import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, Users, Trophy, ChevronRight, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await signInWithGoogle();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans selection:bg-emerald-500/30">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf size={24} className="text-white" />
          </div>
          <span className="font-space font-bold text-xl tracking-tight">EcoImpact <span className="text-emerald-400">UoM</span></span>
        </div>
        <button 
          onClick={handleLogin}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm font-medium transition-all"
        >
          {user ? 'Go to Dashboard' : 'Student Login'}
          {!user && <LogIn size={16} />}
        </button>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            University of Moratuwa Climate Initiative
          </div>

          <h1 className="text-5xl md:text-7xl font-space font-bold leading-tight mb-6 tracking-tight">
            Be The Generation That <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Changed The World.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed">
            Join thousands of UoM students creating a greener future. Track habits, complete challenges, and reduce your carbon footprint.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:-translate-y-0.5"
            >
              Get Started
              <ChevronRight size={18} />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-full font-medium transition-all text-white">
              Watch Campaign
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-24 max-w-5xl mx-auto w-full"
        >
          {[
            { label: 'Trees Planted', value: '1,240', icon: Leaf },
            { label: 'Plastic Avoided', value: '850kg', icon: Globe },
            { label: 'Students Joined', value: '4,500+', icon: Users },
            { label: 'Challenges Met', value: '12K', icon: Trophy },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 border border-emerald-500/30">
                  <Icon size={24} />
                </div>
                <div className="text-3xl font-space font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>
      </main>
    </div>
  );
}
