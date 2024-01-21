const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")

//--------------------------------------------------------------------

//require
const express = require('express');
const app = express();
const nocache = require('nocache');
const path = require('path');
const session = require('express-session')
const config= require('./config/config')

const flash = require('express-flash');

// using middle ware
app.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));
app.use(nocache());
app.use('/static',express.static(path.join(__dirname,'public')));
app.use(flash())
//port
const port = 3000;



//for user route
const userRoute = require('./route/userRoute')
app.use('/',userRoute);

//for admin route
const adminRoute = require('./route/adminRoute')
app.use('/admin',adminRoute);

//listen to server
app.listen(port, function () {
    console.log(`server running on http://localhost:${port}`);
}) 