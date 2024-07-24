const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Day = require("../models/Day");



exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.array()[0].msg);
  
    for (let i = 0; i <errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }
  
    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });

    if (!user) {
      req.flash("error", "Kullanıcı Bulunamadı");
      return res.status(400).redirect("/login");
    }

    bcrypt.compare(password, user.password, (err, same) => {
      if (err || !same) {
        req.flash("error", "Lütfen Şifrenizi Kontrol Ediniz");
        return res.status(400).redirect("/login");
        };
      
      req.session.userID = user._id;
      res.status(200).redirect("/users/dashboard");
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById(req.session.userID).populate("courses");
  const categories = await Category.find();
  const courses = await Course.find();
  const users = await User.find();
  const days = await Day.find();
  const day = await Day.findById("669d5c756403b454f08ace35");
  
  
  // Filter users by role
  const students = users.filter(u => u.role === "student");
  const teachers = users.filter(u => u.role === "teacher");

  res.status(200).render("dashboard", {
    title: "Dashboard",
    user,
    categories,
    courses,
    users,
    students,
    teachers,
    days,
    day
  });
};


exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({ user: req.params.id });
    res.status(200).redirect("/users/dashboard");
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};
