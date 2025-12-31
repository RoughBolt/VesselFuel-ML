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
    Ship_Type: str
    DWT: float
    Engine_Power_kW: float
    Design_Speed: float
    Avg_Speed_Knots: float
    Distance_NM: float
    Draft_Percentage: float
    Wind_Beaufort: int
    Wave_Height_m: float
    Current_Speed_Knots: float
    Current_Direction: str
    Season: str

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
