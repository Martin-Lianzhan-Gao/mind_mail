import { useTheme } from "next-themes";
import { Action, useRegisterActions } from "kbar";


const useThemeSwitching = () => { 
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => { 
        setTheme(theme === "light" ? "dark" : "light")
    }

    const themeActions: Action[] = [
        {
            id: 'toggle-theme',
            name: 'Toggle Theme',
            section: 'Theme Switch',
            shortcut: ['s', 't'], // switch theme
            perform: toggleTheme,
        },
        {
            id: 'switch-to-light',
            name: 'Light',
            section: 'Theme Switch',
            shortcut: ['s', 'l'], // switch to light
            perform: () => setTheme('light'),
        },
        {
            id: 'switch-to-dark',
            name: 'Dark',
            section: 'Theme Switch',
            shortcut: ['s', 'd'],
            perform: () => setTheme('dark'),
        }
    ]

    // register actions, when theme changes, re-register actions (refresh associated state “theme”)
    useRegisterActions(themeActions, [theme]);
}

export default useThemeSwitching;