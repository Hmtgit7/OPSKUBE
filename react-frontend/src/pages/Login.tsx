import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import ArrowBack from "@mui/icons-material/ArrowBack";;
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/Auth/LoginForm';
import { LoginCredentials } from '../types';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, isLoading, error }, login, clearError } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/events');
        }

        // Clear any previous authentication errors
        clearError();
    }, [isAuthenticated, navigate, clearError]);

    // Handle login form submission
    const handleLogin = async (credentials: LoginCredentials) => {
        await login(credentials);
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Box className="mb-6">
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBack />}
                        className="text-primary-main mb-4"
                    >
                        Back to Home
                    </Button>

                    <LoginForm
                        onSubmit={handleLogin}
                        isSubmitting={isLoading}
                        error={error}
                    />

                    <Box className="mt-8 text-center">
                        <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                            By logging in, you agree to our{' '}
                            <Link to="/terms" className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light">
                                Privacy Policy
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};

export default Login;