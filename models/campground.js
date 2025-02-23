const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title:String,
    image: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description:String,
    location:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


CampgroundSchema.post('findOneAndDelete', async function(doc){
if(doc){
    await Review.deleteMany({
        _id:{
            $in: doc.reviews
        }
    })
}
})
/*
The error "Review.remove is not a function" occurs because .remove() is deprecated in Mongoose 6+. Instead, you should use .deleteMany().
*/

module.exports = mongoose.model('Campground', CampgroundSchema);
