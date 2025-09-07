require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const workoutRouters = require('./routes/workouts');

// express app
const app = express();
const port = process.env.PORT ;

// middleware
app.use(express.json()); 
//If the request’s Content-Type header is application/json, automatically parse the JSON string into a JavaScript object and store it in req.body.

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/workouts', workoutRouters);

// connect to db
console.log(" Trying to connect with:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(port, () => {
    console.log(`Connected to DB & listening on port : ${port}`);
  });
})
.catch((error) => {
  console.error(" DB connection error:", error.message);
});
