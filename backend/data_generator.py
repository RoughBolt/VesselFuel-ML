import pandas as pd
import numpy as np
import random

def generate_synthetic_data(num_samples=3000):
    """
    Generates advanced synthetic maritime data based on the 8-point User Specification.
    Includes comprehensive Vessel, Propulsion, Voyage, Environmental, and Operational parameters.
    """
    
    data = []
    
    # --- CONSTANTS & LOOKUPS ---
    SHIP_SPECS = {
        'Container': {'dwt_range': (20000, 220000), 'design_speed_range': (18, 25), 'loa_factor': 0.0015, 'beam_factor': 0.0002, 'gt_factor': 0.8},
        'Bulker':    {'dwt_range': (30000, 300000), 'design_speed_range': (12, 16), 'loa_factor': 0.0012, 'beam_factor': 0.00018, 'gt_factor': 0.6},
        'Tanker':    {'dwt_range': (50000, 400000), 'design_speed_range': (13, 17), 'loa_factor': 0.0011, 'beam_factor': 0.00022, 'gt_factor': 0.7},
        'Ro-Ro':     {'dwt_range': (10000, 60000),  'design_speed_range': (16, 21), 'loa_factor': 0.002,  'beam_factor': 0.00025, 'gt_factor': 1.1},
        'LNG':       {'dwt_range': (60000, 120000), 'design_speed_range': (16, 20), 'loa_factor': 0.0018, 'beam_factor': 0.00028, 'gt_factor': 0.9}
    }
    
    FUEL_PROPS = {
        'HFO': {'lcv': 40.0, 'cost_base': 500, 'emission_factor': 3.114}, # MJ/kg
        'VLSFO': {'lcv': 41.5, 'cost_base': 650, 'emission_factor': 3.15},
        'MGO': {'lcv': 42.7, 'cost_base': 900, 'emission_factor': 3.206},
        'LNG': {'lcv': 48.0, 'cost_base': 700, 'emission_factor': 2.75}
    }

    for _ in range(num_samples):
        # 🔵 1. VESSEL CHARACTERISTICS
        ship_type = random.choice(list(SHIP_SPECS.keys()))
        specs = SHIP_SPECS[ship_type]
        
        dwt = np.random.uniform(*specs['dwt_range'])
        gt = dwt * specs['gt_factor'] * np.random.uniform(0.9, 1.1)
        loa = (dwt ** 0.45) * 5 + np.random.normal(0, 5) # Loosely based on DWT
        beam = loa * 0.14 + np.random.normal(0, 1)
        
        design_speed = np.random.uniform(*specs['design_speed_range'])
        design_draft = (dwt ** 0.3) * 0.5 # Approx
        
        hull_fouling_options = ['Clean', 'Moderate', 'Heavy'] # Impact resistance
        hull_fouling = np.random.choice(hull_fouling_options, p=[0.5, 0.35, 0.15])
        
        # 🔵 2. PROPULSION & ENGINE
        # Engine Power estimation (Admiralty coeff variant)
        # Power ~ DWT^(2/3) * V^3
        base_power_kw = (dwt ** 0.6) * (design_speed ** 2.5) * 0.12 
        engine_power_kw = base_power_kw * np.random.uniform(0.9, 1.1)
        
        main_engine_type = '2-Stroke' if engine_power_kw > 10000 else '4-Stroke'
        propeller_type = np.random.choice(['Fixed Pitch', 'Controllable Pitch'], p=[0.8, 0.2])
        
        # SFOC depends on engine age/type. Modern large 2-stroke ~160-170, Older ~180-190
        sfoc_base = 165 if main_engine_type == '2-Stroke' else 185
        sfoc_g_kwh = np.random.normal(sfoc_base, 5)
        
        aux_power_kw = engine_power_kw * 0.15 # Hotel load + pumps
        
        # 🔵 3. VOYAGE & SPEED PROFILE
        distance_nm = np.random.uniform(500, 8000)
        
        # Operational Speed
        avg_speed = np.random.uniform(design_speed * 0.5, design_speed * 0.95)
        speed_profile = np.random.choice(['Constant', 'Variable'], p=[0.7, 0.3])
        
        # Draft %
        draft_perc = np.random.uniform(50, 100) # Ballast to Full Laden
        
        time_at_sea_hours = distance_nm / avg_speed
        maneuvering_hours = np.random.uniform(2, 6)
        idle_hours = np.random.uniform(0, 48)
        
        # 🔵 4. ENVIRONMENTAL CONDITIONS
        month = random.randint(1, 12)
        if 6 <= month <= 9: season = 'Southwest Monsoon'
        elif 10 <= month <= 12: season = 'Northeast Monsoon'
        else: season = 'Inter-Monsoon'
            
        wind_beaufort = np.random.randint(1, 10)
        wind_dir = random.choice(['Head', 'Beam', 'Following', 'Quartering'])
        
        wave_height = wind_beaufort * 0.5 + np.random.normal(0, 0.2)
        wave_height = max(0.1, wave_height)
        wave_dir = wind_dir # Usually correlated
        
        current_speed = np.random.uniform(0, 3.0)
        current_dir = random.choice(['Head', 'Beam', 'Following'])
        
        # 🔵 5. FUEL CHARACTERISTICS
        fuel_type = np.random.choice(list(FUEL_PROPS.keys()), p=[0.4, 0.4, 0.15, 0.05])
        fuel_props = FUEL_PROPS[fuel_type]
        
        # 🔵 6. OPERATIONS & EFFICIENCY
        weather_routing_efficiency = np.random.uniform(0, 10) if speed_profile == 'Variable' else 0
        
        # --- CALCULATION ENGINE (Physics Proxy) ---
        
        # 1. Speed Power Curve
        speed_ratio = avg_speed / design_speed
        propulsion_power = engine_power_kw * (speed_ratio ** 3)
        
        # 2. Draft Penalty
        # Displacement ~ Draft. Power ~ Displacement^(2/3)
        draft_factor = (draft_perc / 100.0) ** 0.66
        
        # 3. Hull Fouling Penalty
        fouling_penalty = 1.0
        if hull_fouling == 'Moderate': fouling_penalty = 1.05
        elif hull_fouling == 'Heavy': fouling_penalty = 1.12
        
        # 4. Weather Penalty (Resistance)
        weather_factor = 1.0
        # Wind
        wind_resist = 0.0
        if wind_dir in ['Head', 'Quartering']:
            wind_resist = (wind_beaufort ** 2) * 0.002
        elif wind_dir == 'Following':
            wind_resist = -0.01 # Slight help
            
        # Waves (Significant impact)
        wave_resist = 0.0
        if wave_dir == 'Head':
            wave_resist = wave_height * 0.06
        elif wave_dir == 'Beam':
            wave_resist = wave_height * 0.02
            
        weather_factor += wind_resist + wave_resist
        
        # 5. Current Impact on Ground Speed vs Water Speed
        # If Head current, ship must push harder through water to maintain Avg Ground Speed
        # Power ~ (V_ground + V_current)^3
        v_water = avg_speed
        if current_dir == 'Head':
            v_water += current_speed
        elif current_dir == 'Following':
            v_water -= current_speed
            
        # Recalculate basic power based on speed through water
        propulsion_power_water = engine_power_kw * ((v_water / design_speed) ** 3)
        
        # 6. Apply Factors
        required_main_power = propulsion_power_water * draft_factor * fouling_penalty * weather_factor
        
        # Efficiency gains (Weather Routing)
        required_main_power *= (1 - (weather_routing_efficiency / 100.0))
        
        # Cap at 100% MCR (Engine Limit) - if requires more, speed drops in reality, here we assume higher burn or max burn
        required_main_power = min(required_main_power, engine_power_kw * 1.05)
        
        # 7. Fuel Burn Calculation
        # Main Engine (Sea Time)
        fuel_me_tons = (required_main_power * sfoc_g_kwh * time_at_sea_hours) / 1_000_000
        
        # Aux Engine (All Time) - Constant load assumption + maneuvering peaks
        aux_load = aux_power_kw * 0.6 # Average aux load
        fuel_ae_tons = (aux_load * 200 * (time_at_sea_hours + maneuvering_hours + idle_hours)) / 1_000_000
        
        total_fuel = fuel_me_tons + fuel_ae_tons
        
        # Add noise
        total_fuel *= np.random.uniform(0.95, 1.05)
        
        # 🔵 8. DERIVED OUTPUTS
        cost = total_fuel * fuel_props['cost_base']
        emissions_co2 = total_fuel * fuel_props['emission_factor']
        
        data.append({
            # Inputs
            'Ship_Type': ship_type,
            'DWT': int(dwt),
            'GT': int(gt),
            'LOA': round(loa, 1),
            'Beam': round(beam, 1),
            'Design_Speed': round(design_speed, 1),
            'Draft_Percentage': int(draft_perc),
            'Hull_Fouling': hull_fouling,
            
            'Main_Engine_Type': main_engine_type,
            'Engine_Power_kW': int(engine_power_kw),
            'SFOC_g_kWh': round(sfoc_g_kwh, 1),
            'Propeller_Type': propeller_type,
            
            'Distance_NM': int(distance_nm),
            'Avg_Speed_Knots': round(avg_speed, 1),
            'Speed_Profile': speed_profile,
            
            'Season': season,
            'Wind_Beaufort': int(wind_beaufort),
            'Wind_Direction': wind_dir,
            'Wave_Height_m': round(wave_height, 1),
            'Current_Speed_Knots': round(current_speed, 1),
            'Current_Direction': current_dir,
            
            'Fuel_Type': fuel_type,
            'Weather_Routing_Efficiency': round(weather_routing_efficiency, 1),
            
            # Target
            'Fuel_Consumption_Tons': round(total_fuel, 2),
            
            # Analytics (Optional, but good for charts if we pass them)
            # 'CO2_Emissions_Tons': round(emissions_co2, 2),
            # 'Fuel_Cost_USD': round(cost, 2)
        })
        
    return pd.DataFrame(data)

if __name__ == "__main__":
    print("Generating ADVANCED synthetic maritime data...")
    df = generate_synthetic_data(4000)
    df.to_csv("fuel_consumption_data.csv", index=False)
    print(f"Data generated: {len(df)} records with {len(df.columns)} columns.")
    print(df.head())
