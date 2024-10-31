require("dotenv").config();

const PORT = process.env.EXPRESS_PORT || 8080;
const express = require("express");
// Provides Express middleware to enable CORS
const cors = require("cors");
const morgan = require("morgan");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config.js");

// Create an Express app
const app = express();

var corsOptions = {
  origin: process.env.CORS_URL,
};

// Add `cors` middleware
app.use(cors(corsOptions));

// Add json middleware so we can parse requests of content-type - application/json
app.use(express.json());

// Add urlencoded middleware so we can parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // log HTTP requests and errors to console
// Open a Mongoose connection to the MongoDB database
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// Define a test route
// app.get("/", (req, res) => {
//   res.json({ message: "Hello world!" });
// });

// Import the routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// Listen for requests
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
