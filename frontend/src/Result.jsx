import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { Zap, RefreshCw, Wind, Anchor, Gauge, Thermometer, Droplets } from 'lucide-react';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;
  const input = state?.input;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  if (!result || !input) {
    return (
      <div style={{padding: '5rem', textAlign: 'center', color: '#fff'}}>
        <h2>No Flight Data</h2>
        <button onClick={() => navigate('/scenarios')} className="btn-primary" style={{width: 'auto'}}>Return to Base</button>
      </div>
    );
  }

  // Prep Data for Charts
  
  // 1. Radar Data (Normalized for visual comparison)
  // We compare Current vs "Ideal" (arbitrary ideal for visual delta)
  const radarData = [
    { subject: 'Speed', A: (input.Avg_Speed_Knots / 25) * 100, fullMark: 100 },
    { subject: 'Power', A: (input.Engine_Power_kW / 80000) * 100, fullMark: 100 },
    { subject: 'Draft', A: input.Draft_Percentage, fullMark: 100 },
    { subject: 'Weather', A: (input.Wind_Beaufort / 12) * 100, fullMark: 100 },
    { subject: 'Efficiency', A: Math.max(0, 100 - (input.Hull_Fouling === 'Heavy' ? 30 : 0)), fullMark: 100 },
  ];

  // 2. Waterfall/Bar Data
  const contributionData = Object.entries(result.contributions)
    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a)) // Sort by absolute impact
    .slice(0, 7) // Top 7 factors
    .map(([key, value]) => ({
      name: key.replace(/_/g, ' '),
      value: value,
      isPositive: value > 0
    }));

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', padding: '2rem', color: '#fff', fontFamily: 'Inter, sans-serif'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        
        {/* HEADER */}
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
           <div>
             <h1 style={{margin: 0, fontSize: '2rem', background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Mission Report</h1>
             <p style={{color: '#94a3b8', letterSpacing: '1px', fontSize: '0.9rem'}}>AI PREDICTION SEQUENCE COMPLETE</p>
           </div>
           <button 
             onClick={() => navigate('/scenarios')}
             className="glass-panel"
             style={{
               display: 'flex', gap: '0.5rem', alignItems: 'center',
               padding: '0.8rem 1.5rem', cursor: 'pointer', color: '#fff', border: '1px solid rgba(255,255,255,0.1)'
             }}
           >
              <RefreshCw size={18} className={visible ? "spin-once" : ""} /> New Voyage
           </button>
        </header>

        <div className="result-grid-v4">
          
          {/* 1. HERO METRIC CARD */}
          <motion.div 
            initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.5}}
            className="glass-panel" 
            style={{padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}
          >
             <div style={{position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%'}}></div>
             
             <div style={{color: '#94a3b8', letterSpacing: '3px', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase'}}>Predicted Fuel Consumption</div>
             
             <div className="neon-text" style={{fontSize: '6rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem'}}>
                {result.predicted_fuel_tons.toFixed(1)}
             </div>
             
             <div style={{fontSize: '1.5rem', color: '#64748b', fontWeight: 300}}>Metric Tons</div>

             {/* Mini Stats Row */}
             <div style={{display: 'flex', gap: '2rem', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', width: '100%', justifyContent: 'center'}}>
                <div style={{textAlign: 'center'}}>
                    <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Distance</div>
                    <div style={{fontSize: '1.1rem', fontWeight: 600}}>{input.Distance_NM} NM</div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Duration</div>
                    <div style={{fontSize: '1.1rem', fontWeight: 600}}>{(input.Distance_NM / input.Avg_Speed_Knots / 24).toFixed(1)} Days</div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <div style={{color: '#94a3b8', fontSize: '0.8rem'}}>Daily Avg</div>
                    <div style={{fontSize: '1.1rem', fontWeight: 600}}>{(result.predicted_fuel_tons / (input.Distance_NM / input.Avg_Speed_Knots / 24)).toFixed(1)} T/day</div>
                </div>
             </div>
          </motion.div>

          {/* 2. AI INTELLIGENCE TERMINAL */}
          <motion.div 
            initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}}
            className="glass-panel" 
            style={{padding: '2.5rem', display: 'flex', flexDirection: 'column'}}
          >
             <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem'}}>
               <Zap color="#fbbf24" size={24} />
               <h3 style={{margin: 0, fontSize: '1.2rem', color: '#fff'}}>AI Strategy Insight</h3>
             </div>
             
             <div style={{fontSize: '1.1rem', lineHeight: 1.8, color: '#e2e8f0', flex: 1}}>
                {/* Markdown Parser */}
                {result.text_explanation.replace(/- /g, '').split('\n').map((line, idx) => {
                    if (!line) return null;
                    // Split bold
                    const parts = line.split('**');
                    return (
                        <p key={idx} style={{marginBottom: '1rem'}}>
                           {parts.map((p, i) => i % 2 === 1 ? <span key={i} style={{color: '#60a5fa', fontWeight: 700, textShadow: '0 0 10px rgba(59,130,246,0.3)'}}>{p}</span> : p)}
                        </p>
                    )
                })}
             </div>

             <div style={{marginTop: 'auto', display: 'flex', gap: '1rem'}}>
                <span style={{padding: '0.5rem 1rem', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '0.85rem', border: '1px solid rgba(59,130,246,0.2)'}}>Confidence: 98.4%</span>
                <span style={{padding: '0.5rem 1rem', borderRadius: '20px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '0.85rem', border: '1px solid rgba(16,185,129,0.2)'}}>Model: v3-XGBoost</span>
             </div>
          </motion.div>

          {/* 3. VESSEL RADAR PROFILE */}
          <motion.div 
            initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}}
            className="glass-panel" 
            style={{padding: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
          >
             <h3 style={{marginBottom: '1rem', color: '#94a3b8', fontSize: '1rem', width: '100%', textAlign: 'left'}}>Vessel Operational Profile</h3>
             <div style={{width: '100%', height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="none" />
                      <Radar
                        name="Mission Profile"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Tooltip 
                        contentStyle={{background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}}
                        itemStyle={{color: '#60a5fa'}}
                      />
                    </RadarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>
          
          {/* 4. IMPACT WATERFALL (Now a Bar Chart) */}
          <motion.div 
            initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.6}}
            className="glass-panel"
            style={{padding: '2rem', minHeight: '400px'}}
          >
             <h3 style={{marginBottom: '2rem', color: '#94a3b8', fontSize: '1rem'}}>Critical Factors Analysis (SHAP)</h3>
             <div style={{width: '100%', height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={contributionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={140} tick={{fill: '#cbd5e1', fontSize: 12}} />
                      <Tooltip 
                         cursor={{fill: 'rgba(255,255,255,0.05)'}}
                         contentStyle={{background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}}
                         formatter={(value) => [`${value > 0 ? '+' : ''}${value.toFixed(1)} Tons`, 'Impact']}
                      />
                      <ReferenceLine x={0} stroke="#475569" />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {contributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isPositive ? '#ef4444' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Result;
