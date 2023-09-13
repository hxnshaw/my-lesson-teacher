const cron = require("node-cron");
const Student = require("../models/Student");
const moment = require("moment");

cron.schedule("* * * * *", async function (req, res, next) {
  let todays_date = moment(new Date()).format("YYYY-MM-DD hh:mm");
  const find_students = await Student.find({});
  if (find_students) {
    for (let i = 0; i < find_students.length; i++) {
      let students = find_students[i];
      let studentDueDate = moment(students.next_payment_date).format(
        "YYYY-MM-DD hh:mm"
      );
      if (todays_date === studentDueDate) {
        let student = await Student.findOne({ _id: req.user.userId });
        student.referenceCode = [];
        await student.save();
      }
    }
  }
});

function calculateNextPayment(normalDate) {
  let currentDate;

  currentDate = moment(normalDate);
  currentDate.add(30, "days").format("YYYY-MM-DD hh:mm");
  return currentDate;
}

module.exports = calculateNextPayment;
