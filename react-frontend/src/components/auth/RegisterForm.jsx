import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import {
    EyeIcon,
    EyeOffIcon,
    MailIcon,
    LockClosedIcon,
    UserIcon
} from '@heroicons/react/outline';
import { registerValidationSchema } from '../../utils/validationUtils';

const RegisterForm = ({ onSubmit, isLoading, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Initial form values
    const initialValues = {
        username: '',
        email: '',
        password: ''
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="card p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">Create Your Account</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Join our community and start managing events
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={registerValidationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, touched, errors }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="username" className="label">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="johndoe"
                                        className={`input pl-10 ${touched.username && errors.username ? 'input-error' : ''
                                            }`}
                                    />
                                </div>
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="error-text"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        className={`input pl-10 ${touched.email && errors.email ? 'input-error' : ''
                                            }`}
                                    />
                                </div>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="error-text"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="label">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className={`input pl-10 ${touched.password && errors.password ? 'input-error' : ''
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="error-text"
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Must be at least 6 characters long
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full flex justify-center"
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting || isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default RegisterForm;