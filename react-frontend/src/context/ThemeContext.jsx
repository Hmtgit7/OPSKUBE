import { createContext, useContext, useEffect, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
    // Check if user has theme preference in localStorage or OS preference
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }

        // Check if user prefers dark mode
        const prefersDark = window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        return prefersDark ? 'dark' : 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme());

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove both theme classes
        root.classList.remove('light', 'dark');

        // Add the current theme class
        root.classList.add(theme);

        // Save theme preference to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle theme
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Set specific theme
    const setThemeMode = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setTheme(mode);
        }
    };

    // Context value
    const value = {
        theme,
        toggleTheme,
        setTheme: setThemeMode,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};