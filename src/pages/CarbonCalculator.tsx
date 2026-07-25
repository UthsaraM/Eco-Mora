import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Zap, Coffee, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  {
    id: 'transport',
    title: 'Transportation',
    icon: Car,
    question: 'How do you usually commute to the university?',
    options: [
      { label: 'Walk / Cycle', value: 0 },
      { label: 'Public Transport', value: 2 },
      { label: 'Carpool', value: 4 },
      { label: 'Drive Alone', value: 8 },
    ]
  },
  {
    id: 'energy',
    title: 'Energy Usage',
    icon: Zap,
    question: 'How often do you leave devices plugged in when not in use?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 2 },
      { label: 'Sometimes', value: 4 },
      { label: 'Always', value: 6 },
    ]
  },
  {
    id: 'food',
    title: 'Diet & Food',
    icon: Coffee,
    question: 'What best describes your typical diet?',
    options: [
      { label: 'Vegan', value: 1 },
      { label: 'Vegetarian', value: 2 },
      { label: 'Mixed (Low Meat)', value: 4 },
      { label: 'High Meat', value: 7 },
    ]
  }
];

export default function CarbonCalculator() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (value: number) => {
    setAnswers(prev => ({ ...prev, [steps[currentStep].id]: value }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
      if (user) {
        try {
          const userRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const currentActivities = userDoc.data().recentActivities || [];
            const total = calculateTotal() * 120;
            const newActivity = {
              action: `Calculated Carbon Footprint (${total} kg/yr)`,
              time: 'Just now',
              pts: '+20'
            };
            
            await updateDoc(userRef, {
              carbonScore: increment(20),
              recentActivities: [newActivity, ...currentActivities].slice(0, 5)
            });
          }
        } catch (error) {
          console.error("Error saving calc result:", error);
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const calculateTotal = () => Object.values(answers).reduce((a, b) => a + b, 0);

  const getResultColor = (total: number) => {
    if (total <= 5) return 'text-emerald-400 from-emerald-400 to-emerald-600';
    if (total <= 12) return 'text-amber-400 from-amber-400 to-amber-600';
    return 'text-red-400 from-red-400 to-red-600';
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center z-10 relative">
      
      {!showResult ? (
        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-xl border border-white/10 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
            <motion.div 
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              {React.createElement(steps[currentStep].icon, { size: 24 })}
              <span className="font-semibold tracking-wide uppercase text-sm text-emerald-400">{steps[currentStep].title}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-space font-bold text-white">
              {steps[currentStep].question}
            </h2>
          </div>

          <div className="space-y-3 mb-10">
            {steps[currentStep].options.map((option, i) => {
              const isSelected = answers[steps[currentStep].id] === option.value;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option.value)}
                  className={clsx(
                    "w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group",
                    isSelected 
                      ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "border-white/10 bg-white/5 hover:border-emerald-500/30"
                  )}
                >
                  <span className={clsx("font-medium", isSelected ? "text-emerald-100" : "text-slate-300 group-hover:text-white")}>
                    {option.label}
                  </span>
                  <div className={clsx(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "border-white/20 group-hover:border-emerald-500/50"
                  )}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex justify-between items-center mt-auto">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-3 text-slate-400 hover:text-white disabled:opacity-0 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={answers[steps[currentStep].id] === undefined}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {currentStep === steps.length - 1 ? 'Calculate Result' : 'Next Step'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-xl border border-white/10 text-center relative overflow-hidden"
        >
           <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 bg-gradient-to-br ${getResultColor(calculateTotal()).split(' ')[1]}`} />
           
           <h2 className="text-xl font-medium text-slate-400 uppercase tracking-wide mb-4">Your Estimated Footprint</h2>
           <div className={`text-7xl font-space font-bold mb-2 ${getResultColor(calculateTotal()).split(' ')[0]}`}>
             {calculateTotal() * 120} <span className="text-3xl text-slate-500">kg/yr</span>
           </div>
           
           <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
             {calculateTotal() <= 5 
               ? "Excellent! Your carbon footprint is well below average. You are a true Earth Guardian." 
               : calculateTotal() <= 12 
               ? "Not bad! You're around the average student footprint. Small changes can bring this down further."
               : "Your footprint is higher than average. Let's work together with your AI Eco Coach to reduce it."}
           </p>

           <div className="flex gap-4 justify-center">
             <button 
                onClick={() => { setCurrentStep(0); setAnswers({}); setShowResult(false); }}
                className="px-6 py-3 rounded-full border border-white/20 text-slate-300 font-medium hover:bg-white/5 hover:text-white transition-colors"
              >
               Retake Quiz
             </button>
             <button className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               Get Recommendations
             </button>
           </div>
        </motion.div>
      )}
    </div>
  );
}
