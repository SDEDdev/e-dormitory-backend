const db = require($ + "/db.js");

module.exports = async (req, res) => {
  try {
    var data;
    var query =
      "SELECT orders.id, first_name, last_name, sur_name, gender, faculties.name AS faculty, course.name AS course, `group`, order_statuses.name AS status FROM orders INNER JOIN rooms ON orders.room_id = rooms.id INNER JOIN course ON orders.course_id = course.id INNER JOIN faculties ON orders.faculty_id = faculties.id INNER JOIN order_statuses ON orders.status = order_statuses.id";

    if (req.user.roles.includes("user")) {
      data = await db(query + " WHERE user_id = ?", [req.user.id]);
    }

    if (req.user.roles.includes("dean")) {
      const faculties = await db("SELECT id FROM faculties WHERE dean_id = ?", [
        req.user.id,
      ]);
      data = await db(query + " WHERE faculty_id = ?", [faculties[0].id]);
    }

    if (req.user.roles.includes("commandant")) {
      const dormitory = await db(
        "SELECT id FROM dormitories WHERE commandant_id = ?",
        [req.user.id]
      );
      data = await db("SELECT * FROM orders WHERE dormitory_id = ?", [
        dormitory[0].id,
      ]);
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: [{ msg: "Помилка даних" }] });
  }
};
