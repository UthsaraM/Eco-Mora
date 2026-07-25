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
    import('firebase/auth').then(({ getRedirectResult }) => {
      getRedirectResult(auth).catch(console.error);
    });

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
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Popup failed, trying redirect", error);
      
      if (error.code === 'auth/unauthorized-domain') {
        alert("Action Required: Your Vercel domain is not authorized for Firebase Auth.\n\nPlease go to Firebase Console -> Authentication -> Settings -> Authorized domains and add your Vercel URL.");
        throw error;
      }

      if (error.code !== 'auth/popup-blocked' && error.code !== 'auth/popup-closed-by-user') {
        // Only alert on unexpected errors, don't alert on standard popup blocks before redirecting
        alert("Authentication error: " + error.message + ". Trying redirect fallback.");
      }

      // Fallback to redirect for any popup issues
      console.log("Falling back to redirect auth...", error);
      const { signInWithRedirect } = await import('firebase/auth');
      await signInWithRedirect(auth, provider);
      // Prevent further execution while page redirects
      await new Promise(() => {});
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
