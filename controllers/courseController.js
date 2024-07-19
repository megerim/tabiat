const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash("success", `Kurs oluşturuldu: ${course.title}`);
    res.status(201).redirect(`/courses/${course.slug}`);
  } catch (error) {
    req.flash ("error", "Kurs oluşturulamadı");
    res.status(400).redirect("/users/dashboard")
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;
    let filter = {};

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      }
    }

    if (query) {
      filter.title = { $regex: ".*" + query + ".*", $options: "i" };
    }

    const courses = await Course.find(filter);
    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      title: "Courses",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const courses = await Course.find();
    const course = await Course.findOne({ slug: req.params.slug });
    const categories = await Category.find();

    if (!course) {
      return res.status(404).send("Ders Bulunamadı");
    }
    res.status(200).render("course", {
      course,
      user,
      categories,
      courses,
      title: "Kurs Detayı",
    });
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};
exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    user.courses.push({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/users/dashboard");
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};
exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    user.courses.pull({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/users/dashboard");
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ slug: req.params.slug });
    await User.deleteMany({ courses: req.params.id });
    req.flash("success", `${course.title} isimli blog yazısı başarıyla silindi. `);
    res.status(200).redirect("/users/dashboard");
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.title = req.body.title;
    course.description = req.body.description;
    course.category = req.body.category;
    await course.save();
    req.flash("success", `${course.title} başarıyla güncellendi. `);
    res.status(200).redirect("/users/dashboard");
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};
