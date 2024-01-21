const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id){
            next();
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error)
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect("/home");
        } 
        next();

    } catch (error) {
        console.log(error);
    }
}

// const back =async(req, res, next)=>{
//     try {
//         if (!req.session.user_id){

//             next();

//             }else{

//             res.redirect('/admin')
//         }
//     } catch (error) {
//         console.log(error);
        
//     }
// }


// const backVerify=async(req, res, next)=>{
//     try {
//         if (req.session.user_id){

//             next();

//             }else{

//             res.redirect('/login')
//         }
//     } catch (error) {
//         console.log(error);
        
//     }
// }

module.exports = {
    isLogout,
    isLogin
}