import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Community() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Users'));
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        // Sort by carbonScore
        usersList.sort((a, b) => (b.carbonScore || 0) - (a.carbonScore || 0));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 z-10 relative">
      <div>
        <h1 className="text-3xl font-space font-bold text-white mb-2">Community Leaderboard</h1>
        <p className="text-slate-400">See how you rank against other EcoImpact students.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center font-bold text-lg text-slate-300">
                  #{index + 1}
                </div>
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full border border-emerald-500/30 p-0.5 bg-slate-800"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {user.name} 
                    {index === 0 && <Award size={16} className="text-amber-400" />}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium tracking-wide uppercase">
                    Level {Math.floor((user.carbonScore || 0) / 100) + 1}: {user.ecoLevel || 'Eco Beginner'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-space font-bold text-white">
                    {user.carbonScore || 0}
                    <span className="text-sm text-slate-400 ml-1">pt</span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {users.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                No users found. Be the first to join!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
