import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  Target, 
  Cpu, 
  Globe, 
  Fingerprint,
  ArrowUpRight
} from 'lucide-react';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-[#fbfbf9] selection:bg-stone-900 selection:text-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="px-4 md:px-10 pt-20 pb-16 max-w-[1800px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em] mb-4 italic">
            Organization Identity / Index 0.1
          </p>
          <h1 className="text-6xl md:text-[8rem] font-black italic tracking-tighter uppercase text-stone-900 leading-[0.8]">
            Beyond the <br /> 
            <span className="text-stone-200">Reference.</span>
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-stone-900/5 rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700" />
            <img 
              className="relative w-full aspect-[4/5] object-cover rounded-[3rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000" 
              src={assets.about_img} 
              alt="About Nexus" 
            />
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl hidden md:block border border-stone-100">
               <Fingerprint size={32} className="text-stone-900 mb-2" />
               <p className="text-[10px] font-black uppercase tracking-widest">Verified Identity</p>
            </div>
          </motion.div>

          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div {...fadeIn} className="space-y-6">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-stone-900">
                The Nexus Philosophy
              </h3>
              <p className="text-stone-500 leading-relaxed text-lg">
                Born at the intersection of high-utility design and minimalist aesthetics, 
                Nexus was conceived as a "Vault" for those who refuse to settle for the mundane. 
                We don't just curate products; we index objects of significance.
              </p>
              <p className="text-stone-500 leading-relaxed">
                Our journey started with a simple realization: the modern world is cluttered with 
                fleeting trends. Nexus exists to provide a stable node of quality, where every 
                item is vetted for its architectural integrity and functional performance.
              </p>
            </motion.div>

            <motion.div 
              {...fadeIn}
              className="p-10 bg-stone-900 rounded-[3rem] text-white relative overflow-hidden group"
            >
              <div className="relative z-10">
                <Target className="text-stone-400 mb-4 group-hover:rotate-12 transition-transform" />
                <h4 className="text-xl font-black italic uppercase tracking-widest mb-2">Our Mission</h4>
                <p className="text-stone-400 text-sm leading-relaxed">
                  To establish the global standard for curated commerce, bridging the gap 
                  between luxury craftsmanship and technical innovation.
                </p>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS BAR --- */}
      <section className="bg-stone-50 border-y border-stone-100 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatNode label="Synced Objects" value="12,400+" />
          <StatNode label="Active Nodes" value="54" />
          <StatNode label="Integrity Rate" value="99.9%" />
          <StatNode label="Global Latency" value="24ms" />
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="px-4 md:px-10 py-24 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-2">Capabilities</p>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-stone-900">
              Why <span className="text-stone-300">Choose Nexus.</span>
            </h2>
          </div>
          <div className="h-[1px] flex-1 bg-stone-100 mx-10 hidden lg:block" />
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">
            Protocol Efficiency / User Experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Cpu size={24} />}
            title="Quality Assurance"
            desc="Every object undergoes a multi-layer verification process to ensure material excellence and durability."
          />
          <FeatureCard 
            icon={<Zap size={24} />}
            title="Rapid Synchronicity"
            desc="Our logistics engine ensures that your acquired objects are delivered with maximum efficiency across 120 countries."
          />
          <FeatureCard 
            icon={<Users size={24} />}
            title="Elite Concierge"
            desc="24/7 technical support and dedicated membership assistants ready to refine your vault experience."
          />
        </div>
      </section>

      {/* --- TEAM/IDENTITY CALLOUT --- */}
      <motion.section 
        {...fadeIn}
        className="mx-4 md:mx-10 mb-20 bg-emerald-50 rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <div className="max-w-xl">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter text-emerald-950 mb-6 leading-none">
            Join the <br/> Executive Inner Circle.
          </h3>
          <p className="text-emerald-900/70 mb-8 font-medium italic">
            "We aren't just building a store. We are indexing a new lifestyle standard." 
            <br/> — Founder, Nexus Ecosystem
          </p>
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] bg-emerald-950 text-white px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-900/20">
            Learn More <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" alt="Team" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-2xl mt-12">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" alt="Team" className="w-full h-full object-cover grayscale" />
          </div>
        </div>
      </motion.section>

      <div className="pb-20">
        <NewsLetterBox />
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatNode = ({ label, value }) => (
  <div className="flex flex-col items-center md:items-start">
    <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-stone-900">
      {value}
    </span>
    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1">
      {label}
    </span>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white border border-stone-100 p-12 rounded-[3rem] flex flex-col gap-6 hover:shadow-3xl transition-all duration-500 group"
  >
    <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
      {icon}
    </div>
    <div className="space-y-4">
      <b className="text-lg font-black italic uppercase tracking-widest text-stone-900">
        {title}
      </b>
      <p className="text-stone-500 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  </motion.div>
);

export default About;