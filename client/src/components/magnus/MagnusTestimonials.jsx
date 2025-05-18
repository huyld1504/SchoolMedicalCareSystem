import React from 'react'

function MagnusTestimonials() {
  const testimonials = [
    {
      id: 1,
      content: "Magnus Health has transformed how our school manages student health records. The transition from paper to digital was seamless, and we've saved countless hours on administrative tasks.",
      name: "Sarah Johnson",
      role: "School Nurse, Lakeside Academy",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      content: "The compliance tracking features alone are worth the investment. We went from 70% to 98% immunization compliance in our first semester using Magnus Health.",
      name: "Michael Chen",
      role: "Health Services Director, Westfield Prep",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      id: 3,
      content: "Parents love the user-friendly interface, and our staff appreciates having all student health information readily accessible. Customer support has been exceptional.",
      name: "Jennifer Patel",
      role: "Dean of Students, Riverside School",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg"
    }
  ]

  return (
    <section id="testimonials" className="magnus-testimonials" style={{
      padding: '100px 0',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, rgba(0, 82, 204, 0.03), rgba(0, 163, 224, 0.03))',
        top: '-250px',
        right: '-250px',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, rgba(0, 82, 204, 0.03), rgba(0, 163, 224, 0.03))',
        bottom: '-150px',
        left: '-150px',
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
          }}>TESTIMONIALS</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem'
          }}>Trusted by Schools Nationwide</h2>
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
          }}>See what education professionals have to say about Magnus Health</p>
        </div>
        
        <div className="testimonials-grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem'
        }}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="testimonial-card"
              style={{ 
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Quote mark */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                fontSize: '5rem',
                color: 'rgba(0, 82, 204, 0.07)',
                fontFamily: 'Georgia, serif',
                lineHeight: '1',
                zIndex: 1
              }}>
                "
              </div>
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Star rating */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                
                <p style={{
                  fontSize: '1.05rem',
                  color: '#4a5568',
                  lineHeight: '1.7',
                  marginBottom: '2rem',
                  fontStyle: 'italic'
                }}>"{testimonial.content}"</p>
              </div>
              
              <div className="testimonial-card__author" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: 'auto'
              }}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e6f0ff'
                  }}
                />
                <div>
                  <h4 style={{
                    margin: 0,
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>{testimonial.name}</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#718096'
                  }}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA button */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <a href="#contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: '#0052cc',
            color: 'white',
            padding: '0.9rem 2rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            boxShadow: '0 10px 20px rgba(0, 82, 204, 0.2)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }}>
            <span>Start Free Trial</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default MagnusTestimonials 