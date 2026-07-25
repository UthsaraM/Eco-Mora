import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Droplets, Zap, Recycle, TreePine, Bus, Coffee, ShoppingBag, Wind } from 'lucide-react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const habits = [
  { id: 'h1', title: 'Reusable Water Bottle', pts: 10, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'h2', title: 'Walk or Cycle', pts: 20, icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 'h3', title: 'Recycled Waste', pts: 15, icon: Recycle, color: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 'h4', title: 'Plant a Tree/Seed', pts: 50, icon: TreePine, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'h5', title: 'Public Transport', pts: 25, icon: Bus, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { id: 'h6', title: 'Saved Electricity', pts: 15, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'h7', title: 'Reusable Coffee Cup', pts: 10, icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 'h8', title: 'Reusable Shopping Bag', pts: 10, icon: ShoppingBag, color: 'text-teal-500', bg: 'bg-teal-100' },
];

export default function EcoTracker() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // Load daily completed from local storage to simulate daily reset, but sync score to firebase
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`habits_${user.uid}_${today}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setCompleted(parsed.completed || []);
      setScore(parsed.score || 0);
    }
  }, [user]);

  const toggleHabit = async (id: string, pts: number, title: string) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];

    if (completed.includes(id)) {
      // Revert (simplified local revert, no revert from db recent activities)
      const newCompleted = completed.filter(h => h !== id);
      const newScore = score - pts;
      setCompleted(newCompleted);
      setScore(newScore);
      localStorage.setItem(`habits_${user.uid}_${today}`, JSON.stringify({ completed: newCompleted, score: newScore }));
      
      const userRef = doc(db, 'Users', user.uid);
      await updateDoc(userRef, {
        carbonScore: increment(-pts)
      });
    } else {
      const newCompleted = [...completed, id];
      const newScore = score + pts;
      setCompleted(newCompleted);
      setScore(newScore);
      localStorage.setItem(`habits_${user.uid}_${today}`, JSON.stringify({ completed: newCompleted, score: newScore }));
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#0ea5e9']
      });

      try {
        const userRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const currentActivities = userDoc.data().recentActivities || [];
          const newActivity = {
            action: `Completed: ${title}`,
            time: 'Just now',
            pts: `+${pts}`
          };
          
          await updateDoc(userRef, {
            carbonScore: increment(pts),
            recentActivities: [newActivity, ...currentActivities].slice(0, 5) // Keep last 5
          });
        }
      } catch (error) {
        console.error('Error syncing habit:', error);
      }
    }
  };

  const progress = Math.min((score / 150) * 100, 100);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto z-10 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-space font-bold text-white mb-2">Daily Eco Tracker</h1>
        <p className="text-slate-400">Track your daily sustainable habits to earn points and maintain your streak.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Score & Progress */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center relative overflow-hidden">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Daily Score</div>
            <div className="text-6xl font-space font-bold text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{score}</div>
            
            <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-xs font-bold text-slate-500 text-right">GOAL: 150 PTS</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-900/20 border border-emerald-500/20 rounded-3xl p-6 text-white backdrop-blur-md">
             <h3 className="font-bold text-emerald-300 mb-4">Why track habits?</h3>
             <p className="text-sm text-slate-300 leading-relaxed italic">
               Consistent small actions create massive global impact. By logging daily habits, you reinforce sustainable behavior and help UoM reach its carbon neutral goals.
             </p>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {habits.map((habit) => {
              const isCompleted = completed.includes(habit.id);
              const Icon = habit.icon;
              
              return (
                <motion.div
                  key={habit.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleHabit(habit.id, habit.pts, habit.title)}
                  className={clsx(
                    "relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group backdrop-blur-md",
                    isCompleted 
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "bg-white/5 border-white/10 hover:border-emerald-500/30 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    isCompleted ? "bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-slate-800 border border-white/5 text-slate-400 group-hover:text-emerald-400"
                  )}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={clsx(
                      "font-semibold transition-colors",
                      isCompleted ? "text-emerald-100" : "text-slate-200"
                    )}>{habit.title}</h4>
                    <span className={clsx(
                      "text-xs font-bold px-2 py-1 rounded-md mt-1 inline-block border",
                      isCompleted ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-slate-400 border-white/5"
                    )}>
                      +{habit.pts} pts
                    </span>
                  </div>

                  <div className={clsx(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-white/20 group-hover:border-emerald-500/50"
                  )}>
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
