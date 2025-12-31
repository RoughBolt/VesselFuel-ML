import pandas as pd
import numpy as np
import joblib
import shap
import os

class ExplainerService:
    def __init__(self, model_path='maritime_model.pkl', preprocessor_path='preprocessor.pkl', features_col_path='feature_names.pkl'):
        print("Initializing ExplainerService...")
        self.model_path = model_path
        self.preprocessor_path = preprocessor_path
        
        if os.path.exists(model_path) and os.path.exists(preprocessor_path):
            self.model = joblib.load(model_path)
            self.preprocessor = joblib.load(preprocessor_path)
            self.feature_names = joblib.load(features_col_path)
            
            self.explainer = None 
            
        else:
            print("Model artifacts not found. Visualization/Prediction will fail until trained.")
            self.model = None

    def _get_feature_names_after_encoding(self):
        """
        Reconstructs feature names after OneHotEncoding to map SHAP values back to meaningful names.
        """
        transformers = self.preprocessor.named_transformers_
        cat_transformer = transformers['cat']
        
        encoded_cats = cat_transformer.get_feature_names_out(['Ship_Type', 'Current_Direction', 'Season'])
        
        numerics = ['DWT', 'Engine_Power_kW', 'Design_Speed', 'Avg_Speed_Knots', 
                   'Distance_NM', 'Draft_Percentage', 'Wind_Beaufort', 
                   'Wave_Height_m', 'Current_Speed_Knots']
        
        return list(numerics) + list(encoded_cats)

    def explain(self, input_data: dict):
        if not self.model:
            raise ValueError("Model not loaded")
            
        # 1. Prepare DataFrame
        input_df = pd.DataFrame([input_data])
        
        # 2. Preprocess
        processed_input = self.preprocessor.transform(input_df)
        
        # 3. Predict
        prediction = self.model.predict(processed_input)
        fuel_estimate = float(prediction[0])
        
        # 4. SHAP Explanation
        if self.explainer is None:
             feature_count = processed_input.shape[1]
             # Zero background
             background = np.zeros((1, feature_count))
             # For sklearn, we can pass the predict function
             self.explainer = shap.KernelExplainer(self.model.predict, background)
        
        shap_values = self.explainer.shap_values(processed_input)
        
        # Check shape - KernelExplainer returns array for single output
        if isinstance(shap_values, list):
            vals = shap_values[0][0]
        else:
            vals = shap_values[0]
            
        feature_names = self._get_feature_names_after_encoding()
        
        contributions = {}
        for name, val in zip(feature_names, vals):
            contributions[name] = float(val)
            
        aggregated_contributions = self._aggregate_contributions(contributions)
        
        text_explanation = self._generate_text(aggregated_contributions, fuel_estimate, input_data)
        
        return {
            "predicted_fuel_tons": round(fuel_estimate, 2),
            "contributions": aggregated_contributions,
            "text_explanation": text_explanation
        }

    def _aggregate_contributions(self, contributions):
        aggregated = {}
        for key, val in contributions.items():
            clean_name = key.replace('x0_', '').replace('cat__', '')
            aggregated[clean_name] = val
        return aggregated

    def _generate_text(self, contributions, estimate, input_data):
        sorted_impacts = sorted(contributions.items(), key=lambda x: abs(x[1]), reverse=True)
        top_factors = sorted_impacts[:3]
        
        explanation_lines = [
            f"The estimated fuel consumption is **{estimate:.2f} tons**."
        ]
        
        for feature, impact in top_factors:
            direction = "increased" if impact > 0 else "decreased"
            clean_feat = feature.replace('_', ' ')
            
            reason = ""
            if "Wave Height" in clean_feat and impact > 0:
                reason = "due to added resistance from rough seas"
            elif "Wind" in clean_feat and impact > 0:
                reason = "due to aerodynamic drag"
            elif "Avg Speed" in clean_feat:
                reason = "(higher speeds drastically increase power demand)"
            elif "Season" in clean_feat and "Southwest" in feature:
                reason = "reflecting monsoon conditions"
            
            line = f"- **{clean_feat}** {direction} consumption by {abs(impact):.2f} tons {reason}."
            explanation_lines.append(line)
            
        return "\n".join(explanation_lines)
