import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Enter Button Handler
  const enterApp = () => navigate('/scenarios');

  return (
    <div className="landing-container" ref={containerRef} style={{background: '#000', color: '#fff', overflowX: 'hidden'}}>
      
      {/* SECTION 1: HERO - THE VAST OCEAN */}
      <section style={{height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'hidden'}}>
        <div className="bg-image" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundImage: 'url(https://images.unsplash.com/photo-1551000600-4b360b8d783d?q=80&w=2070&auto=format&fit=crop)',
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6,
            filter: 'saturate(0) brightness(0.8)' // Moody cinema look
        }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{zIndex: 10, textAlign: 'center'}}
        >
          <h1 style={{fontSize: '5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem', background: 'linear-gradient(to bottom, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Maritime Intelligence.
          </h1>
          <p style={{fontSize: '1.5rem', color: '#aaa', fontWeight: 400, maxWidth: '600px', margin: '0 auto'}}>
            Navigating the uncertainty of the Indian Ocean.
          </p>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           transition={{ delay: 1.5, duration: 1 }}
           style={{position: 'absolute', bottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
        >
           <span style={{fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px'}}>Scroll to Discover</span>
           <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} >
             <ChevronRight style={{transform: 'rotate(90deg)'}} />
           </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: THE PROBLEM (Text Scroll Reveal) */}
      <section style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505'}}>
         <div style={{maxWidth: '800px', padding: '2rem'}}>
            <ScrollRevealText>
              The ocean is unpredictable.
            </ScrollRevealText>
            <ScrollRevealText delay={0.2}>
              Monsoons disrupt supply chains.
            </ScrollRevealText>
            <ScrollRevealText delay={0.4}>
              Fuel costs consume 60% of OPEX.
            </ScrollRevealText>
            <ScrollRevealText delay={0.6} color="#ef4444">
              Blind decisions cost millions.
            </ScrollRevealText>
         </div>
      </section>

      {/* SECTION 3: THE TECHNOLOGY (Horizontal Parallax / "Chip" moment) */}
      <section style={{height: '120vh', background: '#000', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
         <h2 style={{fontSize: '3rem', fontWeight: 700, marginBottom: '4rem'}}>Powered by Neural Physics.</h2>
         
         <div style={{display: 'flex', gap: '20px', perspective: '1000px'}}>
             <TechCard 
               title="Admiralty Physics" 
               desc="Hull resistance modeling" 
               img="https://images.unsplash.com/photo-1524522173746-f628baad3644?q=80&w=2131&auto=format&fit=crop"
               delay={0}
             />
             <TechCard 
               title="Deep Learning" 
               desc="Non-linear regression" 
               img="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop" 
               delay={0.2}
             />
             <TechCard 
               title="SHAP Explainability" 
               desc="Transparent decisioning" 
               img="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
               delay={0.4}
             />
         </div>
      </section>

      {/* SECTION 4: INTERACTIVE DEMO CTA */}
      <section style={{height: '80vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
         <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1498328178652-5af2df16ce7e?q=80&w=2069&auto=format&fit=crop)',
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4
         }} />
         
         <div style={{zIndex: 10, textAlign: 'center', background: 'rgba(0,0,0,0.6)', padding: '3rem', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)'}}>
            <h2 style={{fontSize: '4rem', fontWeight: 800, marginBottom: '1rem'}}>Ready for Command?</h2>
            <p style={{fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem'}}>
              Access the decision support system. Calibrated for the Indian Ocean.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={enterApp}
              style={{
                background: '#3b82f6', color: '#fff', border: 'none', padding: '1rem 3rem', 
                fontSize: '1.2rem', borderRadius: '50px', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
              }}
            >
               Launch Dashboard
            </motion.button>
         </div>
      </section>

    </div>
  );
};

// Helper Components
const ScrollRevealText = ({ children, delay = 0, color = "#fff" }) => {
  return (
    <motion.h3 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      style={{fontSize: '4rem', fontWeight: 700, margin: 0, color: color, lineHeight: 1.1}}
    >
      {children}
    </motion.h3>
  )
}

const TechCard = ({ title, desc, img, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, rotateY: 30 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay }}
      style={{
        width: '300px', height: '400px', borderRadius: '20px', overflow: 'hidden', 
        position: 'relative', border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
       <div style={{width: '100%', height: '100%', backgroundImage: `url(${img})`, backgroundSize: 'cover'}} />
       <div style={{
         position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem', 
         background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', boxSizing: 'border-box'
       }}>
          <h4 style={{fontSize: '1.5rem', margin: 0}}>{title}</h4>
          <p style={{color: '#aaa', margin: '0.5rem 0 0'}}>{desc}</p>
       </div>
    </motion.div>
  )
}

export default Landing;
