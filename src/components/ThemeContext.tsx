import { createContext, Suspense, useEffect } from 'react';
import useLocalStorage from '../services/useLocalStorage';

const lightThemeUrl =
	'https://cdn.jsdelivr.net/npm/bootswatch@5.1.3/dist/flatly/bootstrap.min.css';
const darkThemeUrl =
	'https://cdn.jsdelivr.net/npm/bootswatch@5.1.3/dist/darkly/bootstrap.min.css';

const ThemeContext = createContext<any[]>([]);

const themes = {
	light: lightThemeUrl,
	dark: darkThemeUrl
};

const ThemeProvider = props => {
	const [theme, setTheme] = useLocalStorage(
		'theme',
		'light',
		d => {
			return d || 'light';
		},
		s => {
			return s || 'light';
		}
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
