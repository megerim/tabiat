const Blog = require("../models/Blog");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });

    req.flash("success", `Blog oluşturuldu: ${blog.title}`);
    res.status(201).redirect(`/blog/${blog.slug}`);
  } catch (error) {
    req.flash ("error", "Blog oluşturulamadı");
    res.status(400).redirect("/users/dashboard")
  }
};

exports.getAllBlogs = async (req, res) => {
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

    const blogs = await Blog.find(filter);
    const categories = await Category.find();

    res.status(200).render("blog", {
      blogs,
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


exports.getBlog = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const blog = await Blog.findOne({ slug: req.params.slug });
    const categories = await Category.find();

    if (!blog) {
      return res.status(404).send("Yazı Bulunamadı");
    }
    res.status(200).render("blog", {
      blog,
      user,
      categories,
      title: "Yazı Detayı",
    });
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    
    req.flash("error", `${blog.title} başarıyla silindi. `);
    res.status(200).redirect("/users/dashboard");
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    blog.title = req.body.title;
    blog.description = req.body.description;
    blog.category = req.body.category;
    await blog.save();
    req.flash("success", `${blog.title} başarıyla güncellendi. `);
    res.status(200).redirect("/blog/" + blog.slug);
  } catch {
    res.status(400).json({
      success: false,
    });
  }
};

exports.getBlogForm = async (req, res) => {
  const categories = await Category.find();
  res.status(200).render("blogForm", {
    categories,
    title: "Yazı Oluştur",
  });
}