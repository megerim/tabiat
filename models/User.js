// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    lowercase: true, // Automatically convert to lowercase
    unique: true,    // Ensure uniqueness
  },
  email: {
    type: String,
    required: [true, "Please provide a mail"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// Pre-save hook to hash passwords
UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Create a unique index on 'name' with Turkish collation
UserSchema.index({ name: 1 }, { unique: true, collation: { locale: 'tr', strength: 2 } });

const User = mongoose.model("User", UserSchema);

module.exports = User;