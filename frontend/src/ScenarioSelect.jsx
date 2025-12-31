import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, CloudLightning, Leaf, Sliders } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'sunny',
    title: 'Sunny / Calm',
    icon: Sun,
    desc: 'Optimal condition analysis.',
    img: '/assets/sunny.png',
    data: {
        // V2 ADVANCED DATA MODEL (24 Fields)
        // 1. Vessel
        Ship_Type: 'Container', DWT: 80000, GT: 64000, LOA: 300.0, Beam: 42.0, 
        Design_Speed: 24.0, Draft_Percentage: 90, Hull_Fouling: 'Clean',
        
        // 2. Propulsion
        Main_Engine_Type: '2-Stroke', Engine_Power_kW: 45000, SFOC_g_kWh: 165.0, 
        Propeller_Type: 'Fixed Pitch',
        
        // 3. Voyage
        Distance_NM: 3000, Avg_Speed_Knots: 18.0, Speed_Profile: 'Constant',
        
        // 4. Environment
        Season: 'Inter-Monsoon', Wind_Beaufort: 2, Wind_Direction: 'Head', 
        Wave_Height_m: 0.5, Current_Speed_Knots: 0.2, Current_Direction: 'Head',
        
        // 5. Fuel & Ops
        Fuel_Type: 'HFO', Weather_Routing_Efficiency: 0.0
    }
  },
  {
    id: 'storm',
    title: 'Monsoon Storm',
    icon: CloudLightning,
    desc: 'Heavy weather stress test.',
    img: '/assets/storm.png',
    data: {
        Ship_Type: 'Container', DWT: 80000, GT: 64000, LOA: 300.0, Beam: 42.0, 
        Design_Speed: 24.0, Draft_Percentage: 90, Hull_Fouling: 'Moderate',
        
        Main_Engine_Type: '2-Stroke', Engine_Power_kW: 45000, SFOC_g_kWh: 165.0, 
        Propeller_Type: 'Fixed Pitch',
        
        Distance_NM: 3000, Avg_Speed_Knots: 14.0, Speed_Profile: 'Variable',
        
        Season: 'Southwest Monsoon', Wind_Beaufort: 9, Wind_Direction: 'Head', 
        Wave_Height_m: 6.0, Current_Speed_Knots: 2.0, Current_Direction: 'Head',
        
        Fuel_Type: 'HFO', Weather_Routing_Efficiency: 5.0
    }
  },
  {
    id: 'eco',
    title: 'Eco Steaming',
    icon: Leaf,
    desc: 'Fuel efficiency prioritized.',
    img: '/assets/eco.png',
    data: {
        Ship_Type: 'Container', DWT: 80000, GT: 64000, LOA: 300.0, Beam: 42.0, 
        Design_Speed: 24.0, Draft_Percentage: 80, Hull_Fouling: 'Clean',
        
        Main_Engine_Type: '2-Stroke', Engine_Power_kW: 45000, SFOC_g_kWh: 160.0, 
        Propeller_Type: 'Fixed Pitch',
        
        Distance_NM: 3000, Avg_Speed_Knots: 12.0, Speed_Profile: 'Constant',
        
        Season: 'Inter-Monsoon', Wind_Beaufort: 3, Wind_Direction: 'Following', 
        Wave_Height_m: 1.0, Current_Speed_Knots: 0.5, Current_Direction: 'Following',
        
        Fuel_Type: 'VLSFO', Weather_Routing_Efficiency: 8.0
    }
  },
  {
    id: 'custom',
    title: 'Custom Config',
    icon: Sliders,
    desc: 'Full parameter control.',
    img: '/assets/bridge.png', 
    data: null // Triggers manual entry
  }
];

const ScenarioSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (scenario) => {
    // Navigate to Detailed Input Wizard for specific configuration check
    // Pass the preset data (or null for custom)
    navigate('/mission-control', { state: { formData: scenario.data } });
  };

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', padding: '4rem 2rem'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <motion.div 
           initial={{opacity: 0, y: 20}}
           animate={{opacity: 1, y: 0}}
           style={{textAlign: 'center', marginBottom: '4rem'}}
        >
           <h1 style={{fontSize: '3rem', fontWeight: 700, marginBottom: '1rem'}}>Select Simulation Profile</h1>
           <p style={{color: '#94a3b8', fontSize: '1.2rem'}}>Choose a preset environment or configure manually.</p>
        </motion.div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem'}}>
          {SCENARIOS.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: index * 0.1}}
              whileHover={{y: -10, scale: 1.02}}
              onClick={() => handleSelect(item)}
              style={{
                background: '#1e293b', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                border: '1px solid #334155', height: '400px', position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
               <div style={{height: '60%', backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.8)'}} />
               <div style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#fff'}}>
                    <item.icon color="#3b82f6" />
                    <h3 style={{fontSize: '1.25rem', margin: 0}}>{item.title}</h3>
                  </div>
                  <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>{item.desc}</p>
               </div>
               
               {/* Hover Overlay Effect (CSS handled via styled component logic usually, here inline simplistic) */}
               <div style={{position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: '#3b82f6', color: '#fff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600}}>
                  SELECT
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelect;
