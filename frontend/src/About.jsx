import React from 'react';
import { Database, Brain, Globe, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="about-container">
      <h1>About the System</h1>
      <p className="subtitle">Operational maritime intelligence powered by Explainable AI.</p>

      <div className="grid-cols-2" style={{marginBottom: '2rem'}}>
        <div className="card">
          <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
             <Globe className="text-blue-500" size={24} />
             <h3 style={{margin:0}}>Regional Focus: Indian Ocean</h3>
          </div>
          <p style={{color:'var(--col-text-muted)', lineHeight:'1.6'}}>
            Unlike generic global models, this system is calibrated specifically for the Indian Ocean's 
            unique environmental dynamics, including the <strong>Southwest and Northeast Monsoons</strong>.
            It accounts for regional wave interactions, current patterns, and temperature gradients that 
            significantly impact vessel hull resistance.
          </p>
        </div>

        <div className="card">
           <div style={{display:'flex', gap:'1rem', marginBottom:'1rem'}}>
             <ShieldCheck className="text-green-500" size={24} />
             <h3 style={{margin:0}}>Why Explainability?</h3>
          </div>
          <p style={{color:'var(--col-text-muted)', lineHeight:'1.6'}}>
            In maritime logistics, trust is paramount. A "black box" prediction is insufficient for 
            captains and fleet managers. We use <strong>SHAP (SHapley Additive exPlanations)</strong> to 
            mathematically decompose every prediction, attributing exact tonnage costs to specific factors 
            like "High Waves" or "Engine Loading".
          </p>
        </div>
      </div>

      <h2>Technical Methodology</h2>
      <div className="card">
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'2rem'}}>
          
          <div className="method-step">
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem'}}>
              <Database size={20} />
              <strong>1. Physics-Informed Data</strong>
            </div>
            <p className="text-sm text-gray-400">
              Synthetic training data is generated using the <strong>Admiralty Coefficient Formula</strong> for 
              base resistance, then modified by stochastic environmental factors derived from Indian Ocean climatology.
            </p>
          </div>

          <div className="method-step">
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem'}}>
              <Brain size={20} />
              <strong>2. Neural Regression</strong>
            </div>
            <p className="text-sm text-gray-400">
              A Scikit-Learn <strong>MLPRegressor (Multi-Layer Perceptron)</strong> with structure (64, 32, 16) 
              learns the non-linear relationships between 12 distinct input features and final fuel consumption.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
