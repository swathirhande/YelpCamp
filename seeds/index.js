//connect to mongoose and use the model. 
// We will run this file on its own, seperately from the node app, whenver we want to seed our database.

const mongoose = require('mongoose');
const cities = require('./city');
const {places,descriptors} = require('./seedHelpers');
const imageUrls = require("./imageUrls");
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
   //removed this because its not supported from version: 6+:  useCreateIndex: true,
    useUnifiedTopology: true
}); 
/*
or we can use this
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));
*/

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open" ,() => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random()* array.length)];

const seedDB = async() => {
   await Campground.deleteMany({});
   for(let i=0; i< 200; i++){
    const random1000 = Math.floor(Math.random()*1000);
    const price = Math.floor((Math.random()*20)+10);
    const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

   const camp = new Campground({
        author: '67b8b1efa10cb1092a4ae7e3' , //bob's id
        title: `${sample(descriptors)} ${sample(places)}`,
        geometry: {
            type: "Point",
            coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
            ]
        },
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        image: randomImage,
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit pariatur quas laborum unde officiis fugiat quod facere recusandae earum, nostrum voluptate distinctio ut dolorum esse. Obcaecati consectetur debitis quasi sed.',
        price
    })
    await camp.save();
   }
}
seedDB().then(() => {
mongoose.connection.close();
});