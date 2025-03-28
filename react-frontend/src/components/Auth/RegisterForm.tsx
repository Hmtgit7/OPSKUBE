import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material';
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import Person from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";;
import { RegisterCredentials } from '../../types';
import { motion } from 'framer-motion';

interface RegisterFormProps {
    onSubmit: (values: RegisterCredentials) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    isSubmitting,
    error,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // Toggle password visibility
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Form validation schema
    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be at most 30 characters')
            .matches(
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores'
            ),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
    });

    // Initialize formik
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            await onSubmit(values);
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Paper className="bg-white dark:bg-gray-800 shadow-md p-6 max-w-md mx-auto">
                <Typography
                    variant="h5"
                    component="h1"
                    className="text-gray-900 dark:text-white mb-6 font-bold text-center"
                >
                    Create an Account
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <form onSubmit={formik.handleSubmit}>
                    <Box className="space-y-4">
                        <TextField
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            variant="outlined"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            disabled={isSubmitting}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person className="text-gray-500 dark:text-gray-300" />
                                    </InputAdornment>
                                ),
                                className: "text-gray-900 dark:text-white"
                            }}
                            InputLabelProps={{
                                className: "text-gray-600 dark:text-gray-300"
                            }}
                        />

                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={isSubmitting}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email className="text-gray-500 dark:text-gray-300" />
                                    </InputAdornment>
                                ),
                                className: "text-gray-900 dark:text-white"
                            }}
                            InputLabelProps={{
                                className: "text-gray-600 dark:text-gray-300"
                            }}
                        />

                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            disabled={isSubmitting}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock className="text-gray-500 dark:text-gray-300" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                className: "text-gray-900 dark:text-white"
                            }}
                            InputLabelProps={{
                                className: "text-gray-600 dark:text-gray-300"
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            className="bg-primary-main hover:bg-primary-dark text-white py-3 mt-2"
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Register'}
                        </Button>
                    </Box>
                </form>

                <Box className="mt-6 text-center">
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                        Already have an account?{' '}
                        <Link
                            component={RouterLink}
                            to="/login"
                            className="text-primary-main hover:text-primary-dark dark:hover:text-primary-light font-medium"
                        >
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default RegisterForm;