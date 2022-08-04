require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const config = require('./config');

require('./controllers/ReactionsBotCtrl');

mongoose.set('useFindAndModify', false);

require('./models/reaction');

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB Connected!'))
  .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json({ limit: '8mb' }));

const PORT = process.env.PORT || 2999;

server.listen(PORT, '127.0.0.1', () => {
  console.log(`App is running on port: ${PORT}`);
});
