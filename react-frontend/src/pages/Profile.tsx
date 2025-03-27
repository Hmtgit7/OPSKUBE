import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Button,
    Avatar,
    Grid
} from '@mui/material';
import {
    Person,
    Email,
    CalendarMonth,
    Logout
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, user }, logout } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper className="bg-white dark:bg-gray-800 shadow-md p-6 mb-6">
                        <Box className="flex flex-col md:flex-row items-center mb-6">
                            <Avatar
                                className="w-24 h-24 text-3xl bg-primary-main mb-4 md:mb-0 md:mr-6"
                                alt={user.username}
                            >
                                {user.username?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left"
                                >
                                    {user.username}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="text-gray-600 dark:text-gray-300 text-center md:text-left"
                                >
                                    Account Profile
                                </Typography>
                            </Box>
                        </Box>

                        <Divider className="my-6 dark:border-gray-700" />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="h6"
                                    className="text-gray-900 dark:text-white font-medium mb-4"
                                >
                                    Account Information
                                </Typography>

                                <Box className="space-y-3">
                                    <Box className="flex items-start">
                                        <Person className="text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                                        <Box>
                                            <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                                                Username
                                            </Typography>
                                            <Typography variant="body1" className="text-gray-900 dark:text-white">
                                                {user.username}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box className="flex items-start">
                                        <Email className="text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                                        <Box>
                                            <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1" className="text-gray-900 dark:text-white">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box className="flex items-start">
                                        <CalendarMonth className="text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                                        <Box>
                                            <Typography variant="body2" className="text-gray-500 dark:text-gray-400">
                                                Member Since
                                            </Typography>
                                            <Typography variant="body1" className="text-gray-900 dark:text-white">
                                                {user.createdAt
                                                    ? format(new Date(user.createdAt), 'MMMM dd, yyyy')
                                                    : 'Unknown'
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="h6"
                                    className="text-gray-900 dark:text-white font-medium mb-4"
                                >
                                    Account Actions
                                </Typography>

                                <Box className="space-y-4">
                                    <Button
                                        variant="outlined"
                                        className="w-full border-primary-main text-primary-main hover:bg-primary-main hover:text-white"
                                        onClick={() => navigate('/my-events')}
                                    >
                                        Manage My Events
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        className="w-full"
                                        startIcon={<Logout />}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>
            </Container>
        </Layout>
    );
};

export default Profile;