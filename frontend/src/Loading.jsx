import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QUOTES = [
  "Consulting Poseidon for wave data...",
  "Calibrating hull resistance matrices...",
  "Running fluid dynamics simulations...",
  "Checking Indian Ocean currents...",
  "Asking the Kraken for permission...",
  "Optimizing bunker fuel mixtures...",
];

const Loading = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Quote rotation
    const quoteInterval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 1200);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 50);

    // API Call (in background)
    // We delay the actual navigation to let the user enjoy the funny quotes for at least 3-4s
    const performPrediction = async () => {
        try {
            const defaults = {
                // V2 Fallback for direct access or partial state
                Ship_Type: 'Container', DWT: 80000, GT: 64000, LOA: 300.0, Beam: 42.0, 
                Design_Speed: 24.0, Draft_Percentage: 90, Hull_Fouling: 'Clean',
                Main_Engine_Type: '2-Stroke', Engine_Power_kW: 45000, SFOC_g_kWh: 165.0, 
                Propeller_Type: 'Fixed Pitch',
                Distance_NM: 3000, Avg_Speed_Knots: 18.0, Speed_Profile: 'Constant',
                Season: 'Inter-Monsoon', Wind_Beaufort: 2, Wind_Direction: 'Head', 
                Wave_Height_m: 0.5, Current_Speed_Knots: 0.2, Current_Direction: 'Head',
                Fuel_Type: 'HFO', Weather_Routing_Efficiency: 0.0
            };
            
            // Merge defaults with incoming state to ensure all fields exist even if state is old
            const formData = { ...defaults, ...(state?.formData || {}) };
            // We use state.formData which came from Review
            // Force 127.0.0.1 to avoid IPv6 localhost issues on Mac
            console.log("Sending Prediction Request:", formData);
            const response = await axios.post('http://127.0.0.1:8000/predict', formData);
            
            console.log("Prediction Success:", response.data);

            // Wait until progress is complete visually
            setTimeout(() => {
                navigate('/result', { state: { result: response.data, input: formData } });
            }, 3000); 

        } catch (err) {
            console.error("Prediction Error Details:", err);
            if (err.response) {
                console.error("Server Response:", err.response.data);
                alert(`Server Error: ${JSON.stringify(err.response.data)}`);
            } else {
                alert(`Connection Failed: ${err.message}`);
            }
            navigate('/scenarios'); // Fail safe
        }
    };

    performPrediction();

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div style={{height: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
       
       <div style={{fontSize: '4rem', marginBottom: '2rem'}}>⚓️</div>
       
       <h2 style={{fontSize: '1.5rem', fontWeight: 400, marginBottom: '3rem', minHeight: '3rem', textAlign: 'center', color: '#3b82f6'}}>
         "{QUOTES[quoteIndex]}"
       </h2>

       <div style={{width: '300px', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${progress}%`, background: '#3b82f6', transition: 'width 0.1s linear'}} />
       </div>
       
       <div style={{marginTop: '1rem', color: '#64748b', fontSize: '0.9rem'}}>Processing AI Models... {progress}%</div>
    </div>
  );
};

export default Loading;
