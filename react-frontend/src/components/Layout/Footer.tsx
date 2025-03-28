import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Grid, Box } from '@mui/material';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box component="footer" className="bg-gray-100 dark:bg-gray-800 py-8 mt-auto">
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid component="div" item xs={12} sm={6} md={3}>
                        <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mb-4">
                            EventHub
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 dark:text-gray-300 mb-4">
                            Making event management simple and accessible for everyone.
                        </Typography>
                    </Grid>

                    <Grid component="div" item xs={12} sm={6} md={3}>
                        <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mb-4">
                            Quick Links
                        </Typography>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </Grid>

                    <Grid component="div" item xs={12} sm={6} md={3}>
                        <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mb-4">
                            Support
                        </Typography>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </Grid>

                    <Grid component="div" item xs={12} sm={6} md={3}>
                        <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mb-4">
                            Social
                        </Typography>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light"
                                >
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light"
                                >
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light"
                                >
                                    Instagram
                                </a>
                            </li>
                        </ul>
                    </Grid>
                </Grid>

                <Box className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                        &copy; {currentYear} EventHub. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;