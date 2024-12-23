const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    if (!user.role ==="admin") {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
