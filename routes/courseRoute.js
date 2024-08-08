const express = require("express");

const courseController = require("../controllers/courseController");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.route("/").post(roleMiddleware(["teacher", "admin"]), courseController.createCourse);
router.route("/").get(courseController.getAllCourses);
router.route("/:slug").get(courseController.getCourse);
router.route("/:slug").delete(courseController.deleteCourse);
router.route("/:slug/edit").get(courseController.editCourse);
router.route("/:slug").put(courseController.updateCourse);


module.exports = router;
