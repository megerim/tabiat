const express = require("express");

const weekController = require("../controllers/weekController");

const router = express.Router();

router.route("/").post(weekController.createDay);
router.route("/:id").delete(weekController.deleteDay);
router.route("/calendar").get(weekController.getDays);

module.exports = router;
