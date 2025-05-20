import React from 'react'
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
            <MagnusHeader />
            <MagnusAbout />
            <MagnusFeatures />
            <MagnusDoctors />
            <MagnusTestimonials />
            <MagnusContact />
        </div>)
}

export default MagnusHealth