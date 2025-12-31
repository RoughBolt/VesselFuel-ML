from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from explainability import ExplainerService
import uvicorn
import os

app = FastAPI(title="Maritime Fuel XAI API")

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input Schema
class VoyageInput(BaseModel):
    # 1. Vessel
    Ship_Type: str
    DWT: float
    GT: float
    LOA: float
    Beam: float
    Design_Speed: float
    Draft_Percentage: float
    Hull_Fouling: str

    # 2. Propulsion
    Main_Engine_Type: str
    Engine_Power_kW: float
    SFOC_g_kWh: float
    Propeller_Type: str

    # 3. Voyage
    Distance_NM: float
    Avg_Speed_Knots: float
    Speed_Profile: str

    # 4. Environment
    Season: str
    Wind_Beaufort: int
    Wind_Direction: str
    Wave_Height_m: float
    Current_Speed_Knots: float
    Current_Direction: str

    # 5. Fuel & Ops
    Fuel_Type: str
    Weather_Routing_Efficiency: float

# Global Service
explainer = None

@app.on_event("startup")
def load_model():
    global explainer
    try:
        explainer = ExplainerService()
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/health")
def health_check():
    return {"status": "operational", "model_loaded": explainer.model is not None}

@app.post("/predict")
def predict_fuel(data: VoyageInput):
    if not explainer or not explainer.model:
        raise HTTPException(status_code=503, detail="Model not loaded yet. backend might be training.")
    
    try:
        input_dict = data.dict()
        result = explainer.explain(input_dict)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    # Force reload trigger (Attempt 2)
    uvicorn.run(app, host="0.0.0.0", port=8000)
