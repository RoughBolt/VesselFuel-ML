import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    Ship_Type: 'Container',
    DWT: 50000,
    Engine_Power_kW: 20000,
    Design_Speed: 22.0,
    Avg_Speed_Knots: 18.0,
    Distance_NM: 1500,
    Draft_Percentage: 85,
    Wind_Beaufort: 3,
    Wave_Height_m: 1.5,
    Current_Speed_Knots: 0.5,
    Current_Direction: 'Head',
    Season: 'Inter-Monsoon'
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['Ship_Type', 'Current_Direction', 'Season'].includes(name) 
        ? value 
        : parseFloat(value) || value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // In a real app, use env var for URL
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError("Failed to get prediction. Ensure backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // Helper to render SHAP bars
  const renderShapChart = (contributions) => {
    // Sort by absolute impact
    const sorted = Object.entries(contributions)
      .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
      .slice(0, 8) // Top 8 features

    const maxVal = Math.max(...sorted.map(([,v]) => Math.abs(v)))

    return (
      <div className="shap-chart">
        <h3 style={{fontSize: '1.2rem', marginBottom: '1rem'}}>Feature Impact Analysis</h3>
        {sorted.map(([feature, value]) => {
          const widthPct = (Math.abs(value) / maxVal) * 100
          const isPositive = value > 0 // Positive = Increases Fuel (Red)
          
          return (
            <div key={feature} className="chart-row">
              <div className="chart-label">{feature.replace(/_/g, ' ')}</div>
              <div className="chart-bar-container">
                {/* Center line logic or simple bar? Let's do simple magnitude bars with color */}
                <div 
                  className={`chart-bar ${isPositive ? 'bar-positive' : 'bar-negative'}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className="chart-value">
                {value > 0 ? '+' : ''}{value.toFixed(2)}
              </div>
            </div>
          )
        })}
        <div style={{fontSize: '0.8rem', color: 'var(--color-text-dim)', marginTop: '0.5rem', textAlign: 'center'}}>
          <span style={{color: '#ff6b6b'}}>● Increases Fuel</span>
          <span style={{margin: '0 10px'}}>|</span>
          <span style={{color: 'var(--color-teal)'}}>● Decreases Fuel</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <h1>Maritime Fuel XAI Decision Support</h1>
      
      <div className="dashboard-grid">
        
        {/* Input Panel */}
        <div className="glass-panel">
          <h2>Voyage Parameters</h2>
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>Ship Type</label>
              <select name="Ship_Type" value={formData.Ship_Type} onChange={handleChange}>
                <option value="Container">Container Ship</option>
                <option value="Bulker">Bulk Carrier</option>
                <option value="Tanker">Oil Tanker</option>
              </select>
            </div>

            <div className="form-group">
              <label>Season (Indian Ocean)</label>
              <select name="Season" value={formData.Season} onChange={handleChange}>
                <option value="Inter-Monsoon">Inter-Monsoon (Calm)</option>
                <option value="Southwest Monsoon">Southwest Monsoon (Rough)</option>
                <option value="Northeast Monsoon">Northeast Monsoon (Moderate)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Distance (NM)</label>
              <input type="number" name="Distance_NM" value={formData.Distance_NM} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Avg Speed (Knots)</label>
              <input type="range" name="Avg_Speed_Knots" min="10" max="25" step="0.5" value={formData.Avg_Speed_Knots} onChange={handleChange} />
              <div style={{textAlign:'right', fontSize: '0.8rem'}}>{formData.Avg_Speed_Knots} kts</div>
            </div>

            <div className="form-group">
              <label>Draft Loading (%)</label>
              <input type="range" name="Draft_Percentage" min="50" max="100" value={formData.Draft_Percentage} onChange={handleChange} />
              <div style={{textAlign:'right', fontSize: '0.8rem'}}>{formData.Draft_Percentage}%</div>
            </div>

            <div className="form-group">
              <label>Wind (Beaufort Scale)</label>
              <input type="number" name="Wind_Beaufort" min="0" max="12" value={formData.Wind_Beaufort} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Wave Height (m)</label>
              <input type="number" name="Wave_Height_m" min="0" max="15" step="0.1" value={formData.Wave_Height_m} onChange={handleChange} />
            </div>
            
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Estimate Consumption'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{minHeight: '600px'}}>
          {!result && !loading && (
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--color-text-dim)', flexDirection:'column'}}>
               <p>Enter voyage details to generate an AI estimate.</p>
            </div>
          )}
          
          {loading && (
             <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--color-text-dim)'}}>
                <p>Analyzing Voyage Parameters...</p>
             </div>
          )}

          {result && (
            <div className="results-content">
              <h2>Estimation Results</h2>
              
              <div className="result-header">
                 <div>
                   <div style={{fontSize:'0.9rem', color:'var(--color-text-dim)'}}>Predicted Fuel Consumption</div>
                   <div style={{display:'flex', alignItems:'baseline'}}>
                      <span className="fuel-value">{result.predicted_fuel_tons}</span>
                      <span className="fuel-unit">Metric Tons</span>
                   </div>
                 </div>
              </div>

              <div className="explanation-section">
                <h3>AI Logic Explanation</h3>
                <div className="explanation-text">
                  {result.text_explanation.split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--color-teal)">$1</strong>')}} />
                  ))}
                </div>

                {renderShapChart(result.contributions)}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default App
