import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error

def train_model():
    print("Loading data...")
    df = pd.read_csv('fuel_consumption_data.csv')
    
    # Separate features and target
    X = df.drop('Fuel_Consumption_Tons', axis=1)
    y = df['Fuel_Consumption_Tons']
    
    # Identify Categorical and Numerical columns (V2 Advanced Model)
    categorical_cols = [
        'Ship_Type', 'Hull_Fouling', 'Main_Engine_Type', 'Propeller_Type', 
        'Speed_Profile', 'Season', 'Wind_Direction', 'Current_Direction', 'Fuel_Type'
    ]
    
    numerical_cols = [
        'DWT', 'GT', 'LOA', 'Beam', 'Design_Speed', 'Draft_Percentage', 
        'Engine_Power_kW', 'SFOC_g_kWh', 'Distance_NM', 'Avg_Speed_Knots', 
        'Wind_Beaufort', 'Wave_Height_m', 'Current_Speed_Knots', 'Weather_Routing_Efficiency'
    ]
    
    print(f"Numerical features ({len(numerical_cols)}): {numerical_cols}")
    print(f"Categorical features ({len(categorical_cols)}): {categorical_cols}")
    
    # Preprocessing Pipeline
    numerical_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, numerical_cols),
            ('cat', categorical_transformer, categorical_cols)
        ]
    )
    
    # Fit the preprocessor
    X_processed = preprocessor.fit_transform(X)
    
    print(f"DEBUG: Processed Feature Shape: {X_processed.shape}")
    feature_names = preprocessor.get_feature_names_out()
    print(f"DEBUG: Total Features: {len(feature_names)}")
    # print(f"DEBUG: Feature Names: {feature_names}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)
    
    print(f"Training data shape: {X_train.shape}")
    
    # Build MLP Model (Neural Network)
    # Using 'relu' and 'adam' to match the TF architecture
    model = MLPRegressor(
        hidden_layer_sizes=(64, 32, 16),
        activation='relu',
        solver='adam',
        max_iter=500,
        random_state=42
    )
    
    print("Training model...")
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Test MAE: {mae:.2f} tons")
    
    # Save Artifacts
    print("Saving artifacts...")
    joblib.dump(model, 'backend/maritime_model.pkl')
    joblib.dump(preprocessor, 'backend/preprocessor.pkl')
    joblib.dump(list(X.columns), 'backend/feature_names.pkl')
    
    print("Model and preprocessor saved to backend/")

if __name__ == "__main__":
    train_model()
