# 🚢 VesselFuel-ML

**AI-Powered Maritime Fuel Consumption Prediction**

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68%2B-009688?style=for-the-badge&logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📌 Overview

**VesselFuel-ML** is a full-stack intelligent system designed to predict vessel fuel consumption with high accuracy. It combines a robust Python backend for physics-based synthetic data generation and machine learning with a modern React frontend for real-time interaction.

By modeling complex interactions between vessel characteristics (Container, Bulker, Tanker), voyage parameters, and environmental factors (monsoons, currents, waves), this system provides explainable AI (XAI) insights into fuel usage.

---

## 🎥 Prototype Demo

Watch our system in action!

> **Note:** GitHub READMEs may not auto-play local video files. You can view the prototype using the link below.

[**▶️ Watch Prototype Demo (prototype.mp4)**](./prototype.mp4)

---

## 🏗️ Architecture

The project is divided into two main components:

### 🐍 Backend (`/backend`)

- **Framework**: FastAPI
- **Core Logic**:
  - `data_generator.py`: Generates synthetic data based on Indian Ocean physics/weather.
  - `train_model.py`: Trains a Neural Network (MLPRegressor) and saves artifacts.
  - `explainability.py`: Uses SHAP (Shapley Additive explanations) to explain predictions.
  - `main.py`: Serves predictions via REST API.

### ⚛️ Frontend (`/frontend`)

- **Framework**: React 19 + Vite
- **UI**: Interactive dashboard to input voyage parameters and view fuel predictions with XAI breakdowns.

---

## 🚀 Key Features

- **Synthetic Data Engine**: Physics-aware generation tailored to maritime contexts.
- **Environmental Factors**: Accounts for seasoned monsoons, wave height, and current direction (Head/Following/Beam).
- **Machine Learning**: Neural Network model trained on domain-specific data.
- **Explainable AI**: Breakdowns of *why* fuel consumption increased/decreased (e.g., "High Waves (+2.5 tons)", "Following Current (-1.2 tons)").

---

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js & npm

### 1. Backend Setup

navigate to the project root:

```bash
cd VesselFuel-ML
```

Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

---

## 🚦 Usage Guide

### Step 1: Generate Data & Train Model

Before running the server, verify you have the model artifacts. If not (or to retrain):

```bash
# Generate fresh synthetic data
python backend/data_generator.py

# Train the model (creates .pkl files in backend/)
python backend/train_model.py
```

### Step 2: Start the Backend Server

```bash
python backend/main.py
```

*Server runs at `http://localhost:8000`*

### Step 3: Start the Frontend Interface

In a new terminal:

```bash
cd frontend
npm run dev
```

*App runs at `http://localhost:5173` (typically)*

---

## 📂 Project Structure

```bash
VesselFuel-ML/
├── backend/
│   ├── data_generator.py  # Data creation logic
│   ├── train_model.py     # ML training script
│   ├── explainability.py  # SHAP explanation service
│   ├── main.py            # FastAPI entry point
│   └── ... (.pkl artifacts)
├── frontend/              # Vite React Application
│   ├── src/               # UI Source code
│   └── package.json
├── fuel_consumption_data.csv # Generated dataset
├── prototype.mp4          # Demo video
└── README.md              # Documentation
```

---

*Built with ❤️ for sustainable maritime logistics.*
