const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const {connectDb} = require('./config/db');
const { error } = require('./middlewares/error');
const { connectPassport } = require('./utils/provider');

// routes
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
dotenv.config({
    path: './config/.env'
});
connectDb();

connectPassport();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'access_token',
    cookie: {
        secure: process.env.NODE_ENV === 'development' ? false:true,
        httpOnly: process.env.NODE_ENV === 'development' ? false:true,
        sameSite: process.env.NODE_ENV === 'development' ? false:'none'
    }
}));
app.use(passport.authorize('session'));
app.use(passport.initialize());
app.enable('trust proxy')

// routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// error middleware
app.use(error);

// start app
const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log('app is working on port: '+port);
})
