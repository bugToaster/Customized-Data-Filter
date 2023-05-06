const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
let routeService = require('./routes/service');

require('dotenv').config()

const cors = require("cors");


const app = express();

app.use(cors());
app.options('*', cors());




//configure express-bodyparser middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use('/service', routeService);

// view engine setup
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


//Public directory
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);

    const pageTitle = '404 Page Not Found'; // Set the title for the 404 page

    // Render the 404 page and pass the pageTitle variable
    res.render('404', {title: pageTitle});
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
