import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AiCoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi ${user?.displayName?.split(' ')[0] || 'there'}! I'm your AI Eco Coach. How can I help you live a more sustainable lifestyle today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      } else {
        throw new Error('No response text');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I couldn't process that right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How can I reduce plastic?",
    "Tips for sustainable fashion?",
    "How to save energy in my dorm?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen p-4 md:p-6 max-w-4xl mx-auto z-10 relative">
      <div className="flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.4)]">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-xl font-space font-bold text-white">AI Eco Coach</h1>
          <p className="text-sm text-slate-400">Powered by Gemini</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-emerald-400 border border-white/10'
              }`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-emerald-500 text-slate-950 rounded-tr-none shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'bg-slate-900/50 text-slate-200 rounded-tl-none border border-white/10'
              }`}>
                <div className={`prose prose-sm max-w-none prose-p:leading-relaxed ${msg.role === 'user' ? 'prose-p:text-slate-900 prose-strong:text-slate-950' : 'prose-p:text-slate-300 prose-headings:text-white prose-strong:text-emerald-300 prose-a:text-emerald-400'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                <Bot size={16} />
              </div>
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-transparent border-t border-white/10 backdrop-blur-md">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for eco advice..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-full py-4 pl-6 pr-14 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-white placeholder-slate-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 w-10 h-10 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
