# YelpCamp

![YelpCamp](https://github.com/swathirhande/images/blob/main/yelpCamp.png)  
*A full-stack web application for camping enthusiasts to explore, review, and share campgrounds.*

## 🚀 Overview
YelpCamp is a **Node.js, Express, MongoDB, and Bootstrap** powered web application that allows users to browse, add, and review campgrounds. It is inspired by Yelp but focused on camping locations. The platform provides user authentication, authorization, and interactive maps for an enhanced user experience.

## 🛠 Features
✅ **User Authentication & Authorization**: Secure login & registration using Passport.js.  
✅ **CRUD Operations**: Users can add, edit, delete campgrounds & reviews.  
✅ **Interactive Maps**: Integrated with MapTiler Cloud to display camp locations.  
✅ **Flash Messages**: Enhances UX with feedback notifications.  
✅ **Responsive UI**: Built using Bootstrap to ensure mobile compatibility.  

## 🏗 Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap, JavaScript
- **Authentication**: Passport.js (Local Strategy)
- **Cloud Services**: MapTiler Cloud (Maps)
- **Deployment**: Render

## 🏁 Installation
1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/YelpCamp.git
   cd YelpCamp
   ```
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_mongodb_uri
   MAPTILER_TOKEN=your_maptiler_token
   ```
4. **Port Configuration**:

By default, this application is set to use **port 10000** because Render requires web services to bind to `0.0.0.0` on a specific port (usually **10000**). However, if you're running the project locally, it's recommended to change the port to **3000** for consistency with local development practices.

### Update the Code:
Before running the app locally, **update the port configuration** in `app.js`:

```javascript
const port = process.env.PORT || 3000; // Change 10000 to 3000 for local development
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);
});
```

5. **Run the application**:
   ```sh
   npm start
   ```
6. Open `http://localhost:3000` in your browser.

## 🌍 Live Demo
You can view the website at: **[YelpCamp Live](https://yelpcamp-1-dpmx.onrender.com/)**

**Note**: If you encounter a **502 Bad Gateway** error, please refresh the page after a minute or try again after some time, as the app is hosted on the free tier of Render. It may take a while to get up and running.

## 📜 Folder Structure
```
YelpCamp/
│── public/        # Static assets (CSS, JS, Images)
│── routes/        # Express routes (campgrounds, reviews, users)
│── models/        # Mongoose schemas (Campground, Review, User)
│── views/         # EJS templates
│── middleware/    # Custom middleware functions
│── seeds/         # Sample campground data
│── app.js         # Main Express app
│── .env           # Environment variables
│── package.json   # Dependencies & scripts
```

## 💡 Future Improvements
🔹 Implement a booking system for campgrounds.  
🔹 Improve campground search functionality.  
🔹 Add user profile pages with camping history.  
🔹 Enable social login (Google, Facebook, etc.).  

## 🤝 Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.


## ✨ Acknowledgments
- **Colt Steele's Web Developer Bootcamp** for initial inspiration.
- **Yelp** for the concept idea.
- **MapTiler Cloud** for their amazing mapping API.

---
💙 **If you like this project, consider giving it a star ⭐ on GitHub!**
