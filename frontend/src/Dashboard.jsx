import React, { useState } from 'react';
import axios from 'axios';
import { 
  Calculator, Activity, Wind, Anchor, ChevronDown, ChevronUp, 
  Droplet, Gauge, Zap, AlertTriangle, CheckCircle 
} from 'lucide-react';

// Preset Scenarios
const SCENARIOS = {
  calm: {
    Wind_Beaufort: 2, Wave_Height_m: 0.5, Season: 'Inter-Monsoon', Current_Speed_Knots: 0.2
  },
  monsoon: {
    Wind_Beaufort: 8, Wave_Height_m: 5.5, Season: 'Southwest Monsoon', Current_Speed_Knots: 1.5
  },
  slow_steam: {
    Avg_Speed_Knots: 12.0, Design_Speed: 24.0
  },
  full_speed: {
    Avg_Speed_Knots: 22.0
  }
};

const Dashboard = () => {
  const [formData, setFormData] = useState({
    Ship_Type: 'Container',
    DWT: 80000,
    Engine_Power_kW: 45000,
    Design_Speed: 24.0,
    Avg_Speed_Knots: 18.0,
    Distance_NM: 3000,
    Draft_Percentage: 90,
    Wind_Beaufort: 4,
    Wave_Height_m: 1.5,
    Current_Speed_Knots: 0.5,
    Current_Direction: 'Head',
    Season: 'Inter-Monsoon'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Accordion State
  const [openSection, setOpenSection] = useState('voyage'); // 'vessel', 'voyage', 'env'

  const toggleSection = (sec) => setOpenSection(openSection === sec ? null : sec);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['Ship_Type', 'Current_Direction', 'Season'].includes(name) 
        ? value 
        : parseFloat(value) || value
    }));
  };

  const applyScenario = (type) => {
    setFormData(prev => ({ ...prev, ...SCENARIOS[type] }));
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setResult(response.data);
    } catch (err) {
      alert("Prediction Error. Ensure Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for Input Cards
  const InputSection = ({ id, title, icon: Icon, children }) => (
    <div className={`input-section ${openSection === id ? 'open' : ''}`} style={{
        background: 'var(--col-secondary)', borderRadius: '12px', marginBottom: '1rem',
        border: openSection === id ? '1px solid var(--col-accent)' : '1px solid var(--col-border)',
        overflow: 'hidden', transition: 'all 0.3s ease'
    }}>
      <div onClick={() => toggleSection(id)} style={{
          padding: '1.2rem', display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', cursor: 'pointer', background: openSection === id ? 'rgba(59,130,246,0.1)' : 'transparent'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:'0.8rem'}}>
           <div style={{
               background: openSection === id ? 'var(--col-accent)' : 'var(--col-primary)', 
               padding: '8px', borderRadius: '8px', color: openSection === id ? 'white' : 'var(--col-text-muted)'
           }}>
             <Icon size={20} />
           </div>
           <h3 style={{margin:0, fontSize:'1rem', fontWeight:600}}>{title}</h3>
        </div>
        {openSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {openSection === id && (
        <div style={{padding: '1.5rem', borderTop: '1px solid var(--col-border)', background: 'rgba(0,0,0,0.1)'}}>
          <div className="form-grid">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto'}}>
      
      {/* HEADER WITH SCENARIO TOGGLES */}
      <div style={{marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
         <div>
            <h1>Mission Control</h1>
            <p className="subtitle">Interactive fuel consumption simulation.</p>
         </div>
         <div style={{display:'flex', gap:'0.5rem'}}>
            <span style={{fontSize:'0.8rem', alignSelf:'center', color:'var(--col-text-muted)', marginRight:'0.5rem'}}>QUICK SCENARIOS:</span>
            <button onClick={() => applyScenario('calm')} className="scenario-btn calm">☀️ Calm</button>
            <button onClick={() => applyScenario('monsoon')} className="scenario-btn storm">⛈️ Storm</button>
            <button onClick={() => applyScenario('slow_steam')} className="scenario-btn eco">🐢 Eco</button>
         </div>
      </div>

      <div className="dashboard-grid-v2">
        
        {/* LEFT COLUMN: CONFIGURATION */}
        <div className="config-column">
          
          {/* 1. VESSEL SPECS */}
          <InputSection id="vessel" title="Vessel Configuration" icon={Anchor}>
             <div style={{gridColumn:'1/-1'}}>
               <label>Vessel Class</label>
               <div style={{display:'flex', gap:'1rem'}}>
                  {['Container', 'Bulker', 'Tanker'].map(type => (
                    <div key={type} 
                         onClick={() => setFormData({...formData, Ship_Type: type})}
                         className={`type-card ${formData.Ship_Type === type ? 'active' : ''}`}>
                       {type === 'Container' ? '📦' : type === 'Bulker' ? '🪨' : '⛽'}
                       <span>{type}</span>
                    </div>
                  ))}
               </div>
             </div>
             <div>
                <label>Deadweight (DWT)</label>
                <input type="number" name="DWT" value={formData.DWT} onChange={handleChange} />
             </div>
             <div>
                <label>Engine Power (kW)</label>
                <input type="number" name="Engine_Power_kW" value={formData.Engine_Power_kW} onChange={handleChange} />
             </div>
          </InputSection>

          {/* 2. VOYAGE PARAMETERS */}
          <InputSection id="voyage" title="Voyage Profile" icon={Gauge}>
             <div style={{gridColumn:'1/-1'}}>
                <label style={{display:'flex', justifyContent:'space-between'}}>
                   Average Speed <span>{formData.Avg_Speed_Knots} kts</span>
                </label>
                <input type="number" name="Avg_Speed_Knots" min="0" max="40" step="0.1" 
                       value={formData.Avg_Speed_Knots} onChange={handleChange} style={{margin:'1rem 0'}} />
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--col-text-muted)'}}>
                   <span>Knots</span>
                </div>
             </div>
             
             <div>
                <label>Distance (NM)</label>
                <input type="number" name="Distance_NM" value={formData.Distance_NM} onChange={handleChange} />
             </div>
             
             <div>
                <label>Draft Check ({formData.Draft_Percentage}%)</label>
                <div className="draft-visual">
                   <div className="draft-fill" style={{width: `${formData.Draft_Percentage}%`}}></div>
                </div>
                <input type="number" name="Draft_Percentage" min="0" max="100" 
                       value={formData.Draft_Percentage} onChange={handleChange} style={{marginTop:'0.5rem'}} />
             </div>
          </InputSection>

          {/* 3. ENVIRONMENT */}
          <InputSection id="env" title="Sea State & Weather" icon={Wind}>
             <div style={{gridColumn:'1/-1'}}>
               <label>Monsoon Season</label>
               <select name="Season" value={formData.Season} onChange={handleChange} style={{padding:'1rem'}}>
                 <option value="Inter-Monsoon">Inter-Monsoon (Calm)</option>
                 <option value="Southwest Monsoon">Southwest Monsoon (Rough)</option>
                 <option value="Northeast Monsoon">Northeast Monsoon (Moderate)</option>
               </select>
             </div>
             
             <div>
                <label>Wind Force (Beaufort {formData.Wind_Beaufort})</label>
                <input type="number" name="Wind_Beaufort" min="0" max="12" value={formData.Wind_Beaufort} onChange={handleChange} />
             </div>
             
             <div>
                <label>Wave Height ({formData.Wave_Height_m}m)</label>
                <input type="number" name="Wave_Height_m" min="0" max="20" step="0.1" value={formData.Wave_Height_m} onChange={handleChange} />
             </div>
          </InputSection>

          <button onClick={handleSubmit} className="btn-primary" disabled={loading} style={{padding:'1.2rem', fontSize:'1.1rem'}}>
             {loading ? <Activity className="animate-spin" /> : 'RUN SIMULATION'}
          </button>

        </div>

        {/* RIGHT COLUMN: LIVE ANALYSIS */}
        <div className="output-column">
          
          <div className="result-card main">
             {!result ? (
               <div style={{textAlign:'center', padding:'3rem', opacity:0.5}}>
                 <Calculator size={48} style={{marginBottom:'1rem'}} />
                 <h3>Ready to Calculate</h3>
                 <p>Adjust parameters and run simulation.</p>
               </div>
             ) : (
               <>
                 <div className="metric-header">
                    <span>ESTIMATED BURN</span>
                    <span className="live-badge">LIVE AI</span>
                 </div>
                 <div className="fuel-display">
                    <span className="val">{result.predicted_fuel_tons.toFixed(1)}</span>
                    <span className="unit">Metric Tons</span>
                 </div>
                 
                 {/* INSIGHT CARDS */}
                 <div className="insight-grid">
                    {/* Biggest Increase */}
                    {Object.entries(result.contributions)
                       .filter(([,v]) => v > 0)
                       .sort(([,a], [,b]) => b - a)
                       .slice(0, 1)
                       .map(([k, v]) => (
                         <div key={k} className="insight-chip negative">
                            <AlertTriangle size={16} />
                            <div>
                               <strong>High Cost Driver</strong>
                               <div>{k.replace(/_/g, ' ')} (+{v.toFixed(1)}t)</div>
                            </div>
                         </div>
                    ))}
                    
                    {/* Biggest Save */}
                    {Object.entries(result.contributions)
                       .filter(([,v]) => v < 0)
                       .sort(([,a], [,b]) => a - b)
                       .slice(0, 1)
                       .map(([k, v]) => (
                         <div key={k} className="insight-chip positive">
                            <CheckCircle size={16} />
                            <div>
                               <strong>Efficiency Gain</strong>
                               <div>{k.replace(/_/g, ' ')} ({v.toFixed(1)}t)</div>
                            </div>
                         </div>
                    ))}
                 </div>

                 <div className="waterfall-chart">
                    <h4>Factor Breakdown</h4>
                    {Object.entries(result.contributions)
                        .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                        .slice(0, 5)
                        .map(([k, v]) => {
                          const max = 100; // Arbitrary scale factor visual
                          const width = Math.min((Math.abs(v) / 100) * 100, 100);
                          return (
                            <div key={k} className="chart-row">
                               <div className="label">{k.replace(/_/g, ' ')}</div>
                               <div className="bar-area">
                                  <div className={`bar ${v > 0 ? 'inc' : 'dec'}`} style={{width: `${width}%`}}></div>
                               </div>
                               <div className="val">{v > 0 ? '+' : ''}{v.toFixed(1)}</div>
                            </div>
                          )
                        })
                    }
                 </div>

                 <div className="ai-summary">
                    <h4><Zap size={16} fill="gold" color="gold"/> Captain's Insight</h4>
                    <p>{result.text_explanation.split('\n')[1].replace('- ', '')}</p>
                 </div>
               </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
