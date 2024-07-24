const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const TimePartSchema = new Schema({
  event: {
    type: String,
    required: [true, "Please provide an event description"]
  }
});

const DaySchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "Please provide a description"]
  },
  slug: {
    type: String,
    unique: true
  },
  morning: TimePartSchema,
  afternoon: TimePartSchema,
  evening: TimePartSchema
});

DaySchema.pre("validate", function (next) {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true
  });
  next();
});

const Day = mongoose.model("Day", DaySchema);

module.exports = Day;
