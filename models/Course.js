const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Please provide a title"],
  },
  content: {
    type: String, // Now content is just a single HTML string
    required: [true, "Please provide content"],
  },
  image: {
    type: String, // URL for the image
    required: [true, "Please provide an image URL"],
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});



CourseSchema.pre("validate", function (next) {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
  next();
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
