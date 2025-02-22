const { campgroundSchema , reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggendIn =(req,res,next)=> {
if(!req.isAuthenticated()){ //isAuthenticated() is the method in passport
    //here we can save the url from where user was present before coming to login and after login he can be redirected to that page
    req.session.returnTo = req.originalUrl ; //here in session we add a field returnTo and that will hold that path from where the user requested
    console.log("From the middleware.js, the value of req.originalUrl is:", req.session.returnTo);
    req.flash('error','You must be signed in first!')
    return res.redirect('/login');
}
next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.validateCampground = (req,res,next) => {
    //The below logic is when user sends a request using POSTMAN and it doesn't check if all fields are filled and creates an empty new campground. 
   // So inorder to have this form to be validated we use Joi to do that.
   
   const { error } = campgroundSchema.validate(req.body);
   if(error){ //here error.details is an array so use map and then join using , if there are more than one element in error.details 
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
   }
   else{
    next();
   }
   /*This campgroundSchema is not Mongoose schema, it validates it before we even attempt to save it in mongoose or before we even involve mongoose*/
    
}

module.exports.isAuthor = async(req,res,next) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
   if(!campground.author.equals(req.user._id)){
    req.flash('error', 'You do not have permisssion to do that');
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){ //here error.details is an array so use map and then join using , if there are more than one element in error.details 
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
       }
       else{
        next();
       }
}

module.exports.isReviewAuthor = async(req,res,next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
   if(!review.author.equals(req.user._id)){
    req.flash('error', 'You do not have permisssion to do that');
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}