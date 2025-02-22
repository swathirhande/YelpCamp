const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index= async(req,res)=>{
   const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm= (req,res) => {
    res.render('campgrounds/new');
 } 
 module.exports.createCampgrounds = async(req,res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });


     
   //  if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400); 
     //when we have not included all the fields in the campground form, it throws an error. 
     //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);  is used beacuse if we send a request using POSTMAN, that's not caught but if we send a request using the form it's caught beacuse we have used "required" 
     /*
     const err = {}; // No message or statusCode
     const { statusCode = 500, message = 'Something went wrong' } = err;
     console.log(message); // "Something went wrong"
     console.log(err.message); // undefined (NOT updated)
     */
     const campground = new Campground(req.body.campground);
     campground.author = req.user._id;
     campground.geometry = geoData.features[0].geometry;
     await campground.save();
     req.flash('success', 'Successfully made a new Campground');
     res.redirect(`/campgrounds/${campground._id}`);
 
     }
     module.exports.showCampground = async(req,res)=>{
         const campground = await Campground.findById(req.params.id).populate({
             path:'reviews',
             populate:{
                 path:'author'
             }
         }).populate('author');
         console.log(campground);
         if(!campground){
             req.flash('error','Cannot find that campground')
             return res.redirect('/campgrounds');
         }
          res.render('campgrounds/show', {campground});
      }

      module.exports.renderEditForm = async(req,res)=> {
        const id = req.params.id;
        const campground = await Campground.findById(id);
        if(!campground){
            req.flash('error','Cannot find that campground')
            return res.redirect('/campgrounds');
        }
       
         res.render('campgrounds/edit', {campground});
    }

    module.exports.updateCampground = async (req,res)=> {
        const {id} = req.params;
      //const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
      
      const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
      const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
      campground.geometry = geoData.features[0].geometry;
      req.flash('success', 'Successfully updated campground!')
      res.redirect(`/campgrounds/${campground._id}`);
    }

    module.exports.deleteCampgrounds = async(req,res)=> {
        const {id} = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground')
        res.redirect('/campgrounds');
    
    }