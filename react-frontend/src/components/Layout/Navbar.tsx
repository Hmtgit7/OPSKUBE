import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Tooltip,
    Box
} from '@mui/material';
import Menu as MenuIcon from "@mui/icons-material/Menu as MenuIcon";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import AccountCircle from "@mui/icons-material/AccountCircle";;
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC = () => {
    const { state: { isAuthenticated, user }, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // User menu state
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(anchorEl);

    const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleUserMenuClose();
        navigate('/');
    };

    return (
        <AppBar position="static" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm">
            <Toolbar className="container mx-auto px-4">
                {/* Logo */}
                <Typography
                    component={Link}
                    to="/"
                    variant="h6"
                    className="text-primary-main font-bold text-xl flex-grow md:flex-grow-0"
                >
                    EventHub
                </Typography>

                {/* Desktop Navigation */}
                <Box className="hidden md:flex flex-grow justify-center space-x-4">
                    <Button
                        component={Link}
                        to="/"
                        color="inherit"
                        className="text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                    >
                        Home
                    </Button>
                    <Button
                        component={Link}
                        to="/events"
                        color="inherit"
                        className="text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                    >
                        Events
                    </Button>
                    {isAuthenticated && (
                        <Button
                            component={Link}
                            to="/my-events"
                            color="inherit"
                            className="text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                        >
                            My Events
                        </Button>
                    )}
                </Box>

                {/* Right side actions */}
                <Box className="flex items-center space-x-2">
                    {/* Theme toggle */}
                    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                        <IconButton
                            onClick={toggleTheme}
                            className="text-gray-700 dark:text-gray-200"
                        >
                            {theme === 'light' ? <DarkMode /> : <LightMode />}
                        </IconButton>
                    </Tooltip>

                    {/* Authentication buttons */}
                    {isAuthenticated ? (
                        <>
                            <Tooltip title="Account menu">
                                <IconButton
                                    onClick={handleUserMenuClick}
                                    size="small"
                                    aria-controls={userMenuOpen ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={userMenuOpen ? 'true' : undefined}
                                >
                                    <Avatar className="bg-primary-main w-8 h-8 text-xs">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="account-menu"
                                anchorEl={anchorEl}
                                open={userMenuOpen}
                                onClose={handleUserMenuClose}
                                PaperProps={{
                                    className: 'mt-2 bg-white dark:bg-gray-800 dark:text-white',
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/profile'); }}>
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/my-events'); }}>
                                    My Events
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <div className="hidden md:flex space-x-2">
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                className="border-primary-main text-primary-main hover:bg-primary-main hover:text-white"
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                className="bg-primary-main text-white hover:bg-primary-dark"
                            >
                                Register
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <IconButton
                        className="block md:hidden text-gray-700 dark:text-gray-200"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Toolbar>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            <Button
                                component={Link}
                                to="/"
                                color="inherit"
                                className="text-left text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Button>
                            <Button
                                component={Link}
                                to="/events"
                                color="inherit"
                                className="text-left text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Events
                            </Button>
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        component={Link}
                                        to="/my-events"
                                        color="inherit"
                                        className="text-left text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Events
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/profile"
                                        color="inherit"
                                        className="text-left text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                            navigate('/');
                                        }}
                                        color="inherit"
                                        className="text-left text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-2 border-t dark:border-gray-800">
                                    <Button
                                        component={Link}
                                        to="/login"
                                        variant="outlined"
                                        className="border-primary-main text-primary-main hover:bg-primary-main hover:text-white"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        variant="contained"
                                        className="bg-primary-main text-white hover:bg-primary-dark"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppBar>
    );
};

export default Navbar;