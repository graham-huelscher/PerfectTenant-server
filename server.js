const express = require('express');
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const passport = require('./passport/setup');
const auth = require('./routes/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
})

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: connection})
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', auth);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});