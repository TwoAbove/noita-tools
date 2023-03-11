const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		createProxyMiddleware('/api/**', {
			ws: true,
			target: 'http://localhost:3001/'
		})
	);
	app.use(
		createProxyMiddleware('/socket.io/**', {
			ws: true,
			target: 'http://localhost:3001/'
		})
	);
};
