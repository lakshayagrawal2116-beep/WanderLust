

## 🌍 Wanderlust – Travel Listing App

Wanderlust is a full-stack web application built with **Node.js, Express, MongoDB, and EJS** that allows users to explore, create, edit, and review travel listings. It includes secure user authentication, session management, and flash messaging — making it easy and safe to share and discover new destinations.

---

## 🚧 Project Status

> 🚀 **Status:** This project is currently under development. Many new features and improvements will be added in future updates.

---

## ✨ Features

* 🔐 User authentication (signup, login, logout) using **Passport.js**
* 📍 Add, edit, and delete travel listings
* ⭐ Add and manage reviews on listings
* 🛡️ Protected routes – only logged-in users can create or edit listings
* ⚡ Flash messages for feedback (e.g., success, errors)
* 📁 Organized MVC structure for scalability

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS, Bootstrap
* **Database:** MongoDB, Mongoose
* **Authentication:** Passport.js, passport-local
* **Validation:** Joi
* **Other:** express-session, connect-flash, method-override

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/major_project.git
   cd major_project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up MongoDB**
   Make sure MongoDB is running locally or use a cloud database like Atlas.
   Update the connection string in `app.js` if necessary:

   ```js
   const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";
   ```

4. **Run the server**

   ```bash
   node app.js
   ```

5. **Visit the app**
   Go to 👉 [http://localhost:8080](http://localhost:8080)

---

## 📁 Project Structure

```
major_project/
│
├── models/           # Mongoose models
├── routes/           # Routes (user, listing, review)
├── views/            # EJS templates
├── public/           # Static files (CSS, JS, images)
├── utils/            # Utility functions (error handling, etc.)
├── middleware.js     # Custom middleware
├── app.js            # Main application entry point
└── README.md         # Project documentation
```

---

## 🧭 Future Features

* 🗺️ Search & filter listings
* 📸 Image uploads for listings
* 🧑‍💻 User profile pages
* ❤️ Favorite & save listings

