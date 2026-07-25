import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Leaf, Flame, Target, Trophy, ArrowRight, CloudRain, Sun, Wind } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', score: 40 },
  { name: 'Tue', score: 30 },
  { name: 'Wed', score: 60 },
  { name: 'Thu', score: 45 },
  { name: 'Fri', score: 80 },
  { name: 'Sat', score: 65 },
  { name: 'Sun', score: 90 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 z-10 relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-space font-bold text-white tracking-tight">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-slate-400 mt-1">"Small acts, when multiplied by millions of people, can transform the world."</p>
        </div>
        
        {/* Weather Widget */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-white/10">
          <div className="flex items-center gap-2 text-slate-300">
            <Sun size={20} className="text-amber-400" />
            <span className="font-medium">32°C</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2 text-slate-300">
            <Wind size={20} className="text-sky-400" />
            <span className="font-medium text-sm">AQI: Good</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Eco Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h2 className="text-lg font-semibold text-white">Weekly Progress</h2>
              <p className="text-sm text-slate-400">Your sustainable actions over time</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-semibold border border-emerald-500/30">
              <Leaf size={16} />
              Top 15%
            </div>
          </div>

          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                  cursor={{stroke: '#34d399', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="score" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Column */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-600/20 to-teal-900/20 border border-emerald-500/20 rounded-3xl p-6 text-white relative overflow-hidden backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 text-emerald-400">
              <Target size={100} />
            </div>
            <h3 className="text-slate-300 font-medium mb-1">Carbon Score</h3>
            <div className="text-5xl font-space font-bold mb-4 italic text-white">420<span className="text-2xl text-slate-400 not-italic ml-1">pt</span></div>
            <div className="flex items-center justify-between mt-8">
              <span className="text-sm text-slate-300">Level 4: Green Hero</span>
              <span className="text-sm font-medium">80%</span>
            </div>
            <div className="w-full bg-slate-950/50 h-2 rounded-full mt-2 overflow-hidden border border-white/5">
              <div className="bg-emerald-400 h-full rounded-full w-4/5 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center justify-between"
          >
            <div>
              <div className="text-slate-400 font-medium text-sm mb-1 uppercase tracking-wider">Current Streak</div>
              <div className="text-3xl font-space font-bold text-white flex items-center gap-2">
                12 Days <Flame size={28} className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Challenges & Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Active Challenges</h3>
            <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 underline underline-offset-4">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Zero Plastic Week', progress: 75, daysLeft: 2, icon: Leaf },
              { title: 'Walk to Campus', progress: 40, daysLeft: 5, icon: Trophy },
            ].map((challenge, i) => {
              const Icon = challenge.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 shadow-sm border border-white/5 group-hover:border-emerald-500/30">
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{challenge.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="w-full bg-slate-950/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${challenge.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-medium ml-3 whitespace-nowrap">{challenge.daysLeft} days left</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-6">
            {[
              { action: 'Completed Quiz: Ocean Life', time: '2 hours ago', pts: '+50' },
              { action: 'Logged: Used reusable bottle', time: '5 hours ago', pts: '+10' },
              { action: 'Reached Level 4!', time: 'Yesterday', pts: '+500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 2 && <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-white/10" />}
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 z-10 border border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="flex-1 pb-2">
                  <p className="font-medium text-slate-200">{activity.action}</p>
                  <p className="text-sm text-slate-400">{activity.time}</p>
                </div>
                <div className="font-bold text-emerald-400">{activity.pts}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
