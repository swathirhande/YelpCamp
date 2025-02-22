const User = require('../models/user');

module.exports.renderRegister = (req, res) =>{
    res.render('users/register');
}
module.exports.Register= async(req,res,next)=> {
    try {
    const {email, username, password }= req.body;
    const user = new User({email, username});
    const registerUser = await User.register(user,password); //takes the new user and takes the password and it will hash the password and save the results for that user
    //passport has a method .login() and it establishes a login session
    req.login(registerUser, err=>{ //err because if we get an error then we need to handle that
        if(err) return next(err);
        req.flash('success','Welcome to Campground');
         res.redirect('/campgrounds');   
    })
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }

}

module.exports.renderLogin =(req,res) =>{
    res.render('users/login');
}

module.exports.login =  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}