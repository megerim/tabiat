const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image, 
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash("success", `Blog yazısı oluşturuldu: ${course.title}`);
    res.status(201).redirect(`/courses/${course.slug}`);
  } catch (error) {
    req.flash("error", "Blog yazısı oluşturulamadı");
    res.status(400).redirect("/users/dashboard");
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

    const courses = await Course.find(filter).populate('category');
    const categories = await Category.find();
    const user = await User.findById(req.session.userID);

    res.status(200).render("courses", {
      user,
      courses,
      categories,
      title: "Blog",
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
    const courses = await Course.find().populate('category');
    const course = await Course.findOne({ slug: req.params.slug }).populate('category');
    const categories = await Category.find();

    if (!course) {
      return res.status(404).send("Blog yazısı bulunamadı");
    }
    res.status(200).render("course", {
      course,
      user,
      categories,
      courses,
      title: "Blog",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.title = req.body.title;
    course.content = req.body.content; // Handling multiple content blocks
    course.category = req.body.category;
    await course.save();
    req.flash("success", `${course.title} başarıyla güncellendi.`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    req.flash("error", "Blog yazısı güncellenemedi");
    res.status(400).redirect("/users/dashboard");
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

exports.editCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate('category');
    const categories = await Category.find();

    if (!course) {
      return res.status(404).send("Blog yazısı bulunamadı");
    }

    res.status(200).render("editCourse", {
      course,
      categories,
      user,
      title: "Blog Yazısını Düzenle",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
