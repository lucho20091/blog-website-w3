require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./server/config/db');

const app = express();
// Connect to MongoDB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template engine
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


