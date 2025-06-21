import React from 'react';
import {
    Box,
    Container,
    useTheme,
    useMediaQuery,
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon
} from '@mui/material';
import {
    Add as AddIcon,
    PersonAdd,
    MedicalServices,
    Notifications,
    Close as CloseIcon
} from '@mui/icons-material';

const ResponsiveLayout = ({
    children,
    onAddChild,
    onCreateMedicalOrder,
    showFab = true
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

    const actions = [
        {
            icon: <PersonAdd />,
            name: 'Thêm con em',
            onClick: onAddChild
        },
        {
            icon: <MedicalServices />,
            name: 'Tạo đơn thuốc',
            onClick: onCreateMedicalOrder
        },
    ];

    const handleSpeedDialOpen = () => setSpeedDialOpen(true);
    const handleSpeedDialClose = () => setSpeedDialOpen(false); return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                width: '100vw',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                    margin: 0
                }}
            >
                {children}
            </Box>

            {/* Floating Action Button for Mobile */}
            {showFab && isMobile && (
                <SpeedDial
                    ariaLabel="Quick Actions"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: theme.zIndex.speedDial
                    }}
                    icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<CloseIcon />} />}
                    onClose={handleSpeedDialClose}
                    onOpen={handleSpeedDialOpen}
                    open={speedDialOpen}
                    direction="up"
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={() => {
                                action.onClick?.();
                                handleSpeedDialClose();
                            }}
                            sx={{
                                '& .MuiSpeedDialAction-fab': {
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    }
                                }
                            }}
                        />
                    ))}
                </SpeedDial>
            )}
        </Box>
    );
};

export default ResponsiveLayout;
