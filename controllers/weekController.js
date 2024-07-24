const Day = require("../models/Day");
const initializeWeek = require("../utils/initializeWeek");

exports.createDay = async (req, res) => {
  try {
    const { day, time, event } = req.body;
    let update = {};
    update[time] = { event };

    let existingDay = await Day.findOne({ title: day });

    if (existingDay) {
      await Day.findByIdAndUpdate(existingDay._id, { $set: update }, { new: true });
      res.status(200).redirect("/users/dashboard");
    } else {
      let newDay = { title: day };
      newDay[time] = { event };
      await Day.create(newDay);
      res.status(201).redirect("/users/dashboard");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};

exports.deleteDay = async (req, res) => {
  try {
    await Day.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};


exports.getDays = async (req, res) => {
  try {
    await initializeWeek();
    const days = await Day.find({});
    res.status(200).render("/users/dashboard", { days });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};
