import React from 'react'

function MagnusDoctors() {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Michael Nguyen',
      specialty: 'Pediatrician',
      bio: 'Dr. Michael has over 15 years of experience in pediatrics and school health.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      socials: ['facebook', 'twitter', 'linkedin']
    },
    {
      id: 2,
      name: 'Dr. Hannah Tran',
      specialty: 'Internal Medicine',
      bio: 'Dr. Hannah specializes in general health issues and nutrition counseling for students.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      socials: ['facebook', 'instagram', 'linkedin']
    },
    {
      id: 3,
      name: 'Dr. Thomas Pham',
      specialty: 'Psychologist',
      bio: 'Dr. Thomas is a school psychology expert, supporting students with psychological issues and development.',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      socials: ['facebook', 'twitter', 'instagram']
    }
  ]

  const socialIcons = {
    facebook: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61175 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    instagram: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.9079 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80977 15.3801 9.21485 14.7852C8.61993 14.1902 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8.00003C13.4789 8.12644 14.2649 8.52152 14.8717 9.12836C15.4785 9.73521 15.8736 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  }

  return (
    <section id="doctors" className="magnus-doctors" style={{
      padding: '100px 0',
      backgroundColor: '#f7fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.4,
        backgroundImage: 'radial-gradient(#0052cc 1px, transparent 1px)',
        backgroundSize: '30px 30px',
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
          }}>OUR TEAM</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem'
          }}>Our Medical Team</h2>
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
          }}>Dedicated medical professionals on our team</p>
        </div>
        
        <div className="doctors-list" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2.5rem',
          marginTop: '2rem'
        }}>
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card" style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              height: '100%'
            }}>
              <div className="doctor-image-container" style={{
                position: 'relative',
                height: '300px',
                overflow: 'hidden'
              }}>
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                />
                {/* Overlay with gradient */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                  zIndex: 1
                }}></div>
                
                {/* Social icons */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  display: 'flex',
                  gap: '12px',
                  zIndex: 2
                }}>
                  {doctor.socials.map((social, idx) => (
                    <a 
                      key={idx} 
                      href="#" 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0052cc',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {socialIcons[social]}
                    </a>
                  ))}
                </div>
              </div>
              
              <div style={{
                padding: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  color: '#1a202c',
                  marginBottom: '0.5rem'
                }}>{doctor.name}</h3>
                <p style={{ 
                  fontWeight: '600', 
                  color: '#0052cc',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#e6f0ff',
                  borderRadius: '4px'
                }}>{doctor.specialty}</p>
                <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{doctor.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MagnusDoctors 