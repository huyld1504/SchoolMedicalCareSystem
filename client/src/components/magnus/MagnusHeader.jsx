import React from 'react';

function MagnusHeader() {
  return (
    <header id="home" className="magnus-header" style={{
      position: 'relative',
      padding: '120px 0 100px',
      background: 'linear-gradient(135deg, #0052cc 0%, #00a3e0 100%)',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.05,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}></div>

      <div className="container" style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div className="magnus-header__content" style={{
          flex: '1 1 500px',
          maxWidth: '600px'
        }}>          <h1 className="magnus-header__title" style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: '800',
          marginBottom: '1.5rem',
          lineHeight: '1.2',
          background: 'linear-gradient(to right, #ffffff, #e6f2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
        }}>Quản lý Sức khỏe Học sinh Đơn giản</h1>

          <p className="magnus-header__subtitle" style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            marginBottom: '2rem',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '90%'
          }}>
            Nền tảng toàn diện được tin cậy bởi các trường học trên toàn quốc để quản lý hồ sơ sức khỏe học sinh,
            theo dõi tuân thủ và tối ưu hóa hoạt động trung tâm y tế.
          </p>

          <div className="magnus-header__buttons" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <a href="#contact" className="button button-primary" style={{
              backgroundColor: 'white',
              color: '#0052cc',
              padding: '0.8rem 1.8rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}>
              <span>Yêu cầu Demo</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '8px' }}
                xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a href="#about" className="button button-secondary" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              padding: '0.8rem 1.8rem',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}>Tìm hiểu thêm</a>
          </div>
        </div>

        <div className="magnus-header__image" style={{
          flex: '1 1 400px',
          maxWidth: '500px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1
          }}></div>

          <img src="https://img.freepik.com/free-vector/health-professional-team_52683-36023.jpg"
            alt="Student health management"
            className="magnus-header__img"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.15)',
              transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
              border: '5px solid rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>
      </div>

      {/* Wave separator */}
      <div style={{
        position: 'absolute',
        bottom: -1,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{
          position: 'relative',
          display: 'block',
          width: 'calc(100% + 1.3px)',
          height: '80px',
          fill: '#ffffff'
        }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </header>
  );
}

export default MagnusHeader;