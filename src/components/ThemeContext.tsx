import { createContext, Suspense, useEffect } from 'react';
import useLocalStorage from '../services/useLocalStorage';

const lightThemeUrl = '/light-theme.css';
const darkThemeUrl = '/dark-theme.css';

const ThemeContext = createContext<any[]>([]);

const themes = {
	light: lightThemeUrl,
	dark: darkThemeUrl
};

const ThemeProvider = props => {
	const [theme, setTheme] = useLocalStorage(
		'theme',
		'light'
	);

	useEffect(() => {
		const element: any = document.getElementById('theme-url');
		if (!element) {
			return;
		}
		element.href = themes[theme];
	}, [theme]);

	return (
		<ThemeContext.Provider value={[theme, setTheme]}>
			<Suspense fallback={<></>}>{props.children}</Suspense>
		</ThemeContext.Provider>
	);
};

export { ThemeContext, ThemeProvider };
