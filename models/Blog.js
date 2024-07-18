const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Please provide a description"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

BlogSchema.pre("validate", function (next) {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
  next();
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
