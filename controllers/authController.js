// controllers/authController.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Day = require("../models/Day");
const Duyuru = require("../models/Duyuru");

exports.createUser = async (req, res) => {
  try {
    // The 'name' is automatically converted to lowercase by the model
    const user = await User.create(req.body);
    req.session.userID = user._id; // Optionally log in the user immediately after registration
    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    
    if (!errors.isEmpty()) {
      errors.array().forEach(err => {
        req.flash("error", err.msg);
      });
    } else if (error.code === 11000) { // Duplicate key error
      req.flash("error", "Kullanıcı adı veya e-posta zaten mevcut.");
    } else {
      req.flash("error", "Kullanıcı oluşturulurken bir hata oluştu.");
    }

    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  const { name, password } = req.body;
  console.log(`Input Name: ${name}`);
  try {
    // Normalize the input username to lowercase
    const normalizedUsername = name.toLowerCase();
    console.log(`Normalized Username: ${normalizedUsername}`);

    // Perform case-insensitive search using Turkish collation
    const user = await User.findOne({ name: normalizedUsername })
      .collation({ locale: 'tr', strength: 2 }); // Changed locale to 'tr'

    console.log(`Queried User: ${user}`);

    if (!user) {
      req.flash("error", "Kullanıcı Bulunamadı");
      return res.status(400).redirect("/login");
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error", "Lütfen Şifrenizi Kontrol Ediniz");
      return res.status(400).redirect("/login");
    }

    // Initialize user session
    req.session.userID = user._id;
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.error("Login Error:", error);
    req.flash("error", "Giriş sırasında bir hata oluştu.");
    res.status(500).redirect("/login");
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).redirect("/");
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.redirect("/");
  });
};

exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID).populate("courses");
    const categories = await Category.find();
    const courses = await Course.find();
    const users = await User.find();
    const days = await Day.find();
    const duyurular = await Duyuru.find();  // Fetch announcements

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
      duyurular,  // Pass announcements to the view
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    req.flash("error", "Dashboard'a erişirken bir hata oluştu.");
    res.status(500).redirect("/login");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({ user: req.params.id });
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    console.error("Delete User Error:", error);
    req.flash("error", "Kullanıcı silinirken bir hata oluştu.");
    res.status(400).redirect("/users/dashboard");
  }
};