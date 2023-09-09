require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
// my routed
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const app = express();

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch(() => console.log("Error"));

// middlewares

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// my routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`App is running at ${port}`));
