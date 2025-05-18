import React from 'react'
import MagnusNavbar from './MagnusNavbar'
import MagnusHeader from './MagnusHeader'
import MagnusAbout from './MagnusAbout'
import MagnusFeatures from './MagnusFeatures'
import MagnusDoctors from './MagnusDoctors'
import MagnusTestimonials from './MagnusTestimonials'
import MagnusContact from './MagnusContact'
import MagnusFooter from './MagnusFooter'

function MagnusHealth() {
    return (
        <div className="magnus-health">
            <MagnusNavbar />
            <MagnusHeader />
            <MagnusAbout />
            <MagnusFeatures />
            <MagnusDoctors />
            <MagnusTestimonials />
            <MagnusContact />
            <MagnusFooter />
        </div>
    )
}

export default MagnusHealth