const Users = require('../model/userModel');
const bcrypt = require('bcrypt');

//admin login
const loadLogin = async (req, res) => {
 try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

//login verify
const verifyLogin = async (req, res) => {
try { const email = req.body.Email;
        const password = req.body.Password;
        const UserData = await Users.findOne({ email: email });

        if (UserData) {
             const passwordMatch = await bcrypt.compare(password, UserData.password);

            if (passwordMatch) {

                 if (UserData.is_admin === 0) {
                    res.render('login', { message: "not an admin..." });
                } else {
                    req.session.admin = UserData._id;
                    res.redirect("/admin/home");
                }
            } else {
                res.render('login', { message: " Password is incorrect..." });
            }
        } else {
            res.render('login', { message: " Email not found..." });
        }

    } catch (error) {
        console.log(error);
    }
}

// const loadDashboard = async (req, res) => {
//     try {
//         const UserData = await Users.findById({ _id: req.session.admin });
//         res.render('home', { admin: UserData });

//     } catch (error) {
//         console.log(error);
//     }
// }


//admin logout
const logout = async (req, res) => {

    try {
        req.session.destroy();
        res.redirect("/admin");

    } catch (error) {
        console.log(error.message);
    }
}

//admin Dashboard
const adminDashboard = async (req, res) => {
    try {
        const userData = await Users.find({ is_admin: 0 });
        res.render('adminDashboard', { users: userData });
    } catch (error) {
        console.log(error);
    }
}


// add new user 
const newUserLoad = async (req, res) => {
    try {
        res.render('newUser');
    } catch (error) {
        console.log(error.message);
    }
}

// password  secure
const securedPassword = async (Password) => {
    try {
        const passwordHash = await bcrypt.hash(Password, 10);
        return passwordHash;
        console.log(passwordHash);
    } catch (error) {
        console.log(error);
    }
}


//add user
const addUser = async (req, res) => {
    try {
const Email=req.body.Email;
const Name= req.body.Name;

const checkEmail=await Users.findOne({email:Email});
const checkName= await Users.findOne({name:Name});
if(checkEmail){
    req.flash('existEmail','this email already taken');
    res.redirect('/admin/new-user');
}else if(checkName){
    req.flash('existEmail','this username already taken');
    res.redirect('/admin/new-user');
}else{
        const name = req.body.Name;
        const mobile = req.body.Mobile;
        const email = req.body.Email;
        const password = await securedPassword(req.body.Password);

        const user = new Users({
            name: name,
            email: email,
            mobile: mobile,
            password: password,
            is_admin: 0
});

        const userData = await user.save();

        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            render('newUser', { message: "something wrong.." });
        }
    }
    } catch (error) {
        console.log(error);
    }
}

//edit user
const editUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await Users.findOne({ _id: id });

        if (userData) {
            res.render('editUser', { user: userData });
        } else {
            res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.log(error);
    }
}


//update user                                                 
const updateUser = async (req, res) => {

    try {
// _____________                               WANT TO COMPLETE VALIDATION
// const aName=req.body.Name
// const Name=aName.Trim()
// const Email=req.body.Email
// // console.log(Email)



// // const userData = await Users.findByIdAndUpdate({ _id: req.body.Id })


// // if(UserData){

//     const checkEmail=await Users.findOne({email:Email})
//     // const checkName = await findOne ({name:Name})
// // }
// console.log(checkEmail)
// if(checkEmail){
//     req.flash('existEmail','this email already taken');
//     res.redirect('/admin/editUser');
// }else{
//     const userData = await Users.findByIdAndUpdate({ _id: req.body.Id }, { $set: { name:Name, email: req.body.Email, mobile: req.body.Mobile } })
//         res.redirect('/admin/dashboard');
// }




// // { $set: { name: req.body.Name, email: req.body.Email, mobile: req.body.Mobile } }

//         // res.redirect('/admin/dashboard');



// __________________________
        const userData = await Users.findByIdAndUpdate({ _id: req.body.Id }, { $set: { name: req.body.Name, email: req.body.Email, mobile: req.body.Mobile } })
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
    }
}

//delete user
const deleteUser = async (req, res) => {

    try {
        const id = req.query.id
        await Users.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    verifyLogin,
    loadLogin,
    // loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUser,
    updateUser,
    deleteUser
}