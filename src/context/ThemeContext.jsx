import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference on mount
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('vecy-theme');
        return savedTheme || 'coffee'; // Default to 'coffee' (Claro)
    });

    useEffect(() => {
        localStorage.setItem('vecy-theme', theme);
        // Apply global class to body if needed (optional, but good for global styles)
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    const value = {
        theme,
        setTheme,
        isDark: theme === 'dark',
        isCoffee: theme === 'coffee'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
