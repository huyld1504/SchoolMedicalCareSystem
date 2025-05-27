import React from 'react';

function MagnusAbout() {
  return (
    <section id="about" className="magnus-about" style={{
      padding: '100px 0',
      backgroundColor: '#ffffff',
      position: 'relative'
    }}>
      <div className="container" style={{ position: 'relative' }}>
        <div className="section-header text-center" style={{ marginBottom: '60px' }}>          <span style={{
          display: 'inline-block',
          padding: '0.35rem 1rem',
          borderRadius: '50px',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#0052cc',
          backgroundColor: '#e6f0ff',
          marginBottom: '1rem',
          letterSpacing: '0.5px'
        }}>VỀ CHÚNG TÔI</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem',
            position: 'relative'
          }}>Về Magnus Health</h2>
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
          }}>Hệ thống quản lý sức khỏe học sinh toàn diện cho các trường học</p>
        </div>

        <div className="about-content" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <img
                  src="https://img.freepik.com/free-vector/online-doctor-concept_52683-37472.jpg"
                  alt="Magnus Health Platform"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            <div style={{ flex: '1 1 400px' }}>              <h3 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#0052cc',
              marginBottom: '1.5rem'
            }}>Nền tảng hiện đại cho sức khỏe học đường</h3>

              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#4a5568',
                marginBottom: '1.5rem'
              }}>
                Magnus Health là nền tảng quản lý sức khỏe học sinh toàn diện
                giúp các trường học hiện đại hóa quy trình quản lý hồ sơ sức khỏe,
                theo dõi tuân thủ và quản lý trung tâm y tế.
              </p>

              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#4a5568',
                marginBottom: '2rem'
              }}>
                Với hơn 10 năm kinh nghiệm, chúng tôi đã phục vụ hàng nghìn trường học
                trên toàn quốc, giúp cải thiện hiệu quả quản lý và chăm sóc sức khỏe học sinh.
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    minWidth: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#e6f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#0052cc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>                  <span style={{ fontSize: '1.05rem', color: '#4a5568' }}>Bảo mật dữ liệu</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    minWidth: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#e6f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#0052cc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '1.05rem', color: '#4a5568' }}>Dễ sử dụng</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    minWidth: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#e6f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#0052cc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '1.05rem', color: '#4a5568' }}>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-stats" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
            marginTop: '2rem'
          }}>            {[
            { number: '2,500+', label: 'Trường học sử dụng', icon: '🏫' },
            { number: '1.5M+', label: 'Hồ sơ học sinh', icon: '📋' },
            { number: '98%', label: 'Tỷ lệ hài lòng', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2.5rem 2rem',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 82, 204, 0.08)',
              flex: '1 1 250px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(0, 82, 204, 0.1)',
              maxWidth: '300px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '0.75rem'
              }}>
                {stat.icon}
              </div>
              <h3 style={{
                color: '#0052cc',
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem'
              }}>{stat.number}</h3>
              <p style={{
                color: '#4a5568',
                fontWeight: '500',
                fontSize: '1.1rem'
              }}>{stat.label}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MagnusAbout; 