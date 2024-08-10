const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path"); // Ensure path module is included
require("dotenv").config();

const pageRouter = require("./routes/pageRoute");
const courseRouter = require("./routes/courseRoute");
const categoryRouter = require("./routes/categoryRoute");
const userRouter = require("./routes/userRoute");
const weekRouter = require("./routes/weekRoute");
const duyuruRouter = require("./routes/duyuruRoute");

const app = express();

mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.get('/robots.txt', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'robots.txt'), err => {
    if (err) {
      console.error('Error sending robots.txt:', err);
      next(err);
    }
  });
});

app.get('/sitemap.xml', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'sitemap.xml'), err => {
    if (err) {
      console.error('Error sending sitemap.xml:', err);
      next(err);
    }
  });
});

//Global
global.userIN = null;

//Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "megerim",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING,
    }),
  }),
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  }),
);

//Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRouter);
app.use("/courses", courseRouter);
app.use("/categories", categoryRouter);
app.use("/week", weekRouter);
app.use("/users", userRouter);
app.use("/duyurular", duyuruRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Hazır: ${port}`);
});
