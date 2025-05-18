import React, { useState, useEffect } from 'react'

function MagnusContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    role: '',
    message: ''
  })
  
  const [formSuccess, setFormSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formFocus, setFormFocus] = useState(null)

  useEffect(() => {
    // Make visible immediately instead of waiting for scroll
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.classList.add('visible')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleFocus = (field) => {
    setFormFocus(field)
  }

  const handleBlur = () => {
    setFormFocus(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      setFormSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormSuccess(false)
        setFormData({
          name: '',
          email: '',
          school: '',
          role: '',
          message: ''
        })
      }, 5000)
    }, 1500)
  }

  return (
    <section id="contact" className="contact-section" style={{
      padding: '120px 0 140px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%)',
      opacity: 1, // Set to visible by default
      transform: 'none', // Remove initial transform
      transition: 'opacity 0.8s ease, transform 0.8s ease'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(0, 82, 204, 0.05) 0%, rgba(0, 82, 204, 0) 70%)',
        borderRadius: '50%',
        transform: 'translate(20%, -30%)',
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(0, 82, 204, 0.04) 0%, rgba(0, 82, 204, 0) 70%)',
        borderRadius: '50%',
        transform: 'translate(-30%, 30%)',
        zIndex: 1
      }}></div>
      
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(rgba(0, 82, 204, 0.03) 2px, transparent 2px)',
        backgroundSize: '30px 30px',
        zIndex: 1
      }}></div>
      
      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div className="section-header text-center" style={{ 
          marginBottom: '60px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-block',
            position: 'relative',
            marginBottom: '1.5rem',
            zIndex: 3
          }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: '50px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#0052cc',
              backgroundColor: '#e6f0ff',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 10px rgba(0, 82, 204, 0.08)'
            }}>CONTACT US</span>
            <div style={{
              position: 'absolute',
              width: '105%',
              height: '100%',
              left: '-2.5%',
              top: 0,
              background: 'linear-gradient(90deg, rgba(0, 82, 204, 0) 0%, rgba(0, 82, 204, 0.1) 50%, rgba(0, 82, 204, 0) 100%)',
              borderRadius: '50px',
              filter: 'blur(8px)',
              zIndex: -1
            }}></div>
          </div>
          
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem',
            position: 'relative',
            display: 'inline-block'
          }}>
            Ready to Transform Your School's Health Management?
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, rgba(0, 82, 204, 0) 0%, rgba(0, 82, 204, 1) 50%, rgba(0, 82, 204, 0) 100%)',
              borderRadius: '4px'
            }}></div>
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#4a5568',
            maxWidth: '700px',
            margin: '1.5rem auto 0',
            lineHeight: '1.7'
          }}>Request a demo today and see how Magnus Health can benefit your school</p>
        </div>
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 15px 50px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10
        }}>
          {formSuccess ? (
            <div style={{
              padding: '5rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(0, 82, 204, 0.05) 0%, rgba(0, 82, 204, 0) 70%)',
                borderRadius: '50%',
                zIndex: -1
              }}></div>
              
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ebf5ff 0%, #e6f0ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(0, 82, 204, 0.1)',
                animation: 'pulse 2s infinite'
              }}>
                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3746C6.51168 20.6274 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="#0052cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="#0052cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '-10%',
                  left: '-10%',
                  right: '-10%',
                  bottom: '-10%',
                  border: '1px solid rgba(0, 82, 204, 0.1)',
                  borderRadius: '50%',
                  animation: 'ripple 2s infinite ease-in-out'
                }}></div>
              </div>
              
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '1rem'
              }}>Thank You!</h3>
              
              <p style={{
                fontSize: '1.1rem',
                color: '#4a5568',
                maxWidth: '500px',
                margin: '0 auto 2rem',
                lineHeight: '1.7'
              }}>Your request has been received. A representative will contact you shortly.</p>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '1rem',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {['#0052cc', '#3b82f6', '#00a3e0'].map((color, index) => (
                  <div key={index} style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    opacity: 0.8,
                    animation: `fadeInOut 1.5s infinite ${index * 0.2}s`
                  }}></div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ 
              padding: '3.5rem 3rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '3px',
                background: 'linear-gradient(90deg, rgba(0, 82, 204, 0) 0%, rgba(0, 82, 204, 0.3) 50%, rgba(0, 82, 204, 0) 100%)',
                borderRadius: '4px'
              }}></div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                gap: '1.8rem',
                marginBottom: '1.8rem'
              }}>
                <div style={{
                  transition: 'transform 0.3s ease',
                  transform: formFocus === 'name' ? 'translateY(-5px)' : 'none'
                }}>
                  <label htmlFor="name" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: '#1a202c'
                  }}>
                    <span>Full Name</span>
                    <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>
                  </label>
                  <div style={{
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: formFocus === 'name' ? '#0052cc' : '#a0aec0',
                      transition: 'color 0.3s ease'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem 0.9rem 2.5rem',
                        border: `1px solid ${formFocus === 'name' ? '#0052cc' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxShadow: formFocus === 'name' ? '0 0 0 3px rgba(0, 82, 204, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{
                  transition: 'transform 0.3s ease',
                  transform: formFocus === 'email' ? 'translateY(-5px)' : 'none'
                }}>
                  <label htmlFor="email" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: '#1a202c'
                  }}>
                    <span>Email Address</span>
                    <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>
                  </label>
                  <div style={{
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: formFocus === 'email' ? '#0052cc' : '#a0aec0',
                      transition: 'color 0.3s ease'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      placeholder="Enter your email address"
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem 0.9rem 2.5rem',
                        border: `1px solid ${formFocus === 'email' ? '#0052cc' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxShadow: formFocus === 'email' ? '0 0 0 3px rgba(0, 82, 204, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
                gap: '1.8rem',
                marginBottom: '1.8rem'
              }}>
                <div style={{
                  transition: 'transform 0.3s ease',
                  transform: formFocus === 'school' ? 'translateY(-5px)' : 'none'
                }}>
                  <label htmlFor="school" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: '#1a202c'
                  }}>
                    <span>School Name</span>
                    <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>
                  </label>
                  <div style={{
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: formFocus === 'school' ? '#0052cc' : '#a0aec0',
                      transition: 'color 0.3s ease'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2L2 10V22H22V10L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      onFocus={() => handleFocus('school')}
                      onBlur={handleBlur}
                      placeholder="Enter your school's name"
                      required
                      style={{
                        width: '100%',
                        padding: '0.9rem 1rem 0.9rem 2.5rem',
                        border: `1px solid ${formFocus === 'school' ? '#0052cc' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        boxShadow: formFocus === 'school' ? '0 0 0 3px rgba(0, 82, 204, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{
                  transition: 'transform 0.3s ease',
                  transform: formFocus === 'role' ? 'translateY(-5px)' : 'none'
                }}>
                  <label htmlFor="role" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: '#1a202c'
                  }}>
                    <span>Your Role</span>
                    <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>
                  </label>
                  <div style={{
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: formFocus === 'role' ? '#0052cc' : '#a0aec0',
                      transition: 'color 0.3s ease',
                      zIndex: 5
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.09 9.00008C9.3251 8.33175 9.78915 7.76819 10.4 7.40921C11.0108 7.05024 11.7289 6.91902 12.4272 7.03879C13.1255 7.15857 13.7588 7.52161 14.2151 8.06361C14.6713 8.60561 14.9211 9.2916 14.92 10.0001C14.92 12.0001 11.92 13.0001 11.92 13.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{
                      position: 'relative'
                    }}>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        onFocus={() => handleFocus('role')}
                        onBlur={handleBlur}
                        required
                        style={{
                          width: '100%',
                          padding: '0.9rem 1rem 0.9rem 2.5rem',
                          border: `1px solid ${formFocus === 'role' ? '#0052cc' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          boxShadow: formFocus === 'role' ? '0 0 0 3px rgba(0, 82, 204, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                          appearance: 'none',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="" disabled>Select your role</option>
                        <option value="Administrator">School Administrator</option>
                        <option value="Nurse">School Nurse</option>
                        <option value="Athletic Director">Athletic Director</option>
                        <option value="IT Staff">IT Staff</option>
                        <option value="Other">Other</option>
                      </select>
                      <div style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#a0aec0'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                marginBottom: '2.2rem',
                transition: 'transform 0.3s ease',
                transform: formFocus === 'message' ? 'translateY(-5px)' : 'none'
              }}>
                <label htmlFor="message" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  color: '#1a202c'
                }}>
                  <span>Message</span>
                  <span style={{ color: '#a0aec0', marginLeft: '3px', fontWeight: 'normal' }}>(Optional)</span>
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '16px',
                    color: formFocus === 'message' ? '#0052cc' : '#a0aec0',
                    transition: 'color 0.3s ease'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    placeholder="Tell us about your needs and requirements"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem 0.9rem 2.5rem',
                      border: `1px solid ${formFocus === 'message' ? '#0052cc' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      boxShadow: formFocus === 'message' ? '0 0 0 3px rgba(0, 82, 204, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                      resize: 'vertical',
                      minHeight: '120px'
                    }}
                  ></textarea>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: '#718096',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Your information will be handled according to our <a href="#" style={{ color: '#0052cc', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
                </p>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    padding: '0.95rem 2.2rem',
                    background: 'linear-gradient(135deg, #0052cc 0%, #0065ff 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 8px 20px rgba(0, 82, 204, 0.2)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transform: 'translateX(-100%)',
                    animation: isSubmitting ? 'none' : 'shimmer 1.5s infinite'
                  }}></div>
                  
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Demo</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .contact-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  )
}

export default MagnusContact 