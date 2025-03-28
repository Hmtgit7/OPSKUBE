import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, state: { isAuthenticated, error }, clearError } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/events');
        }
    }, [isAuthenticated, navigate]);

    // Clear any previous errors
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Handle form submission
    const handleSubmit = async (values) => {
        setIsSubmitting(true);

        try {
            await register(values);
            toast.success('Account created successfully!');
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
                    <RegisterForm
                        onSubmit={handleSubmit}
                        isLoading={isSubmitting}
                        error={error}
                    />
                </motion.div>
            </div>
        </Layout>
    );
};

export default RegisterPage;