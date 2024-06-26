const express = require('express');
const config = require('./config/app');
const routerAll = require('./app/router');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');

process.env.TZ = 'Asia/Makassar';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(routerAll);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

const port = config.appPort;

const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}, http://localhost:3001`);
});

module.exports = app;
