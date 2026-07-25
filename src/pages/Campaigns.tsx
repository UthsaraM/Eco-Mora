import React from 'react';
import { Video, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Campaigns() {
  const campaigns = [
    {
      title: "EcoImpact Campaign 1",
      url: "https://vt.tiktok.com/ZSXTF74me/",
      description: "Watch our first campaign video and learn how small steps make a big difference."
    },
    {
      title: "EcoImpact Campaign 2",
      url: "https://vt.tiktok.com/ZSXTFVx7h/",
      description: "Join the movement. See what students are doing to protect our environment."
    },
    {
      title: "EcoImpact Campaign 3",
      url: "https://vt.tiktok.com/ZSXTFCQFM/",
      description: "Be the generation that changed the world. Watch our latest feature."
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 z-10 relative">
      <div>
        <h1 className="text-3xl font-space font-bold text-white mb-2">Campaign Videos</h1>
        <p className="text-slate-400">Watch our latest TikTok campaigns and share them with your friends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
            
            <div>
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
                <Video size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{campaign.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {campaign.description}
              </p>
            </div>

            <a 
              href={campaign.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <Play size={18} fill="currentColor" />
              Watch on TikTok
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
