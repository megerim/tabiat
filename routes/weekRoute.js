const express = require("express");

const weekController = require("../controllers/weekController");

const router = express.Router();

router.route("/").post(weekController.createDay);
router.route("/:id").delete(weekController.deleteDay);
router.route("/calendar").get(weekController.getDays);
router.route("/edit/:id").post(weekController.editDay);

module.exports = router;
