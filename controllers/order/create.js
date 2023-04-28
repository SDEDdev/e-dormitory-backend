const { validationResult } = require("express-validator");
const db = require($ + "/db.js");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const move = require($ + "/modules/files/move");
const canCreate = require($ + "/modules/order/canCreate");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  try {
    const b = req.body;
    const token = req.headers.authorization;
    const { user } = jwt.decode(token, process.env.JWT_SECRET);

    if (!(await canCreate(user.id)))
      return res.status(401).json({
        errors: [{ msg: "Дозволено мати лише одну активну заявку!" }],
      });

    const date = moment().tz("Europe/Kiev").format("YYYY-MM-DD HH:mm:ss");

    const orders_id = await db(
      "INSERT INTO orders (user_id, first_name, last_name, sur_name, faculty_id, course, `group`, hostel, passport, rnocpp, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?); SELECT id FROM orders WHERE user_id = ?;",
      [
        user.id,
        b.first_name,
        b.last_name,
        b.sur_name,
        b.faculty_id,
        b.course,
        b.group,
        b.hostel,
        b.passport,
        b.rnocpp,
        date,
        user.id,
      ]
    );

    move(res, orders_id[1][0].id, req.files);
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: [{ msg: "Помилка даних" }] });
  }
};
