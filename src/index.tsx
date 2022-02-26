import React from 'react';
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootswatch/dist/spacelab/bootstrap.min.css";

import './index.css';

import App from './components/App';

import * as serviceWorker from './serviceWorker';

import reportWebVitals from './reportWebVitals';

console.log('v 2.11.0');

function sendToAnalytics(metric) {
	const body = JSON.stringify(metric);
	// Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
	(navigator.sendBeacon && navigator.sendBeacon('/stats', body)) ||
		fetch('/stats', { body, method: 'POST', keepalive: true });
}

reportWebVitals(sendToAnalytics);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
