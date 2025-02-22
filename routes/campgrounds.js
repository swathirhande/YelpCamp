const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLoggendIn, isAuthor, validateCampground} = require('../middleware');
const multer = require('multer');
const upload = multer({dest:'uploads/'});


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggendIn, validateCampground, catchAsync(campgrounds.createCampgrounds))
   /* .post(upload.array('image',5),(req,res)=>{
        console.log(req.body, req.files);
        res.send("Hi");
    })*/
   


router.get('/new',  isLoggendIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggendIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggendIn,  isAuthor, catchAsync(campgrounds.deleteCampgrounds))

router.get('/:id/edit', isLoggendIn, isAuthor, catchAsync(campgrounds.renderEditForm))

/* In order to use "put' or "delete' we need to install method-override. 
Steps:
1)Stop the server
2)npm i method-override
3)Start the server : nodemon app.js
4) add these in app.js:
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
*/


module.exports = router;


