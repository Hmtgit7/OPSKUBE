import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, state: { isAuthenticated, error }, clearError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get redirect path from location state
    const from = location.state?.from || '/events';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // Clear any previous errors
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsSubmitting(true);

        try {
            await login(values);
            toast.success('Login successful!');
        } catch (error) {
            // Error is handled by the auth context
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="container-custom py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LoginForm
                        onSubmit={handleSubmit}
                        isLoading={isSubmitting}
                        error={error}
                    />
                </motion.div>
            </div>
        </Layout>
    );
};

export default LoginPage;