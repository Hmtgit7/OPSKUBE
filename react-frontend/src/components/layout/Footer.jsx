import { Link } from 'react-router-dom';
import { CalendarIcon } from '@heroicons/react/outline';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 py-12">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and description */}
                    <div className="md:col-span-1">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-serif"
                        >
                            <CalendarIcon className="w-8 h-8" />
                            <span className="text-2xl font-bold">EventHub</span>
                        </Link>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            Create, discover, and join events in one place. Make meaningful connections and expand your horizons.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/events" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/events/new" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Create Event
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/my-events" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        My Events
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                                About
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                                Connect
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://twitter.com/Gehlodhemant"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        Twitter
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://instagram.com/hemant_gehlod"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto: hmtloharcoding3579@gmail.com"
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        Email Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-700 text-center text-gray-600 dark:text-gray-400">
                    <p>
                        &copy; {currentYear} EventHub by spark_developie. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;