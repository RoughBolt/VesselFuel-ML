import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Edit3, Wind, Anchor, Gauge } from 'lucide-react';

const Review = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  // V2 Data Model Defaults
  const defaults = {
    Ship_Type: 'Container', DWT: 80000, GT: 64000, LOA: 300.0, Beam: 42.0, 
    Design_Speed: 24.0, Draft_Percentage: 90, Hull_Fouling: 'Clean',
    Main_Engine_Type: '2-Stroke', Engine_Power_kW: 45000, SFOC_g_kWh: 165.0, 
    Propeller_Type: 'Fixed Pitch',
    Distance_NM: 3000, Avg_Speed_Knots: 18.0, Speed_Profile: 'Constant',
    Season: 'Inter-Monsoon', Wind_Beaufort: 2, Wind_Direction: 'Head', 
    Wave_Height_m: 0.5, Current_Speed_Knots: 0.2, Current_Direction: 'Head',
    Fuel_Type: 'HFO', Weather_Routing_Efficiency: 0.0
  };

  // Merge to ensure safety against partial old state
  const formData = { ...defaults, ...(state?.formData || {}) };

  const handleCalculate = () => {
    navigate('/calculating', { state: { formData } });
  };

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <motion.div 
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        style={{maxWidth: '800px', width: '100%'}}
      >
         <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Mission Briefing</h1>
         <p style={{color: '#94a3b8', marginBottom: '2rem'}}>Confirm voyage parameters before initializing AI prediction.</p>

         <div style={{
             background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', 
             padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem'
         }}>
             {/* VESSEL */}
             <div>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'#3b82f6', marginBottom:'1rem'}}>
                    <Anchor size={20} />
                    <h3 style={{margin:0, fontSize:'1rem'}}>VESSEL</h3>
                </div>
                <div style={{fontSize:'2rem', fontWeight:600}}>{formData.Ship_Type}</div>
                <div style={{color:'#94a3b8'}}>Draft: {formData.Draft_Percentage}%</div>
             </div>

             {/* VOYAGE */}
             <div>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'#3b82f6', marginBottom:'1rem'}}>
                    <Gauge size={20} />
                    <h3 style={{margin:0, fontSize:'1rem'}}>VOYAGE</h3>
                </div>
                <div style={{fontSize:'2rem', fontWeight:600}}>{formData.Avg_Speed_Knots} <span style={{fontSize:'1rem'}}>kts</span></div>
                <div style={{color:'#94a3b8'}}>{formData.Distance_NM} NM</div>
             </div>

             {/* ENV */}
             <div>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'#3b82f6', marginBottom:'1rem'}}>
                    <Wind size={20} />
                    <h3 style={{margin:0, fontSize:'1rem'}}>CONDITIONS</h3>
                </div>
                <div style={{fontSize:'1.2rem', fontWeight:600, marginBottom:'0.2rem'}}>{formData.Season}</div>
                <div style={{color:'#94a3b8'}}>Bft {formData.Wind_Beaufort} / Waves {formData.Wave_Height_m}m</div>
                <div style={{color:'#94a3b8', fontSize:'0.8rem', marginTop:'0.5rem'}}>Fuel: {formData.Fuel_Type}</div>
             </div>
         </div>

         <div style={{marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
             <button 
                onClick={() => navigate('/mission-control', { state: { formData } })}
                style={{
                    padding: '1rem 2rem', background: 'transparent', color: '#94a3b8', 
                    border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
             >
                <Edit3 size={18} /> Modify
             </button>
             
             <button 
                onClick={handleCalculate}
                style={{
                    padding: '1rem 3rem', background: '#3b82f6', color: '#fff', 
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1.1rem',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                }}
             >
                Initialize Calculation <ArrowRight size={20} />
             </button>
         </div>
      </motion.div>
    </div>
  );
};

export default Review;
