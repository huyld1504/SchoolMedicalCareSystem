import React from 'react';
import { Box } from '@mui/material';
import {
    HeroSection,
    StatsSection,
    FeaturesSection,
    TestimonialsSection,
    BlogSection,
    FooterSection
} from '../components/landing';

const LandingPage = () => {
    const handleLoginClick = () => {
        // Có thể thêm logic đăng nhập ở đây nếu cần
        console.log('Login clicked');
    };

    const handleLearnMoreClick = () => {
        // Scroll xuống phần features
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleStartClick = () => {
        // Có thể thêm logic bắt đầu ở đây nếu cần
        console.log('Start clicked');
    };

    const handleContactClick = () => {
        // Có thể thêm logic liên hệ ở đây nếu cần
        console.log('Contact clicked');
    };

    return (
        <Box>
            <HeroSection
                onLoginClick={handleLoginClick}
                onLearnMoreClick={handleLearnMoreClick}
            />
            <StatsSection />            <Box id="features">
                <FeaturesSection />
            </Box>            <Box id="testimonials">
                <TestimonialsSection />
            </Box>
            <Box id="blog">
                <BlogSection />
            </Box>      
                  {/* <Box id="education">
                <HealthEducationSection />
            </Box> */}
            <Box id="contact">
                <FooterSection/>
            </Box>
        </Box>);
};

export default LandingPage;