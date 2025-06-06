import React from 'react';
import { Box, AppBar, Toolbar, Button, Container, useScrollTrigger, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
import logoImage from '../../assets/ChatGPT Image 18_26_19 4 thg 6, 2025.png';

// Logo component
const Logo = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1.5rem',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '& span': {
        color: theme.palette.primary.main,
        marginLeft: '4px'
    },
    '& svg': {
        fontSize: '2rem',
        marginRight: '8px'
    }
}));

// Hide AppBar on scroll down
function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const LandingLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header with transparent AppBar */}
            <HideOnScroll>
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>                            {/* Logo */}
                            <Logo>
                                <img src={logoImage} alt="Logo" style={{ width: '100px', height: '100px' }} />
                                <span>MedicalSystemSchool</span>
                            </Logo>

                            {/* Navigation Menu */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="/login"
                                    sx={{
                                        ml: 2,
                                        px: 3,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            {/* Toolbar placeholder to prevent content from hiding under AppBar */}
            <Toolbar />

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
};

export default LandingLayout;
