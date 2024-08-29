if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose');
const app = express()
const User = require('./models/user.js');
const Todo = require('./models/user.js');
const secret = process.env.SECRET
const port = process.env.PORT || 4000;
const dbUrl = process.env.DB_URL
const MongoStore = require('connect-mongo');

const cors = require('cors')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session'); 

const userRoutes = require('./routes/users');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: secret
  }
});

app.use(session({
  store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() +1000 *60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}));
app.use(passport.session());  

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Serving on port${port}`)
})

