const User = require("../models/User");

module.exports = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userID);
      if (!user || !roles.includes(user.role)) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal Server Error"
      });
    }
  }
};
