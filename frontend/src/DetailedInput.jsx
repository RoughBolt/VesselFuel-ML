import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronRight, Anchor, Gauge, Wind, AlertCircle } from 'lucide-react';

const SECTIONS = [
  { id: 'basic', label: '1. Basic Specifications', icon: Anchor },
  { id: 'ops', label: '2. Operational & Voyage', icon: Gauge },
  { id: 'adv', label: '3. Advanced & Env', icon: Wind }
];

// Default fallback if starting from scratch
const DEFAULT_DATA = {
    Ship_Type: 'Container', DWT: 50000, GT: 35000, LOA: 200, Beam: 32, 
    Design_Speed: 20, Draft_Percentage: 80, Hull_Fouling: 'Clean',
    Main_Engine_Type: '2-Stroke', Engine_Power_kW: 30000, SFOC_g_kWh: 170, 
    Propeller_Type: 'Fixed Pitch',
    Distance_NM: 1000, Avg_Speed_Knots: 15, Speed_Profile: 'Constant',
    Season: 'Inter-Monsoon', Wind_Beaufort: 3, Wind_Direction: 'Head', 
    Wave_Height_m: 1.0, Current_Speed_Knots: 0.5, Current_Direction: 'Head',
    Fuel_Type: 'HFO', Weather_Routing_Efficiency: 0
};

