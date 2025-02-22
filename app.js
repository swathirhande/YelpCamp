/*Using a tool Joi- javascript validator tool. Link: https://joi.dev/api/?v=17.13.3
This is uselful beacuse we need not write conditions for each field in the form, if if(!req.body.camground.title) then give that error 
or if(!req.body.camproground.image) then do something else...
Installation: npm i joi
Then require joi by using in app.js: const joi = require('joi') and use it*/

if(process.env.NODE_ENV !== 'production'){  /*if in development mode only then require the require('dotenv').config();*/
    require('dotenv').config();
}



console.log(process.env.MAPTILER_API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
/*
Why we need es-mate? when we have a nav bar that needs to be incorporated in all pages we just used to define a boilerplate and use it
but what if we wanted the boiled plate to have a value like <%body%> and tweak it in every ejs file accordingly, then we use ejs-mate
*/
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

/*
This method is depricated: useNewUrlParser: true, useUnifiedTopology: true in:
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
   //removed this because its not supported from version: 6+:  useCreateIndex: true,
    useUnifiedTopology: true
}); */
mongoose.connect(dbUrl)
.then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Connection error:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open" ,() => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'Thisshouldbeabettersecret!'
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})

const sessionConfig ={
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
    //if this flag(httpOnly: true) is included in the cookie, the cookie can't be accessed through client side scripts 
    // and as a result even if cross site scripting exists and user if user accidently accessess a link that exploits this flaw the browser will not reveal the cookie to a third party
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());



app.use(passport.initialize());
app.use(passport.session()); //this is used for persistent login sessions (if we don't use this then having to login on every single request)
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //how we store the user in the session
passport.deserializeUser(User.deserializeUser());//how to get user out of that session


app.use((req,res,next)=> {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async(req,res)=> {
    const user = new User({email:'swathi@gmail.com', username:'swathiii'});
    const newUser = await User.register(user, 'chicken'); //this will hash the password and store it
    res.send(newUser);
})

app.use('/',userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home');
})

//  {$pull:{reviews: reviewId}} : pulls the reviewId from reviews since reviews are only has ID's in Campground, like deleting the ID's
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
   // const {statusCode = 500, message = 'Something went wrong'} = err; When setting the message like this is not actually going to work, to update the err object. 
   //Im trying to extract the variable "message" from err and giving it a default
   // so we need to do it like this: if(!err.message) err.message ='Oh No, Something Went wrong!';
   const {statusCode = 500} = err;
   if(!err.message) err.message ='Oh No, Something Went wrong!';
    res.status(statusCode).render('error',{ err });
})


/*const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});*/

const port = process.env.PORT || 10000; // Set to 10000 for Render
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});
