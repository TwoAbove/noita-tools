import React from 'react';
import { createRoot } from 'react-dom/client';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootswatch/dist/spacelab/bootstrap.min.css";

import './index.css';
import './i18n';

import App from './components/App';

import * as serviceWorker from './serviceWorker';

import reportWebVitals from './reportWebVitals';

console.log('v2.14.1');

function sendToAnalytics(metric) {
	const body = JSON.stringify(metric);
	// Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
	(navigator.sendBeacon && navigator.sendBeacon('/stats', body)) ||
		fetch('/stats', { body, method: 'POST', keepalive: true });
}

reportWebVitals(sendToAnalytics);
const root = createRoot(document.getElementById('root')!);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
