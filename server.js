const handler = require('serve-handler');
const express = require('express');
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.SEQUELIZE_STRING);

// const server = http.createServer((request, response) => {
//   // You pass two more arguments for config and middleware
//   // More details here: https://github.com/vercel/serve-handler#options
//   return handler(request, response, );
// })

// uses serve-handler to serve the dist folder using express
const app = express();

app.post('/data', (req, res) => {
	console.log(req.body);
});

app.use((req, res) => {
	handler(req, res, {
		public: './build'
	});
});

app.listen(3000, () => {
	console.log('Running at http://localhost:3000');
});
