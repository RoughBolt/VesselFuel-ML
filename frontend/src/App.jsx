import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Info, Anchor, Compass } from 'lucide-react';
import Landing from './Landing';
import ScenarioSelect from './ScenarioSelect';
import DetailedInput from './DetailedInput';
import Review from './Review';
import Loading from './Loading';
import Result from './Result';
import About from './About';

// Layout logic
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isFullScreen = ['/', '/scenarios', '/calculating'].includes(location.pathname);

  if (isFullScreen) {
    return <div style={{width: '100%'}}>{children}</div>;
  }

  return (
    <div style={{display: 'flex', minHeight: '100vh', width: '100%'}}>
      {/* SIDEBAR NAVIGATION - For app pages */}
      <div className="sidebar">
          <div className="logo-area">
            <Anchor color="#3b82f6" size={28} />
            <span>Maritime<span style={{color:'#3b82f6'}}>AI</span></span>
          </div>

          <nav>
            <NavLink to="/scenarios" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Compass size={20} />
              <span>New Voyage</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Info size={20} />
              <span>System & Methodology</span>
            </NavLink>
          </nav>

          <div style={{marginTop: 'auto', fontSize: '0.75rem', color: 'var(--col-text-muted)'}}>
            <p>Decision Support System<br/>v2.0 (Step Flow)</p>
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="main-content" style={{padding: 0}}>
        {children}
      </div>
    </div>
  );
};

// Force redirect to Home on initial load (start fresh)
const RedirectToHome = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    
    React.useEffect(() => {
        // Runs once on mount
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
        }
    }, []); 
    
    return null;
};

function App() {
  return (
    <Router>
      <RedirectToHome />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scenarios" element={<ScenarioSelect />} />
          <Route path="/mission-control" element={<DetailedInput />} />
          <Route path="/review" element={<Review />} />
          <Route path="/calculating" element={<Loading />} />
          <Route path="/result" element={<Result />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
