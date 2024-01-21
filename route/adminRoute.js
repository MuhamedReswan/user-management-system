const express = require('express');
const adminRoute =express();

const session = require('express-session');
const config = require('../config/config');
const nocache = require('nocache');
const adminController= require('../controller/adminController');
const auth = require('../middlewares/adminAuth');


adminRoute.use(session({session:config.sessionSecret,resave:false,saveUninitialized:false}));
adminRoute.use(express.json());
adminRoute.use(express.urlencoded({extended:true}));
adminRoute.use(nocache());


adminRoute.set('view engine', 'ejs');
adminRoute.set('views','./views/admin');


adminRoute.get('/', auth.isLogout, adminController.loadLogin);

adminRoute.post('/', adminController.verifyLogin);

adminRoute.get('/home',auth.isLogin, adminController.adminDashboard);

adminRoute.get('/logout',auth.isLogin, adminController.logout);

// adminRoute.get('/dashboard',auth.isLogin,adminController.adminDashboard);

adminRoute.get('/new-user', auth.isLogin,adminController.newUserLoad);

adminRoute.post('/new-user', adminController.addUser);

adminRoute.get('/edit-user',auth.isLogin,adminController.editUser);

adminRoute.post('/edit-user',adminController.updateUser);

adminRoute.get('/delete-user', adminController.deleteUser);


adminRoute.get('*',(req,res)=>{
    res.redirect('/admin');
});







module.exports= adminRoute;