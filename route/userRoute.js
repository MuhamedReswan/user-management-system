const express = require('express');
const userRoute = express();

const config= require('../config/config')

const session = require('express-session')
userRoute.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}))

const auth = require('../middlewares/auth')

userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

userRoute.set('view engine','ejs');
userRoute.set('views', './views/user');



const userController = require('../controller/userController');

userRoute.get('/register', auth.isLogout, userController.loadRegister);
userRoute.post('/register',userController.insertUser);

userRoute.get('/', auth.isLogout, userController.loginLoad);
userRoute.get('/login', auth.isLogout, userController.loginLoad);

userRoute.post('/login', userController.loginVerify);

userRoute.get('/home', auth.isLogin, userController.loadHome)

userRoute.get('/logout',auth.isLogin,userController.userLogout)

userRoute.get('/edit' ,auth.isLogin, userController.editLoad)
userRoute.post('/edit/:id', userController.updateProfile)


module.exports = userRoute;

