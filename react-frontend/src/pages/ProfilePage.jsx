import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CalendarIcon,
    UserCircleIcon,
    MailIcon,
    ClockIcon,
    LogoutIcon
} from '@heroicons/react/outline';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { state: { isAuthenticated, user }, logout } = useAuth();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            toast.info('Please log in to view your profile');
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [isAuthenticated, navigate]);

    // Handle logout
    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <div className="container-custom py-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Profile</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                                    <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-4xl font-medium text-primary-600 dark:text-primary-400">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
                                        <p className="text-gray-600 dark:text-gray-400 flex items-center">
                                            <MailIcon className="w-5 h-5 mr-2" />
                                            {user.email}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                                            <ClockIcon className="w-5 h-5 mr-2" />
                                            Member since {formatDate(user.createdAt, 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-dark-600 pt-8">
                                    <h3 className="text-xl font-bold mb-4">Account Actions</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Link
                                            to="/my-events"
                                            className="btn-primary flex items-center justify-center"
                                        >
                                            <CalendarIcon className="w-5 h-5 mr-2" />
                                            Manage Events
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="btn-danger flex items-center justify-center"
                                        >
                                            <LogoutIcon className="w-5 h-5 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="card p-6 mb-6">
                                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/events/new"
                                        className="block w-full btn-outline text-center"
                                    >
                                        Create New Event
                                    </Link>
                                    <Link
                                        to="/my-events"
                                        className="block w-full btn-outline text-center"
                                    >
                                        My Events
                                    </Link>
                                    <Link
                                        to="/events"
                                        className="block w-full btn-outline text-center"
                                    >
                                        Browse Events
                                    </Link>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="text-xl font-bold mb-4">Account Info</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Username</p>
                                        <p className="font-medium">{user.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Created</p>
                                        <p className="font-medium">{formatDate(user.createdAt, 'MMMM dd, yyyy')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;