const express = require("express");

const redirectMiddleware = require("../middlewares/redirectMiddleware");
const pageController = require("../controllers/pageController");
const adminRedirectMiddleware = require("../middlewares/adminRedirectMiddleware");

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
router
  .route("/register")
  .get(pageController.getRegisterPage);
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);
router.route("/galeri").get(pageController.getGaleriPage);
router.route("/contact").get(pageController.getContactPage);
router.route("/newblog").get(pageController.getNewBlogPage);
router.route("/contact").post(pageController.sendEmail);

module.exports = router;
