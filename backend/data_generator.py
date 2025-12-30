import pandas as pd
import numpy as np
import random

def generate_synthetic_data(num_samples=2000):
    """
    Generates synthetic maritime data tailored for Indian Ocean conditions.
    Includes physics-based estimates modified by environmental factors.
    """
    
    # 1. Vessel Characteristics
    ship_types = ['Container', 'Bulker', 'Tanker']
    
    data = []
    
    for _ in range(num_samples):
        ship_type = random.choice(ship_types)
        
        # Base specs based on ship type
        if ship_type == 'Container':
            dwt = np.random.uniform(20000, 150000) # Deadweight Tonnage
            design_speed = np.random.uniform(18, 24) # Knots
            engine_power_kw = dwt * 0.4 + np.random.normal(0, 500) # Rough approx
        elif ship_type == 'Bulker':
            dwt = np.random.uniform(30000, 200000)
            design_speed = np.random.uniform(12, 16)
            engine_power_kw = dwt * 0.15 + np.random.normal(0, 500)
        else: # Tanker
            dwt = np.random.uniform(50000, 300000)
            design_speed = np.random.uniform(13, 17)
            engine_power_kw = dwt * 0.18 + np.random.normal(0, 500)
            
        # 2. Voyage Parameters
        distance_nm = np.random.uniform(500, 5000) # Nautical Miles
        
        # Operational Speed (usually slower than design speed)
        avg_speed = np.random.uniform(design_speed * 0.6, design_speed * 0.95)
        
        # Draft (Load %)
        draft_percentage = np.random.uniform(50, 100)
        
        # 3. Environmental Factors (Indian Ocean Context)
        # Seasonality
        month = random.randint(1, 12)
        season = 'Inter-Monsoon'
        if 6 <= month <= 9:
            season = 'Southwest Monsoon'
        elif 10 <= month <= 12:
            season = 'Northeast Monsoon'
            
        # Environmental conditions based on season
        if season == 'Southwest Monsoon':
            wind_beaufort = np.random.randint(4, 9) # Rougher
            wave_height_m = np.random.uniform(2.5, 6.0)
            current_speed = np.random.uniform(0.5, 2.5)
            # Monsoon currents often oppose or are turbulent
            current_direction_rel = random.choice(['Head', 'Beam', 'Following']) 
        elif season == 'Northeast Monsoon':
            wind_beaufort = np.random.randint(3, 7) # Moderate
            wave_height_m = np.random.uniform(1.5, 4.0)
            current_speed = np.random.uniform(0.5, 1.5)
            current_direction_rel = random.choice(['Head', 'Beam', 'Following'])
        else: # Inter-Monsoon (Calmer)
            wind_beaufort = np.random.randint(1, 4)
            wave_height_m = np.random.uniform(0.5, 2.0)
            current_speed = np.random.uniform(0.1, 1.0)
            current_direction_rel = random.choice(['Head', 'Beam', 'Following'])
            
        # 4. Fuel Consumption Calculation (Physics + Penalties)
        
        # Base Consumption: Power (kW) * SFOC (g/kWh) * Time (h) * LoadFactor
        # Simplify: Power proportional to cube of speed ratio
        speed_ratio = avg_speed / design_speed
        actual_power_kw = engine_power_kw * (speed_ratio ** 3)
        
        # Draft impact: heavier ship needs more power
        # Reference draft is typically design draft, we treat engine_power_kw as max.
        # Reduced draft reduces resistance somewhat, but we'll model as a load factor on engine
        draft_factor = (draft_percentage / 100) ** 0.66 
        
        # Environmental Penalties (The "Slip")
        # Head winds/waves increase resistance drastically
        weather_penalty_factor = 1.0
        
        # Wind penalty
        if wind_beaufort > 4:
            weather_penalty_factor += (wind_beaufort - 4) * 0.03
            
        # Wave penalty
        weather_penalty_factor += wave_height_m * 0.05
        
        # Current impact
        if current_direction_rel == 'Head':
            # Effective speed through water is higher than speed over ground to maintain schedule
            # Resistance increases approximately with square impact on effective speed
            weather_penalty_factor += current_speed * 0.04
        elif current_direction_rel == 'Following':
            weather_penalty_factor -= current_speed * 0.02 # Aid
            
        # Calculate Time
        voyage_time_hours = distance_nm / avg_speed
        
        # Specific Fuel Oil Consumption (SFOC) - typically 170-190 g/kWh for large engines
        sfoc = np.random.normal(180, 5) 
        
        # Total Consumption (Formula)
        # Tons = (kW * g/kWh * hours * 1e-6)
        
        final_power_demand = actual_power_kw * draft_factor * weather_penalty_factor
        
        # Cap power at max engine rating (110% overload allowed briefly) but usually 100%
        # If demand exceeds engine power, speed would drop.
        # For this dataset, we assume fuel is burned to TRY to maintain conditions, or engine works harder.
        
        total_fuel_tons = (final_power_demand * sfoc * voyage_time_hours) / 1_000_000
        
        # Add a little noise for "real world" variance
        total_fuel_tons *= np.random.uniform(0.95, 1.05)
        
        data.append({
            'Ship_Type': ship_type,
            'DWT': int(dwt),
            'Engine_Power_kW': int(engine_power_kw),
            'Design_Speed': round(design_speed, 1),
            'Avg_Speed_Knots': round(avg_speed, 1),
            'Distance_NM': int(distance_nm),
            'Draft_Percentage': round(draft_percentage, 1),
            'Wind_Beaufort': wind_beaufort,
            'Wave_Height_m': round(wave_height_m, 2),
            'Current_Speed_Knots': round(current_speed, 2),
            'Current_Direction': current_direction_rel,
            'Season': season,
            'Fuel_Consumption_Tons': round(total_fuel_tons, 2)
        })
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    print("Generating synthetic maritime data...")
    df = generate_synthetic_data(2000)
    df.to_csv("fuel_consumption_data.csv", index=False)
    print(f"Data generated: {len(df)} records saved to fuel_consumption_data.csv")
    print(df.head())
