// file for the application code
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Mustache Templating Engine Setup
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
const upload = multer({ dest: 'uploads/' });

// Routes
app.use(require('./index'));

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
