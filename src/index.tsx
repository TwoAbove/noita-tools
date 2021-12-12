import React from 'react';
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootswatch/dist/spacelab/bootstrap.min.css";
import 'bootswatch/dist/cosmo/bootstrap.min.css';

import './index.css';

import App from './components/App';

import * as serviceWorker from './serviceWorker';

// import './services/SeedInfo/infoHandler.check';

import { getCLS, getLCP, getFCP, getFID, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
	const body = JSON.stringify(metric);
	// Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
	(navigator.sendBeacon && navigator.sendBeacon('/stats', body)) ||
		fetch('/stats', { body, method: 'POST', keepalive: true });
}

getCLS(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getFID(sendToAnalytics);
getTTFB(sendToAnalytics);

console.log('v 2.6.0');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