const InputGroup = ({ label, children, tooltip }) => (
    <div style={{marginBottom: '1rem'}}>
        <label style={{color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
            {label}
            {tooltip && <AlertCircle size={12} color="#475569" title={tooltip} style={{cursor:'help'}} />}
        </label>
        {children}
    </div>
);

const Select = ({ name, value, onChange, options }) => (
    <select 
        name={name} value={value} onChange={onChange}
        style={{
            width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155', 
            borderRadius: '8px', color: '#fff', outline: 'none'
        }}
    >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
);

const Input = ({ name, type='text', value, onChange, min, max }) => (
    <input 
        name={name} type={type} value={value} onChange={onChange} min={min} max={max}
        style={{
            width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155', 
            borderRadius: '8px', color: '#fff', outline: 'none'
        }}
    />
);

const DetailedInput = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(state?.formData || DEFAULT_DATA);
    const [activeTab, setActiveTab] = useState('basic');

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleNext = () => {
        navigate('/review', { state: { formData } });
    };

    return (
        <div style={{minHeight: '100vh', background: '#0f172a', padding: '2rem'}}>
            <div style={{maxWidth: '1000px', margin: '0 auto'}}>
                
                {/* Header */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                    <div>
                        <h1 style={{fontSize: '2rem', fontWeight: 700}}>Mission Configuration</h1>
                        <p style={{color: '#64748b'}}>Configure detailed parameters for high-fidelity simulation.</p>
                    </div>
                    <button 
                        onClick={handleNext}
                        style={{
                            background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', 
                            borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        Review Payload <ChevronRight size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                    {SECTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveTab(s.id)}
                            style={{
                                flex: 1, padding: '1rem', background: activeTab === s.id ? '#1e293b' : 'transparent',
                                border: activeTab === s.id ? '1px solid #3b82f6' : '1px solid #334155',
                                borderRadius: '12px', color: activeTab === s.id ? '#fff' : '#64748b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <s.icon size={20} />
                            <span style={{fontWeight: 600}}>{s.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{background: '#1e293b', borderRadius: '16px', padding: '2rem', border: '1px solid #334155'}}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'basic' && (
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                                    <InputGroup label="Vessel Type" tooltip="Determines base hull coefficients">
                                        <Select name="Ship_Type" value={formData.Ship_Type} onChange={handleChange} options={['Container', 'Bulker', 'Tanker', 'Ro-Ro', 'LNG']} />
                                    </InputGroup>
                                    <InputGroup label="Deadweight (DWT)" tooltip="Carrying capacity in tons">
                                        <Input name="DWT" type="number" value={formData.DWT} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Gross Tonnage (GT)">
                                        <Input name="GT" type="number" value={formData.GT} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Hull Fouling Condition" tooltip="Impacts drag resistance">
                                        <Select name="Hull_Fouling" value={formData.Hull_Fouling} onChange={handleChange} options={['Clean', 'Moderate', 'Heavy']} />
                                    </InputGroup>
                                    <InputGroup label="Length Overall (LOA) [m]">
                                        <Input name="LOA" type="number" value={formData.LOA} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Beam (Width) [m]">
                                        <Input name="Beam" type="number" value={formData.Beam} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Design Speed [knots]">
                                        <Input name="Design_Speed" type="number" value={formData.Design_Speed} onChange={handleChange} />
                                    </InputGroup>
                                </div>
                            )}

                            {activeTab === 'ops' && (
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                                    <InputGroup label="Average Speed [knots]">
                                        <Input name="Avg_Speed_Knots" type="number" value={formData.Avg_Speed_Knots} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Voyage Distance [NM]">
                                        <Input name="Distance_NM" type="number" value={formData.Distance_NM} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Current Draft [%]" tooltip="How heavy the ship is loaded">
                                        <Input name="Draft_Percentage" type="number" value={formData.Draft_Percentage} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Speed Profile">
                                        <Select name="Speed_Profile" value={formData.Speed_Profile} onChange={handleChange} options={['Constant', 'Variable']} />
                                    </InputGroup>
                                    <InputGroup label="Main Engine Type">
                                        <Select name="Main_Engine_Type" value={formData.Main_Engine_Type} onChange={handleChange} options={['2-Stroke', '4-Stroke']} />
                                    </InputGroup>
                                    <InputGroup label="Engine Power [kW]">
                                        <Input name="Engine_Power_kW" type="number" value={formData.Engine_Power_kW} onChange={handleChange} />
                                    </InputGroup>
                                </div>
                            )}

                            {activeTab === 'adv' && (
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                                    <InputGroup label="Fuel Type">
                                        <Select name="Fuel_Type" value={formData.Fuel_Type} onChange={handleChange} options={['HFO', 'VLSFO', 'MGO', 'LNG']} />
                                    </InputGroup>
                                    <InputGroup label="Weather Routing Eff. [%]" tooltip="Efficiency gain from routing">
                                        <Input name="Weather_Routing_Efficiency" type="number" value={formData.Weather_Routing_Efficiency} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="SFOC [g/kWh]" tooltip="Specific Fuel Oil Consumption">
                                        <Input name="SFOC_g_kWh" type="number" value={formData.SFOC_g_kWh} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Propeller Type">
                                        <Select name="Propeller_Type" value={formData.Propeller_Type} onChange={handleChange} options={['Fixed Pitch', 'Controllable Pitch']} />
                                    </InputGroup>
                                    
                                    <hr style={{gridColumn: 'span 2', borderColor: '#334155'}} />
                                    <h3 style={{gridColumn: 'span 2', fontSize: '1rem', color:'#fff'}}>Environmental Condition</h3>
                                    
                                    <InputGroup label="Season">
                                        <Select name="Season" value={formData.Season} onChange={handleChange} options={['Inter-Monsoon', 'Southwest Monsoon', 'Northeast Monsoon']} />
                                    </InputGroup>
                                    <InputGroup label="Wind Beaufort [0-12]">
                                        <Input name="Wind_Beaufort" type="number" value={formData.Wind_Beaufort} onChange={handleChange} max={12} />
                                    </InputGroup>
                                    <InputGroup label="Wave Height [m]">
                                        <Input name="Wave_Height_m" type="number" value={formData.Wave_Height_m} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Current Speed [knots]">
                                        <Input name="Current_Speed_Knots" type="number" value={formData.Current_Speed_Knots} onChange={handleChange} />
                                    </InputGroup>
                                    <InputGroup label="Wind Direction">
                                        <Select name="Wind_Direction" value={formData.Wind_Direction} onChange={handleChange} options={['Head', 'Beam', 'Following', 'Quartering']} />
                                    </InputGroup>
                                    <InputGroup label="Current Direction">
                                        <Select name="Current_Direction" value={formData.Current_Direction} onChange={handleChange} options={['Head', 'Beam', 'Following']} />
                                    </InputGroup>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DetailedInput;
