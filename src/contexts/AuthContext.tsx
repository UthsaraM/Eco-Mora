import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Create user doc if not exists
        const userRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            ecoLevel: 'Eco Beginner',
            totalPoints: 0,
            carbonScore: 0,
            streakDays: 0,
            weeklyProgress: [
              { name: 'Mon', score: 0 },
              { name: 'Tue', score: 0 },
              { name: 'Wed', score: 0 },
              { name: 'Thu', score: 0 },
              { name: 'Fri', score: 0 },
              { name: 'Sat', score: 0 },
              { name: 'Sun', score: 0 },
            ],
            activeChallenges: [
              { title: 'Zero Plastic Week', progress: 0, daysLeft: 7, icon: 'Leaf' },
              { title: 'Walk to Campus', progress: 0, daysLeft: 5, icon: 'Trophy' }
            ],
            recentActivities: [],
            createdAt: new Date(),
          });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
