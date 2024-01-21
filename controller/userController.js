const Users = require('../model/userModel')
const bcrypt = require('bcrypt')


// password secure
const securedPassword = async (Password) => {
    try {
        const passwordHash = await bcrypt.hash(Password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}

// new registration
const loadRegister = async (req, res) => {
    try {
        res.render("registration")
    } catch (error) {
        console.log(error.message);
    }
}


// inset user
const insertUser = async (req, res) => {
    try {

        const email = req.body.Email;
        const namee = req.body.Name;
        const finduser = await Users.findOne({ email: email });
        const findUserbyname = await Users.findOne({ name: namee });

        if (finduser) {
            req.flash('exist', 'User already exists with this email');
            res.redirect('/register')

        } else if (findUserbyname) {
            req.flash('usernameexist', 'Sorry, the username is already taken');
            res.redirect('/register')

        }
        else {
            const sPassword = await securedPassword(req.body.Password);

            const user = new Users({
                name: req.body.Name,
                email: req.body.Email,
                mobile: req.body.Mobile,
                password: sPassword,
                is_admin: 0,
            });

            const UserData = await user.save()
            if (UserData) {
                res.render('registration', { message: "your registration has been succesful..." })
            } else {
                res.render('registration', { message: "your registration has been failed..." })
            }
        }

    } catch (error) {
        console.log(error)
    }
}



// login user method
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);

    }
}

// user login verify
const loginVerify = async (req, res) => {
    try {
        const email = req.body.Email;
        const password = req.body.Password

        const UserData = await Users.findOne({ email: email })

        if (UserData) {
            const passwordMatch = await bcrypt.compare(password, UserData.password)
            if (passwordMatch) {
                req.session.user_id = UserData._id;
                res.redirect("/home");
            }
        } else {
            res.render('login', { message: "incorrect email or password" })
        }

    } catch (error) {
        console.log(error)
    }
}

// user Home
const loadHome = async (req, res) => {
    try {
        const UserData = await Users.findById({ _id: req.session.user_id })
        res.render('home', { user: UserData });
    } catch (error) {
        console.log(error);
    }
};

// user logout
const userLogout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}

// edit and upload
const editLoad = async (req, res) => {
    try {

        const id = req.query.id;
        UserData = await Users.findById({ _id: id })
        res.render('edit', { user: UserData })

    } catch (error) {
        console.log(error);
    }
}


// update profile by user
const updateProfile = async (req, res) => {
    try {

        const UserData = await Users.findByIdAndUpdate({ _id: req.params.id }, {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile
        })
        console.log("userData" + UserData);
        console.log(req.params.id);
        res.redirect('/home');

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    loginVerify,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}