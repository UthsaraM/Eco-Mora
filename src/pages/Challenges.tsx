import React, { useEffect, useState } from 'react';
import { Trophy, Leaf, Target, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export default function Challenges() {
  const { user } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'Users', user.uid), (doc) => {
      if (doc.exists()) {
        const active = doc.data().activeChallenges || [];
        setActiveChallenges(active.map((c: any) => c.title));
      }
    });
    return () => unsub();
  }, [user]);

  const handleAccept = async (challenge: any) => {
    if (!user) return;
    if (activeChallenges.includes(challenge.title)) return;
    
    setLoading(challenge.title);
    try {
      const userRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentActive = userDoc.data().activeChallenges || [];
        const currentActivities = userDoc.data().recentActivities || [];

        const newChallenge = {
          title: challenge.title,
          progress: 0,
          daysLeft: challenge.type === 'Daily Challenge' ? 1 : 7,
          icon: challenge.iconName
        };

        const newActivity = {
          action: `Started: ${challenge.title}`,
          time: 'Just now',
          pts: `+0`
        };

        await updateDoc(userRef, {
          activeChallenges: [...currentActive, newChallenge],
          recentActivities: [newActivity, ...currentActivities].slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error accepting challenge:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 z-10 relative">
      <div>
        <h1 className="text-3xl font-space font-bold text-white mb-2">Green Challenges</h1>
        <p className="text-slate-400">Complete challenges to earn XP, unlock badges, and level up.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Plant a Tree", xp: 500, type: "Monthly Mission", icon: Leaf, iconName: 'Leaf', bg: "bg-emerald-500" },
          { title: "Zero Plastic Day", xp: 100, type: "Daily Challenge", icon: Target, iconName: 'Target', bg: "bg-blue-500" },
          { title: "Clean a Beach", xp: 1000, type: "Community Event", icon: Trophy, iconName: 'Trophy', bg: "bg-amber-500" }
        ].map((c, i) => {
          const isAccepted = activeChallenges.includes(c.title);
          const isLoading = loading === c.title;
          
          return (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] ${c.bg}`}>
                    <c.icon size={24} />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/5">
                    {c.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{c.title}</h3>
                <p className="text-sm font-bold text-emerald-400">+{c.xp} XP</p>
              </div>
              
              <button 
                onClick={() => handleAccept(c)}
                disabled={isAccepted || isLoading}
                className={`w-full mt-6 py-3 rounded-xl font-medium transition-colors border ${
                  isAccepted 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 flex items-center justify-center gap-2 cursor-default'
                    : 'bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border-white/10 hover:border-emerald-500/30'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : isAccepted ? (
                  <>
                    <Check size={18} /> Accepted
                  </>
                ) : (
                  'Accept Challenge'
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
