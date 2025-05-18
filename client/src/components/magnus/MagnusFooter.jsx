import React from 'react'

function MagnusFooter() {
  return (
    <footer className="magnus-footer">
      <div className="container">
        <div className="magnus-footer__logo">
          <h2 style={{ color: 'white' }}>MAGNUS HEALTH</h2>
        </div>
        
        <div className="magnus-footer__links">
          <div className="magnus-footer__column">
            <h4>Solutions</h4>
            <ul>
              <li><a href="#">Student Health Records</a></li>
              <li><a href="#">Athletic Management</a></li>
              <li><a href="#">COVID-19 Screening</a></li>
              <li><a href="#">Immunization Tracking</a></li>
              <li><a href="#">Magnus Mobile</a></li>
            </ul>
          </div>
          
          <div className="magnus-footer__column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Leadership</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">News & Press</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>
          
          <div className="magnus-footer__column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Support Center</a></li>
              <li><a href="#">Training Videos</a></li>
              <li><a href="#">Webinars</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </div>
          
          <div className="magnus-footer__column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">HIPAA Compliance</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
          
          <div className="magnus-footer__column">
            <h4>Contact</h4>
            <ul>
              <li><a href="#">sales@magnushealth.com</a></li>
              <li><a href="#">(800) 123-4567</a></li>
              <li><a href="#">Support Ticket</a></li>
            </ul>
          </div>
        </div>
        
        <div className="magnus-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Magnus Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default MagnusFooter 