const express = require('express');
const router = express.Router({mergeParams: true});
/*
used {merge} because express Router likes to keep the params seperate. 
So in index.js we have used app.use('/campgrounds/:id/reviews', reviews) and there is an id in that route/path, that prefixes all of the routes in this file.
But by default we won't have access to that id in our reviews route, routers get seperate params and they are seperte.
So use merge const router = express.Router({mergeParams: true}); instead of const router = express.Router();
So by doing so all of the params from index.js will be merged to this file, so we will have access to that id 
*/

const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const { reviewSchema  } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');


const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggendIn, isReviewAuthor} = require('../middleware');


router.post('/', isLoggendIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggendIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;