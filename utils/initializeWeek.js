const Day = require("../models/Day");

const initializeWeek = async () => {
  const daysOfWeek = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar"
  ];

  for (const day of daysOfWeek) {
    const existingDay = await Day.findOne({ title: day });
    if (!existingDay) {
      await Day.create({ title: day });
    }
  }
};

module.exports = initializeWeek;
