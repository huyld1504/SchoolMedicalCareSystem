import React from 'react'

function MagnusFeatures() {
  const features = [
    {
      id: 1,
      icon: '📋',
      title: 'Health Record Management',
      description: 'Securely store and manage student health records, immunizations, and medical history all in one place.',
      color: '#4299e1'
    },
    {
      id: 2,
      icon: '📱',
      title: 'Mobile-Friendly Forms',
      description: 'Collect health information with customizable forms that parents can complete from any device.',
      color: '#38b2ac'
    },
    {
      id: 3,
      icon: '🔔',
      title: 'Compliance Tracking',
      description: 'Automatically track immunization compliance and send reminders for missing requirements.',
      color: '#805ad5'
    },
    {
      id: 4,
      icon: '📊',
      title: 'Reporting & Analytics',
      description: 'Generate detailed reports on student health metrics, compliance rates, and visit trends.',
      color: '#ed8936'
    }
  ]

  return (
    <section id="services" className="magnus-features" style={{
      padding: '100px 0',
      backgroundColor: '#f7fafc',
      position: 'relative'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, rgba(66, 153, 225, 0.1), rgba(56, 178, 172, 0.1))',
        top: '50px',
        left: '-150px',
        filter: 'blur(40px)',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, rgba(128, 90, 213, 0.1), rgba(237, 137, 54, 0.1))',
        bottom: '50px',
        right: '-100px',
        filter: 'blur(40px)',
        zIndex: 1
      }}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header text-center" style={{ marginBottom: '60px' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#0052cc',
            backgroundColor: '#e6f0ff',
            marginBottom: '1rem',
            letterSpacing: '0.5px'
          }}>OUR SERVICES</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem'
          }}>Powerful Features for School Health Management</h2>
          <div style={{
            width: '70px',
            height: '4px',
            backgroundColor: '#0052cc',
            margin: '0 auto 1.5rem',
            borderRadius: '4px'
          }}></div>
          <p style={{
            fontSize: '1.1rem',
            color: '#4a5568',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>Everything you need to effectively manage student health in one intuitive platform.</p>
        </div>
        
        <div className="features-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className="feature-card"
              style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}30)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                fontSize: '2rem'
              }}>
                <span>{feature.icon}</span>
              </div>
              
              <h3 style={{
                fontSize: '1.35rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '1rem'
              }}>{feature.title}</h3>
              
              <p style={{
                fontSize: '1rem',
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>{feature.description}</p>
              
              <div style={{ marginTop: 'auto' }}>
                <a href="#contact" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#0052cc',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <span>Learn more</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '6px', transition: 'transform 0.3s ease' }} xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MagnusFeatures 