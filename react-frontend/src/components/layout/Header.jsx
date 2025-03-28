import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    MenuIcon,
    XIcon,
    UserCircleIcon,
    CalendarIcon,
    PlusCircleIcon,
    MoonIcon,
    SunIcon,
    LogoutIcon
} from '@heroicons/react/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { state: { isAuthenticated, user }, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Handle scroll event to change header style
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu when location changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Navigation items
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        ...(isAuthenticated ? [
            { name: 'My Events', path: '/my-events' },
            { name: 'Create Event', path: '/events/new' }
        ] : [])
    ];

    // Handle logout
    const handleLogout = () => {
        setUserMenuOpen(false);
        logout();
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
                }`}
        >
            <div className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-serif"
                    >
                        <CalendarIcon className="w-8 h-8" />
                        <span className="text-2xl font-bold">EventHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors ${location.pathname === item.path ? 'text-primary-600 dark:text-primary-400' : ''
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side - auth buttons or user menu */}
                    <div className="flex items-center gap-4">
                        {/* Theme toggle button */}
                        <button
                            className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 rounded-full transition-colors"
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="w-6 h-6" />
                            ) : (
                                <MoonIcon className="w-6 h-6" />
                            )}
                        </button>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <span className="hidden lg:block font-medium">{user?.username}</span>
                                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </button>

                                {/* User dropdown menu */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden z-20"
                                        >
                                            <div className="py-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <UserCircleIcon className="w-5 h-5" />
                                                    <span>Profile</span>
                                                </Link>
                                                <Link
                                                    to="/my-events"
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <CalendarIcon className="w-5 h-5" />
                                                    <span>My Events</span>
                                                </Link>
                                                <Link
                                                    to="/events/new"
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <PlusCircleIcon className="w-5 h-5" />
                                                    <span>Create Event</span>
                                                </Link>
                                                <div className="my-1 border-t border-gray-200 dark:border-dark-600"></div>
                                                <button
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                                                    onClick={handleLogout}
                                                >
                                                    <LogoutIcon className="w-5 h-5" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-700 dark:text-gray-200 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 rounded-md"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <XIcon className="w-6 h-6" />
                            ) : (
                                <MenuIcon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden overflow-hidden mt-4"
                        >
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors ${location.pathname === item.path ? 'bg-gray-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400' : ''
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {!isAuthenticated && (
                                    <>
                                        <div className="my-2 border-t border-gray-200 dark:border-dark-600"></div>
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                                {isAuthenticated && (
                                    <>
                                        <div className="my-2 border-t border-gray-200 dark:border-dark-600"></div>
                                        <Link
                                            to="/profile"
                                            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            className="px-4 py-2 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;